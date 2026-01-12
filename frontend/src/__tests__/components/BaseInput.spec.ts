import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/common/BaseInput.vue'

describe('BaseInput', () => {
  it('renders with label', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Email'
      }
    })
    
    expect(wrapper.find('label').text()).toContain('Email')
  })

  it('shows required indicator when required', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        label: 'Email',
        required: true
      }
    })
    
    expect(wrapper.find('label').text()).toContain('*')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' }
    })
    
    await wrapper.find('input').setValue('test@example.com')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test@example.com'])
  })

  it('displays error message', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        error: 'This field is required'
      }
    })
    
    expect(wrapper.find('p.text-red-600').text()).toBe('This field is required')
  })

  it('applies error styles when error is present', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        error: 'Error'
      }
    })
    
    expect(wrapper.find('input').classes()).toContain('border-red-300')
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        disabled: true
      }
    })
    
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies correct input type', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        type: 'password'
      }
    })
    
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })
})
