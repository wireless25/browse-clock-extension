export interface SiteTimeData {
  domain: string
  totalTime: number // milliseconds
  sessions: TimeSession[]
  lastVisited: string // ISO date string
  favicon?: string
}

export interface TimeSession {
  startTime: string // ISO date string
  endTime: string // ISO date string
  duration: number
}

export interface DailyStats {
  date: string // YYYY-MM-DD
  sites: { [x: string]: SiteTimeData }
  totalTime: number
}

export interface StorageData {
  currentSession: {
    domain: string
    startTime: string
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
