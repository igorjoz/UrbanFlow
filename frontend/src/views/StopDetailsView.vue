<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDelays, type Delay } from '@/composables/useDelays'
import { useFetch } from '@/composables/useFetch'
import { useUserStopsStore } from '@/stores/userStops'
import { AppLayout } from '@/components/layout'
import { DelayTable } from '@/components/stops'
import { StopMap } from '@/components/map'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

interface StopInfo {
  stopId: number
  stopName: string
  stopDesc?: string
  subName?: string
  zoneId?: number
  zoneName?: string
  stopLat?: number
  stopLon?: number
}

const route = useRoute()
const router = useRouter()
const userStopsStore = useUserStopsStore()

const stopId = computed(() => Number(route.params.id))
const stopInfo = ref<StopInfo | null>(null)
const stopLoading = ref(false)
const stopError = ref<string | null>(null)

const { get } = useFetch<StopInfo>()

const { 
  delays, 
  loading: delaysLoading, 
  error: delaysError,
  lastUpdate,
  startAutoRefresh,
  stopAutoRefresh
} = useDelays(stopId)

const isAdded = computed(() => userStopsStore.isStopAdded(stopId.value))

const fetchStopInfo = async () => {
  stopLoading.value = true
  stopError.value = null
  
  try {
    const response = await get(`/stops/${stopId.value}`) as { stop: StopInfo } | StopInfo | null
    
    if (response) {
      // API returns { stop: StopInfo } wrapper
      stopInfo.value = 'stop' in response ? response.stop : response
    }
  } catch (err) {
    stopError.value = 'Nie udało się pobrać informacji o przystanku'
  } finally {
    stopLoading.value = false
  }
}

const toggleStop = async () => {
  if (isAdded.value) {
    const userStop = userStopsStore.stops.find(s => s.stopId === stopId.value)
    if (userStop) {
      await userStopsStore.removeStop(userStop.id)
    }
  } else if (stopInfo.value) {
    await userStopsStore.addStop(stopInfo.value.stopId, stopInfo.value.stopName)
  }
}

const goBack = () => {
  router.back()
}

// Watch for route changes
watch(stopId, () => {
  fetchStopInfo()
  stopAutoRefresh()
  startAutoRefresh(30000)
})

onMounted(() => {
  fetchStopInfo()
  userStopsStore.fetchStops()
  startAutoRefresh(30000)
})
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Back button -->
      <div>
        <button
          class="inline-flex items-center text-gray-600 hover:text-gray-900"
          @click="goBack"
        >
          <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Wróć
        </button>
      </div>
      
      <!-- Error states -->
      <BaseAlert v-if="stopError" type="error">
        {{ stopError }}
      </BaseAlert>
      
      <!-- Loading -->
      <div v-if="stopLoading" class="flex justify-center py-12">
        <div class="flex items-center space-x-2 text-gray-500">
          <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Ładowanie...</span>
        </div>
      </div>
      
      <!-- Stop content -->
      <template v-else-if="stopInfo">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center space-x-4">
              <span class="text-4xl">🚏</span>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ stopInfo.stopName }}</h1>
                <p class="text-gray-500">
                  ID: {{ stopInfo.stopId }}
                  <span v-if="stopInfo.subName"> • {{ stopInfo.subName }}</span>
                  <span v-if="stopInfo.zoneName"> • Strefa: {{ stopInfo.zoneName }}</span>
                </p>
              </div>
            </div>
            
            <BaseButton
              :variant="isAdded ? 'secondary' : 'primary'"
              @click="toggleStop"
              :loading="userStopsStore.loading"
            >
              <template v-if="isAdded">
                <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Na liście
              </template>
              <template v-else>
                <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Dodaj do listy
              </template>
            </BaseButton>
          </div>
        </div>
        
        <!-- Map (if coordinates available) -->
        <div 
          v-if="stopInfo.stopLat && stopInfo.stopLon" 
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <h2 class="text-lg font-semibold text-gray-900 px-6 py-4 border-b">
            Lokalizacja
          </h2>
          <StopMap
            height="300px"
            :initial-center="[stopInfo.stopLat, stopInfo.stopLon]"
            :initial-zoom="16"
            :highlight-stop-id="stopId"
            :show-user-stops="false"
          />
        </div>
        
        <!-- Delays table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Najbliższe odjazdy</h2>
              <p v-if="lastUpdate" class="text-sm text-gray-500">
                Aktualizacja: {{ lastUpdate }}
              </p>
            </div>
            
            <div class="flex items-center space-x-2">
              <span 
                v-if="delaysLoading" 
                class="text-sm text-gray-500 animate-pulse"
              >
                Odświeżanie...
              </span>
              <span 
                v-else-if="delays.length > 0"
                class="bg-ztm-blue text-white px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ delays.length }} odjazd{{ delays.length === 1 ? '' : delays.length < 5 ? 'y' : 'ów' }}
              </span>
            </div>
          </div>
          
          <BaseAlert v-if="delaysError" type="error" class="m-4">
            {{ delaysError }}
          </BaseAlert>
          
          <DelayTable 
            :delays="delays" 
            :loading="delaysLoading && delays.length === 0" 
          />
        </div>
      </template>
    </div>
  </AppLayout>
</template>
