import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UiButton from '~/components/ui/Button.vue'

describe('uiButton component', () => {
  it('should render', () => {
    const wrapper = mount(UiButton)

    expect(wrapper.html()).toBeTruthy()
  })

  it('shows the slot content', () => {
    const wrapper = mount(UiButton, {
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('listens to click events', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UiButton, {
      props: {
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(onClick).toHaveBeenCalled()
  })
})
