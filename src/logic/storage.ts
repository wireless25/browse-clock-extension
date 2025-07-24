import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import type { StorageData } from '~/types/index'

export const { data: timeTrackerData, dataReady: timeTrackerDataReady } = useWebExtensionStorage<StorageData>('timeTrackerData', {
  currentSession: null,
  dailyStats: {},
}, { writeDefaults: true })

// domain of current tab
export const { data: currentTab, dataReady: currentTabReady } = useWebExtensionStorage<string>('currentTab', '')

// start time of current tab
export const { data: currentTabStartTime, dataReady: currentTabStartTimeReady } = useWebExtensionStorage<string>('currentTabStartTime', new Date().toISOString())

// is the chrome window focused
export const { data: isChromeFocused, dataReady: isChromeFocusedReady } = useWebExtensionStorage<boolean>('isChromeFocused', true, { writeDefaults: true })

export const { data: extOptions, dataReady: extOptionsReady } = useWebExtensionStorage<{ trackLocalhost: boolean, allowList: string[], excludeList: string[] }>('extOptions', {
  trackLocalhost: false,
  allowList: [],
  excludeList: [],
}, { writeDefaults: true })

export const { data: lastSystemCheck, dataReady: lastSystemCheckReady } = useWebExtensionStorage<number>('lastSystemCheck', Date.now(), { writeDefaults: true })

export const { data: today, dataReady: todayReady } = useWebExtensionStorage<string>('today', new Date().toISOString().split('T')[0], { writeDefaults: true })
