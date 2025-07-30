import type { Tabs } from 'webextension-polyfill'
import type { DailyStats, TimeSession } from '../types/index'
import { currentTab, currentTabStartTime, extOptions, isChromeFocused, lastSystemCheck, timeTrackerData, today } from '~/logic/storage'
import { getDomainIcon, getMainDomain, getNextMidnightTimestamp, shouldTrackUrl } from '~/logic/utils'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
}

const USE_SIDE_PANEL = true as const
const ALARM_NAMES = {
  MIDNIGHT_CHECK: 'midnightCheck',
  LAST_SYSTEM_CHECK: 'lastSystemCheck',
} as const

const TIMING = {
  SYSTEM_CHECK_INTERVAL: 30 / 60, // 30 seconds
  SYSTEM_SLEEP_THRESHOLD: 30000, // 30 seconds
  DAILY_MINUTES: 24 * 60, // 24 hours in minutes
} as const

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
}

browser.runtime.onInstalled.addListener(async () => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
  checkAndSetNewDate()
  await setupMidnightAlarm()
  await setupSystemCheckAlarm()
})
browser.runtime.onStartup.addListener(async () => {
  // eslint-disable-next-line no-console
  console.log('Extension started')
  checkAndSetNewDate()
  await setupMidnightAlarm()
  await setupSystemCheckAlarm()
})
browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAMES.MIDNIGHT_CHECK) {
    // eslint-disable-next-line no-console
    console.log('Midnight alarm triggered! Checking for new day...')
    checkAndSetNewDate()
  }

  if (alarm.name === ALARM_NAMES.LAST_SYSTEM_CHECK) {
    // eslint-disable-next-line no-console
    console.log('Alarm \'lastSystemCheck\' fired! Performing task...')
    checkAndHandleSystemSleep()
  }
})
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  await handleTabUpdate({ tabId })
})
browser.tabs.onUpdated.addListener(async (tabId, { favIconUrl, status }) => {
  if (favIconUrl) {
    setFaviconForTab(favIconUrl)
  }

  if (status === 'complete') {
    await handleTabUpdate({ tabId })
  }
})
browser.windows.onFocusChanged.addListener(async (windowId) => {
  isChromeFocused.value = windowId !== browser.windows.WINDOW_ID_NONE
  if (!isChromeFocused.value) {
    endCurrentSession()
    currentTab.value = 'idle'
    currentTabStartTime.value = Date.now()
    timeTrackerData.value.currentSession = null
    return
  }

  checkAndSetNewDate()
  const tab = await getActiveTab()
  if (tab && tab.id) {
    await startTrackingTab(tab.id)
  }
})

async function getActiveTab(): Promise<Tabs.Tab | undefined> {
  const queryOptions: Tabs.QueryQueryInfoType = { active: true, currentWindow: true }
  const tabs = await browser.tabs.query(queryOptions)
  return tabs[0]
}

async function handleTabUpdate({ tabId }: { tabId: number }) {
  const tab = await browser.tabs.get(tabId)
  if (!tab.url)
    return

  const domain = getMainDomain(tab.url, { removeSubdomains: false })

  if (domain === currentTab.value)
    return

  endCurrentSession()
  await startTrackingTab(tabId)
}

async function startTrackingTab(tabId: number) {
  try {
    const tab = await browser.tabs.get(tabId)

    if (!tab || !tab.url)
      return

    if (tab.active === false)
      return

    if (!shouldTrackUrl(tab.url, extOptions.value))
      return

    const domain = getMainDomain(tab.url, { removeSubdomains: false })
    saveCurrentSession({
      domain,
      startTime: Date.now(),
    })
  }
  catch (error) {
    console.error('Error tracking tab:', error)
  }
}

function endCurrentSession(endTime?: number) {
  if (!currentTabStartTime.value || !currentTab.value)
    return

  endTime = endTime || Date.now()
  const duration = endTime - currentTabStartTime.value

  saveSiteTime(currentTab.value, {
    startTime: currentTabStartTime.value,
    endTime,
    duration,
  })

  timeTrackerData.value.currentSession = null
  currentTabStartTime.value = Date.now()
  currentTab.value = 'idle'
}

