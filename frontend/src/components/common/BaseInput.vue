<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface Props {
  modelValue: string
  label?: string
  error?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()

const inputClasses = computed(() => [
  'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400',
  'focus:outline-none focus:ring-1 sm:text-sm transition-colors',
  props.error
    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-ztm-blue focus:border-ztm-blue',
  props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-1">
    <label 
      v-if="label" 
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      v-bind="attrs"
      @input="handleInput"
    />
    
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
