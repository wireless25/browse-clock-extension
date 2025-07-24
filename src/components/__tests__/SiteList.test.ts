import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteList from '../SiteList.vue'

describe('site list component', () => {
  it('should render', () => {
    const wrapper = mount(SiteList, {
      props: {
        sites: [
          {
            domain: 'icones.js.org',
            totalTime: 1233,
            sessions: [
              {
                startTime: '2025-07-24T08:56:14.518Z',
                endTime: '2025-07-24T08:56:15.751Z',
                duration: 1233,
              },
            ],
            lastVisited: '2025-07-24T08:56:15.751Z',
            favicon: 'https://www.google.com/s2/favicons?domain=icones.js.org&sz=64',
          },
          {
            domain: 'sozialinfo.ch',
            totalTime: 1176,
            sessions: [
              {
                startTime: '2025-07-24T08:56:15.781Z',
                endTime: '2025-07-24T08:56:16.957Z',
                duration: 1176,
              },
            ],
            lastVisited: '2025-07-24T08:56:16.957Z',
            favicon: 'https://www.google.com/s2/favicons?domain=sozialinfo.ch&sz=64',
          },
          {
            domain: 'nuxt.com',
            totalTime: 721,
            sessions: [
              {
                startTime: '2025-07-24T08:56:16.983Z',
                endTime: '2025-07-24T08:56:17.704Z',
                duration: 721,
              },
            ],
            lastVisited: '2025-07-24T08:56:17.704Z',
            favicon: 'https://www.google.com/s2/favicons?domain=nuxt.com&sz=64',
          },
        ],
        totalTime: 10000,
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })
})
