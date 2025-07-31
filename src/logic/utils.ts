import type { ExtensionOptions } from '~/types/index'
import { isForbiddenUrl } from '~/env'

export function getNextMidnightTimestamp() {
  const now = new Date()
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // Advance to the next day
    0, // Hour: 00 (midnight)
    0, // Minute: 00
    0, // Second: 00
    0, // Millisecond: 00
  )
  return nextMidnight.getTime() // Returns timestamp in milliseconds
}

export function getLocalISOString(timestamp?: number): string {
  const date = timestamp && !Number.isNaN(timestamp) ? new Date(timestamp) : new Date()

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0')

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0')

  // To match the structure of toISOString, we'll append 'Z' if it's UTC,
  // but for local time, we often omit this or use a timezone offset.
  // For a simple "local ISO-like" string, we'll just concatenate.
  // If you need the timezone offset included, it gets a bit more complex.
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`
}

export function getDomainIcon(domain: string): string {
  if (!domain || typeof domain !== 'string')
    return ''

  const _domain = getMainDomain(domain, { removeSubdomains: true })
  return `https://www.google.com/s2/favicons?domain=${_domain}&sz=64`
}

export function shouldTrackUrl(url: string, options: ExtensionOptions) {
  if (!url)
    return false

  if (isForbiddenUrl(url))
    return false

  if (url.startsWith('http://localhost') && options.trackLocalhost === false)
    return false

  if (options.excludeList.length > 0) {
    const isExcluded = options.excludeList.some(excludedUrl => url.startsWith(excludedUrl))
    if (isExcluded)
      return false
  }

  if (options.allowList.length > 0) {
    const isAllowed = options.allowList.some(allowedUrl => url.startsWith(allowedUrl))
    if (!isAllowed)
      return false
  }

  return true
}

export function getMainDomain(url: string, { removeSubdomains = false }: { removeSubdomains?: boolean }): string {
  try {
    if (!url || typeof url !== 'string')
      return 'unknown'
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // If the URL doesn't start with http or https, treat it as a simple domain
      url = `http://${url}`
    }
    const urlObject = new URL(url)
    const hostname = urlObject.hostname

    // Handle cases where there might be multiple subdomains like 'sub.domain.com'
    const parts = hostname.split('.')
    if (parts.length > 2 && removeSubdomains) {
      // If there are more than two parts, assume the last two form the main domain
      return parts.slice(-2).join('.')
    }
    else if (parts.length === 2) {
      // If there are exactly two parts, it's likely the main domain already
      return hostname
    }
    else {
      // For single-part hostnames (e.g., "localhost" or IP addresses), return as is
      return hostname
    }
  }
  catch {
    return 'unknown'
  }
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0 || (hours > 0 && minutes === 0)) {
    parts.push(`${minutes}m`)
  }
  if (seconds > 0 || (minutes > 0 && seconds === 0) || (hours > 0 && minutes === 0 && seconds === 0) || (hours === 0 && minutes === 0 && seconds === 0)) {
    parts.push(`${seconds}s`)
  }

  return parts.join(' ')
}
