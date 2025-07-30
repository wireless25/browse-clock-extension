import { describe, expect, it } from 'vitest'
import { getMainDomain } from '~/logic/utils'

describe('getMainDomain', () => {
  it('returns the main domain from a URL', () => {
    const url = 'https://sub.example.com/path?query=123'
    const mainDomain = getMainDomain(url, { removeSubdomains: true })
    expect(mainDomain).toBe('example.com')
  })

  it('returns the main domain with subdomains', () => {
    const url = 'https://www.example.com/path'
    const mainDomain = getMainDomain(url, { removeSubdomains: false })
    expect(mainDomain).toBe('www.example.com')
  })

  it('returns the main domain for a simple domain input', () => {
    const url = 'example.com'
    const mainDomain = getMainDomain(url, { removeSubdomains: true })
    expect(mainDomain).toBe('example.com')
  })

  it('returns the full domain for localhost', () => {
    const url = 'http://localhost:3000/path'
    const mainDomain = getMainDomain(url, { removeSubdomains: true })
    expect(mainDomain).toBe('localhost')
  })
})
