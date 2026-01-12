<script setup lang="ts">
import { computed } from 'vue'
import type { Delay } from '@/composables/useDelays'
import { formatTime, formatDelay, formatDelayClass } from '@/plugins/formatters'

interface Props {
  delays: Delay[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const columns = [
  { label: 'Linia', field: 'routeId', width: '80px' },
  { label: 'Kierunek', field: 'headsign' },
  { label: 'Planowy', field: 'theoreticalTime', width: '100px' },
  { label: 'Rzeczywisty', field: 'estimatedTime', width: '100px' },
  { label: 'Opóźnienie', field: 'delayInSeconds', width: '120px' },
]

const sortedDelays = computed(() => {
  return [...props.delays].sort((a, b) => {
    const timeA = new Date(a.estimatedTime).getTime()
    const timeB = new Date(b.estimatedTime).getTime()
    return timeA - timeB
  })
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.field"
            :style="col.width ? { width: col.width } : {}"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading state -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-8 text-center">
            <div class="flex items-center justify-center space-x-2 text-gray-500">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Ładowanie danych...</span>
            </div>
          </td>
        </tr>
        
        <!-- Empty state -->
        <tr v-else-if="sortedDelays.length === 0">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">
            Brak danych o odjazdach
          </td>
        </tr>
        
        <!-- Data rows -->
        <tr 
          v-for="delay in sortedDelays" 
          :key="delay.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-3 whitespace-nowrap">
            <span class="bg-ztm-yellow text-ztm-blue font-bold px-3 py-1 rounded-md text-sm">
              {{ delay.routeShortName || delay.routeId }}
            </span>
          </td>
          
          <td class="px-4 py-3">
            <div class="text-sm font-medium text-gray-900">{{ delay.headsign }}</div>
            <div v-if="delay.vehicleCode" class="text-xs text-gray-500">
              Pojazd: {{ delay.vehicleCode }}
            </div>
          </td>
          
          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
            {{ formatTime(delay.theoreticalTime) }}
          </td>
          
          <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ formatTime(delay.estimatedTime) }}
          </td>
          
          <td class="px-4 py-3 whitespace-nowrap">
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                formatDelayClass(delay.delayInSeconds)
              ]"
            >
              {{ formatDelay(delay.delayInSeconds) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
