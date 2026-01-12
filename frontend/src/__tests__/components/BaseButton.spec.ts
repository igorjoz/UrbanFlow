import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/common/BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('shows loading spinner when loading', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Submit' }
    })
    
    expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
  })

  it('applies variant classes correctly', () => {
    const primaryWrapper = mount(BaseButton, { props: { variant: 'primary' } })
    expect(primaryWrapper.classes()).toContain('bg-ztm-blue')
    
    const dangerWrapper = mount(BaseButton, { props: { variant: 'danger' } })
    expect(dangerWrapper.classes()).toContain('bg-red-600')
  })

  it('applies size classes correctly', () => {
    const smWrapper = mount(BaseButton, { props: { size: 'sm' } })
    expect(smWrapper.classes()).toContain('px-3')
    
    const lgWrapper = mount(BaseButton, { props: { size: 'lg' } })
    expect(lgWrapper.classes()).toContain('px-6')
  })

  it('applies full width class when fullWidth is true', () => {
    const wrapper = mount(BaseButton, { props: { fullWidth: true } })
    
    expect(wrapper.classes()).toContain('w-full')
  })
})
