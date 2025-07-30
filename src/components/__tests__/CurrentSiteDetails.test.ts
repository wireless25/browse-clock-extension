import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrentSiteDetails from '~/components/CurrentSiteDetails.vue'

describe('current site details component', () => {
  it('should render the current tab details', () => {
    const wrapper = mount(CurrentSiteDetails, {
      props: {
        currentTab: 'example.com',
        tabVisitedTime: '15m',
      },
    })

    expect(wrapper.html()).toBeTruthy()
    expect(wrapper.text()).toContain('example.com')
    expect(wrapper.text()).toContain('Active session')
    expect(wrapper.text()).toContain('15m')
  })

  it('should show a placeholder when no current tab is idle', () => {
    const wrapper = mount(CurrentSiteDetails, {
      props: {
        currentTab: 'idle',
        tabVisitedTime: '',
      },
    })

    expect(wrapper.html()).toBeTruthy()
    expect(wrapper.text()).toContain('No Active Session')
    expect(wrapper.text()).toContain('Visit a website to start tracking')
  })

  it('should handle strange prop values gracefully', () => {
    const wrapper = mount(CurrentSiteDetails, {
      props: {
        currentTab: '',
        tabVisitedTime: 'asöldkfj',
      },
    })

    expect(wrapper.html()).toBeTruthy()
    expect(wrapper.text()).toContain('No Active Session')
    expect(wrapper.text()).toContain('Visit a website to start tracking')
  })
})
