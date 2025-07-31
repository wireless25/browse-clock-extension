import { describe, expect, it, vi } from 'vitest'
import { getLocalISOString } from '~/logic/utils'

describe('getLocalISOString', () => {
  it('returns the local ISO string for a given date', () => {
    // Mock current date: 2024-06-01T15:30:00.000Z
    const mockDate = new Date('2024-06-01T15:30:00.000Z')
    vi.setSystemTime(mockDate)
    const offset = mockDate.getTimezoneOffset()
    const offsetHours = Math.floor(Math.abs(offset) / 60)

    const isoString = getLocalISOString()
    expect(isoString).toBe(`2024-06-01T${offsetHours + 15}:30:00.000`)
    vi.useRealTimers()
  })

  it('sets the ISO string for a given timestamp', () => {
    const mockDate = new Date('2025-08-01T10:37:30.979Z')
    vi.setSystemTime(mockDate)
    const offset = mockDate.getTimezoneOffset()
    const offsetHours = Math.floor(Math.abs(offset) / 60)
    const isoString = getLocalISOString(mockDate.getTime())
    expect(isoString).toBe(`2025-08-01T${offsetHours + 10}:37:30.979`)
    vi.useRealTimers()
  })
})
