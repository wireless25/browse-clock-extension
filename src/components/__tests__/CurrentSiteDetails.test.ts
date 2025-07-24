import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrentSiteDetails from '~/components/CurrentSiteDetails.vue'

describe('current site details component', () => {
  it('should render', () => {
    const wrapper = mount(CurrentSiteDetails, {
      props: {
        site: {
          domain: 'example.com',
          startTime: '2025-07-24T08:56:14.518Z',
        },
        dailyStats: {},
        tabVisitedTime: '15m',
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })
})
