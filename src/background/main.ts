import type { Tabs } from 'webextension-polyfill'
import type { DailyStats, TimeSession } from '../types/index'
import { currentTab, currentTabStartTime, extOptions, isChromeFocused, lastSystemCheck, timeTrackerData, today } from '~/logic/storage'
import { getDomainIcon, getMainDomain, getNextMidnightTimestamp, shouldTrackUrl } from '~/logic/utils'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
  setupMidnightAlarm()
  checkAndSetNewDate()
})
browser.runtime.onStartup.addListener(() => {
  // eslint-disable-next-line no-console
  console.log('Extension started')
  setupMidnightAlarm()
  checkAndSetNewDate()
})
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'midnightCheck') {
    // eslint-disable-next-line no-console
    console.log('Midnight alarm triggered! Checking for new day...')
    checkAndSetNewDate()
  }
})
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  await handleTabUpdate({ tabId })
})
browser.tabs.onUpdated.addListener(async (tabId) => {
  await handleTabUpdate({ tabId })
})
browser.windows.onFocusChanged.addListener(async (windowId) => {
  isChromeFocused.value = windowId !== browser.windows.WINDOW_ID_NONE
  if (!isChromeFocused.value) {
    await endCurrentSession()
    currentTab.value = 'idle'
    currentTabStartTime.value = new Date().toISOString()
    timeTrackerData.value.currentSession = null
    return
  }

  const tab = await getActiveTab()
  if (tab && tab.id) {
    await startTrackingTab(tab.id)
  }
})

setInterval(async () => {
  const now = Date.now()

  // Check if we missed time (system sleep)
  const gap = now - lastSystemCheck.value

  if (gap > 30000) { // More than 30 seconds gap
    // End any current session at the last saved time
    endCurrentSession(new Date(lastSystemCheck.value))
  }

  lastSystemCheck.value = now
}, 10000)

async function getActiveTab(): Promise<Tabs.Tab | undefined> {
  const queryOptions: Tabs.QueryQueryInfoType = { active: true, currentWindow: true }
  const tabs = await browser.tabs.query(queryOptions)
  return tabs[0]
}

async function handleTabUpdate({ tabId }: { tabId: number }) {
  await endCurrentSession()
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
    await saveCurrentSession({
      domain,
      startTime: new Date().toISOString(),
    })
  }
  catch (error) {
    console.error('Error tracking tab:', error)
  }
}

async function endCurrentSession(endTime?: Date) {
  if (!currentTabStartTime.value || !currentTab.value)
    return

  endTime = endTime || new Date()
  const duration = endTime.getTime() - new Date(currentTabStartTime.value).getTime()

  await saveSiteTime(currentTab.value, {
    startTime: currentTabStartTime.value,
    endTime: endTime.toISOString(),
    duration,
  })

  timeTrackerData.value.currentSession = null
  currentTabStartTime.value = new Date().toISOString()
  currentTab.value = 'idle'
}

async function saveCurrentSession({ domain, startTime }: { domain: string, startTime: string }) {
  currentTabStartTime.value = startTime
  currentTab.value = domain
  timeTrackerData.value.currentSession = {
    domain,
    startTime,
  }
}

function setupMidnightAlarm() {
  const nextMidnightTime = getNextMidnightTimestamp()

  browser.alarms.create('midnightCheck', {
    when: nextMidnightTime, // Set the first alarm to fire at the precise next midnight
    periodInMinutes: 24 * 60, // Subsequent alarms will fire exactly 24 hours after the first
  })

  // eslint-disable-next-line no-console
  console.log(
    `Midnight alarm scheduled. First fire at: ${new Date(
      nextMidnightTime,
    ).toLocaleString()}`,
  )
}

async function checkAndSetNewDate() {
  const now = new Date().toISOString().split('T')[0]

  if (now === today.value)
    return

  // eslint-disable-next-line no-console
  console.log(`New day detected! Old: ${today.value}, New: ${now}`)
  today.value = now
}

async function saveSiteTime(domain: string, session: TimeSession) {
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
            lastVisited: new Date().toISOString(),
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
