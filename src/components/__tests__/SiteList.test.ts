import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
                startTime: 1753967876,
                endTime: 1753967876,
                duration: 1233,
              },
            ],
            lastVisited: 1753967876,
            favicon: 'https://www.google.com/s2/favicons?domain=icones.js.org&sz=64',
          },
          {
            domain: 'sozialinfo.ch',
            totalTime: 1176,
            sessions: [
              {
                startTime: 1753967775,
                endTime: 1753967785,
                duration: 1176,
              },
            ],
            lastVisited: 1753967785,
            favicon: 'https://www.google.com/s2/favicons?domain=sozialinfo.ch&sz=64',
          },
          {
            domain: 'nuxt.com',
            totalTime: 721,
            sessions: [
              {
                startTime: 1753967776,
                endTime: 1753967777,
                duration: 721,
              },
            ],
            lastVisited: 1753967777,
            favicon: 'https://www.google.com/s2/favicons?domain=nuxt.com&sz=64',
          },
        ],
        totalTime: 10000,
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })
})
