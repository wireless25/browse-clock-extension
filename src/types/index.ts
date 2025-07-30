export interface SiteTimeData {
  domain: string
  totalTime: number // milliseconds
  sessions: TimeSession[]
  lastVisited: number // timestamp
  favicon?: string
}

export interface TimeSession {
  startTime: number // timestamp
  endTime: number // timestamp
  duration: number
}

export interface DailyStats {
  date: string // ISO date string
  sites: { [x: string]: SiteTimeData }
  totalTime: number
}

export interface StorageData {
  currentSession: {
    domain: string
    startTime: number
  } | null
  dailyStats: Record<any, DailyStats>
}

export interface ChartDataPoint {
  label: string
  value: number
  date: string
}

// Activity ring data interface
export interface RingData {
  label: string
  value: number
  target: number
  color: string
}

export interface ExtensionOptions {
  trackLocalhost: boolean
  allowList: string[]
  excludeList: string[]
}