function saveCurrentSession({ domain, startTime }: { domain: string, startTime: number }) {
  currentTabStartTime.value = startTime
  currentTab.value = domain
  timeTrackerData.value.currentSession = {
    domain,
    startTime,
  }
}

async function setupSystemCheckAlarm() {
  await browser.alarms.clear(ALARM_NAMES.LAST_SYSTEM_CHECK)
  browser.alarms.create(ALARM_NAMES.LAST_SYSTEM_CHECK, { periodInMinutes: TIMING.SYSTEM_CHECK_INTERVAL })
}

async function setupMidnightAlarm() {
  const nextMidnightTime = getNextMidnightTimestamp()

  await browser.alarms.clear(ALARM_NAMES.MIDNIGHT_CHECK)
  browser.alarms.create(ALARM_NAMES.MIDNIGHT_CHECK, {
    when: nextMidnightTime, // Set the first alarm to fire at the precise next midnight
    periodInMinutes: TIMING.DAILY_MINUTES,
  })

  // eslint-disable-next-line no-console
  console.log(
    `Midnight alarm scheduled. First fire at: ${new Date(
      nextMidnightTime,
    ).toLocaleString()}`,
  )
}

function checkAndSetNewDate() {
  const now = new Date().toISOString().split('T')[0]

  if (now === today.value)
    return

  // eslint-disable-next-line no-console
  console.log(`New day detected! Old: ${today.value}, New: ${now}`)
  today.value = now
}

function checkAndHandleSystemSleep() {
  const now = Date.now()

  // Check if we missed time (system sleep)
  const gap = now - lastSystemCheck.value

  if (gap > TIMING.SYSTEM_SLEEP_THRESHOLD) {
    // End any current session at the last saved time
    endCurrentSession(lastSystemCheck.value)
  }

  lastSystemCheck.value = now
}

function setFaviconForTab(favIconUrl: string) {
  if (!currentTab.value || currentTab.value === 'idle')
    return

  const startDate = new Date(currentTabStartTime.value).toISOString().split('T')[0]

  if (!timeTrackerData.value.dailyStats[startDate]?.sites[currentTab.value])
    return

  if (!timeTrackerData.value.dailyStats[startDate].sites[currentTab.value].favicon) {
    timeTrackerData.value.dailyStats[startDate].sites[currentTab.value].favicon = favIconUrl
    // eslint-disable-next-line no-console
    console.log(`Favicon for ${currentTab.value} set to ${favIconUrl}`)
  }
}

function saveSiteTime(domain: string, session: TimeSession) {
  if (!domain || !session || !session.startTime || !session.endTime || domain === 'idle')
    return

  // set new item if not exists
  if (!timeTrackerData.value.dailyStats[today.value]) {
    timeTrackerData.value.dailyStats[today.value] = {
      date: today.value,
      sites: {},
      totalTime: 0,
    }
  }

  if (!timeTrackerData.value.dailyStats[today.value].sites[domain]) {
    timeTrackerData.value.dailyStats = {
      ...timeTrackerData.value.dailyStats,
      [today.value]: {
        ...timeTrackerData.value.dailyStats[today.value],
        sites: {
          ...timeTrackerData.value.dailyStats[today.value].sites,
          [domain]: {
            domain,
            totalTime: 0,
            sessions: [],
            lastVisited: Date.now(),
          },
        },
      },
    }
  }

  const newDailyStats: DailyStats = {
    ...timeTrackerData.value.dailyStats[today.value],
    totalTime: timeTrackerData.value.dailyStats[today.value].totalTime += session.duration,
    sites: {
      ...timeTrackerData.value.dailyStats[today.value].sites,
      [domain]: {
        ...timeTrackerData.value.dailyStats[today.value].sites[domain],
        totalTime: timeTrackerData.value.dailyStats[today.value].sites[domain].totalTime += session.duration,
        sessions: [...timeTrackerData.value.dailyStats[today.value].sites[domain].sessions, session],
        lastVisited: session.endTime,
      },
    },
  }

  timeTrackerData.value.dailyStats[today.value] = newDailyStats

  if (!timeTrackerData.value.dailyStats[today.value].sites[domain].favicon) {
    timeTrackerData.value.dailyStats[today.value].sites[domain].favicon = getDomainIcon(domain)
  }
}
