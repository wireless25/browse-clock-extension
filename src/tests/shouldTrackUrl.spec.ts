import { describe, expect, it, vi } from 'vitest'
import { shouldTrackUrl } from '~/logic/utils'
import type { ExtensionOptions } from '~/types/index'
import * as env from '~/env'

describe('shouldTrackUrl', () => {
  const baseOptions: ExtensionOptions = {
    trackLocalhost: true,
    excludeList: [],
    allowList: [],
  }

  it('returns false for empty url', () => {
    expect(shouldTrackUrl('', baseOptions)).toBe(false)
  })

  it('returns false if isForbiddenUrl returns true', () => {
    vi.spyOn(env, 'isForbiddenUrl').mockReturnValue(true)
    expect(shouldTrackUrl('chrome-extension://', baseOptions)).toBe(false)
    vi.restoreAllMocks()
  })

  it('returns false for localhost if trackLocalhost is false', () => {
    expect(shouldTrackUrl('http://localhost:3000', { ...baseOptions, trackLocalhost: false })).toBe(false)
  })

  it('returns true for localhost if trackLocalhost is true', () => {
    expect(shouldTrackUrl('http://localhost:3000', baseOptions)).toBe(true)
  })

  it('returns false if url is in excludeList', () => {
    const options = { ...baseOptions, excludeList: ['https://exclude.com'] }
    expect(shouldTrackUrl('https://exclude.com/page', options)).toBe(false)
  })

  it('returns false if allowList is set and url is not allowed', () => {
    const options = { ...baseOptions, allowList: ['https://allowed.com'] }
    expect(shouldTrackUrl('https://notallowed.com', options)).toBe(false)
  })

  it('returns true if allowList is set and url is allowed', () => {
    const options = { ...baseOptions, allowList: ['https://allowed.com'] }
    expect(shouldTrackUrl('https://allowed.com/page', options)).toBe(true)
  })

  it('returns false if the url is in exclude list and allow list', () => {
    const options = { ...baseOptions, excludeList: ['https://excluded.com'], allowList: ['https://excluded.com'] }
    expect(shouldTrackUrl('https://excluded.com', options)).toBe(false)
  })

  it('returns true for normal url', () => {
    vi.spyOn(env, 'isForbiddenUrl').mockReturnValue(false)
    expect(shouldTrackUrl('https://example.com', baseOptions)).toBe(true)
    vi.restoreAllMocks()
  })
})
