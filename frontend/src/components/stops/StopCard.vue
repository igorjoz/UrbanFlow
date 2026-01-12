<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useDelays, type Delay } from '@/composables/useDelays'
import { useUserStopsStore, type UserStop } from '@/stores/userStops'
import { formatTime, formatDelay, formatDelayClass } from '@/plugins/formatters'
import BaseButton from '@/components/common/BaseButton.vue'

interface Props {
  stop: UserStop
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
})

const emit = defineEmits<{
  remove: [id: number]
}>()

const userStopsStore = useUserStopsStore()

const stopIdRef = ref(props.stop.stopId)
const { delays, loading, error, lastUpdate, startAutoRefresh, stopAutoRefresh } = useDelays(stopIdRef)

const isExpanded = ref(props.expanded)

const topDelays = computed<Delay[]>(() => {
  return delays.value.slice(0, 5)
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const handleRemove = () => {
  if (confirm(`Czy na pewno chcesz usunąć przystanek "${props.stop.stopName}"?`)) {
    emit('remove', props.stop.id)
  }
}

onMounted(() => {
  startAutoRefresh(30000) // Refresh every 30 seconds
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
    <!-- Header -->
    <div 
      class="px-4 py-3 bg-gradient-to-r from-ztm-blue to-ztm-dark-blue cursor-pointer"
      @click="toggleExpanded"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">🚏</span>
          <div>
            <h3 class="text-white font-semibold">{{ stop.stopName }}</h3>
            <p class="text-blue-100 text-xs">ID: {{ stop.stopId }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <span 
            v-if="loading" 
            class="text-blue-100 text-sm animate-pulse"
          >
            Ładowanie...
          </span>
          <span 
            v-else-if="delays.length > 0" 
            class="bg-white text-ztm-blue px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ delays.length }} odjazd{{ delays.length === 1 ? '' : delays.length < 5 ? 'y' : 'ów' }}
          </span>
          
          <svg 
            :class="['w-5 h-5 text-white transition-transform', isExpanded ? 'rotate-180' : '']"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <Transition name="slide">
      <div v-show="isExpanded" class="divide-y divide-gray-100">
        <!-- Error state -->
        <div v-if="error" class="p-4 bg-red-50 text-red-700 text-sm">
          {{ error }}
        </div>
        
        <!-- Loading state -->
        <div v-else-if="loading && delays.length === 0" class="p-4">
          <div class="flex items-center justify-center space-x-2 text-gray-500">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Pobieranie danych...</span>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="delays.length === 0" class="p-4 text-center text-gray-500">
          Brak najbliższych odjazdów
        </div>
        
        <!-- Delays list -->
        <div v-else class="divide-y divide-gray-100">
          <div 
            v-for="delay in topDelays" 
            :key="delay.id"
            class="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div class="flex items-center space-x-3">
              <span class="bg-ztm-yellow text-ztm-blue font-bold px-3 py-1 rounded-md text-sm min-w-[3rem] text-center">
                {{ delay.routeShortName || delay.routeId }}
              </span>
              <div>
                <p class="font-medium text-gray-900">{{ delay.headsign }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(delay.estimatedTime) }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <span 
                :class="['px-2 py-1 rounded text-sm font-medium', formatDelayClass(delay.delayInSeconds)]"
              >
                {{ formatDelay(delay.delayInSeconds) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <div class="text-xs text-gray-500">
            <span v-if="lastUpdate">
              Aktualizacja: {{ formatTime(lastUpdate) }}
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <RouterLink 
              :to="`/stop/${stop.stopId}`"
              class="text-ztm-blue hover:text-ztm-dark-blue text-sm font-medium"
            >
              Szczegóły →
            </RouterLink>
            
            <BaseButton 
              variant="ghost" 
              size="sm"
              class="text-red-600 hover:text-red-700 hover:bg-red-50"
              @click.stop="handleRemove"
            >
              Usuń
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
