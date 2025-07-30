import { describe, expect, it } from 'vitest'
import { formatDuration, formatTime } from '~/logic/utils'

describe('formatTime', () => {
  it('should format a timestamp into a HH:mm:ss string', () => {
    const timestamp = new Date('2024-01-01T14:25:30').getTime()
    expect(formatTime(timestamp)).toBe('14:25:30')
  })

  it('should handle midnight correctly', () => {
    const timestamp = new Date('2024-01-01T00:00:00').getTime()
    expect(formatTime(timestamp)).toBe('00:00:00')
  })
})

describe('formatDuration', () => {
  it('should format milliseconds into a human-readable string', () => {
    expect(formatDuration(1000)).toBe('1s')
    expect(formatDuration(60000)).toBe('1m 0s')
    expect(formatDuration(61000)).toBe('1m 1s')
    expect(formatDuration(3600000)).toBe('1h 0m 0s')
    expect(formatDuration(3661000)).toBe('1h 1m 1s')
  })

  it('should handle zero correctly', () => {
    expect(formatDuration(0)).toBe('0s')
  })
})
