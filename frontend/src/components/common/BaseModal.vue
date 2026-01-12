<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
})

const emit = defineEmits<{
  close: []
}>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closable) {
    emit('close')
  }
}

const handleBackdropClick = () => {
  if (props.closable) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleBackdropClick"
        />
        
        <!-- Modal container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            :class="[
              'relative bg-white rounded-lg shadow-xl transform transition-all w-full',
              sizeClasses[size]
            ]"
            @click.stop
          >
            <!-- Header -->
            <div 
              v-if="title || closable" 
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              <button
                v-if="closable"
                type="button"
                class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ztm-blue rounded-md p-1"
                @click="emit('close')"
              >
                <span class="sr-only">Zamknij</span>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Body -->
            <div class="px-6 py-4">
              <slot />
            </div>
            
            <!-- Footer -->
            <div 
              v-if="$slots.footer" 
              class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
