import { describe, expect, it, vi } from 'vitest'
import { getNextMidnightTimestamp } from '~/logic/utils'

describe('getNextMidnightTimestamp', () => {
  it('should return the timestamp for the next midnight', () => {
    // Mock current date: 2024-06-01T15:30:00.000Z
    const mockDate = new Date('2024-06-01T15:30:00.000Z')
    vi.setSystemTime(mockDate)

    const result = getNextMidnightTimestamp()
    const expected = new Date(
      mockDate.getFullYear(),
      mockDate.getMonth(),
      mockDate.getDate() + 1,
      0,
      0,
      0,
      0,
    ).getTime()
    expect(result).toBe(expected)

    vi.useRealTimers()
  })

  it('should work correctly near midnight', () => {
    // Mock current date: 2024-06-01T23:59:59.999Z
    const mockDate = new Date('2024-06-01T23:59:59.999Z')
    vi.setSystemTime(mockDate)

    const result = getNextMidnightTimestamp()
    const expected = new Date(
      mockDate.getFullYear(),
      mockDate.getMonth(),
      mockDate.getDate() + 1,
      0,
      0,
      0,
      0,
    ).getTime()
    expect(result).toBe(expected)

    vi.useRealTimers()
  })
})
