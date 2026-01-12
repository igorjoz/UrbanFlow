import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-focus directive
 * Automatically focuses an input element when mounted
 * 
 * Usage:
 *   <input v-focus />
 *   <input v-focus="100" />  <!-- delay in ms -->
 */
export const focusDirective: Directive<HTMLElement, number | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<number | undefined>) {
    const delay = binding.value || 0
    
    const focusElement = () => {
      // Handle both direct input elements and containers
      const input = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' 
        ? el 
        : el.querySelector('input, textarea')
      
      if (input instanceof HTMLElement) {
        input.focus()
      }
    }
    
    if (delay > 0) {
      setTimeout(focusElement, delay)
    } else {
      // Use nextTick to ensure DOM is ready
      requestAnimationFrame(focusElement)
    }
  }
}

export default focusDirective
