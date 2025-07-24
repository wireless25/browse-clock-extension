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
