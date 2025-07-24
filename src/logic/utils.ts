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
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}
