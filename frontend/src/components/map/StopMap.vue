<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'
import { useFetch } from '@/composables/useFetch'
import { useUserStopsStore } from '@/stores/userStops'
import BaseButton from '@/components/common/BaseButton.vue'

interface StopLocation {
  stopId: number
  stopName: string
  stopLat: number
  stopLon: number
  subName?: string
}

interface Props {
  height?: string
  initialCenter?: [number, number]
  initialZoom?: number
  showUserStops?: boolean
  highlightStopId?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px',
  initialCenter: () => [54.3520, 18.6466], // Gdańsk center
  initialZoom: 13,
  showUserStops: true,
})

const emit = defineEmits<{
  'stop-click': [stop: StopLocation]
  'add-stop': [stop: StopLocation]
}>()

const userStopsStore = useUserStopsStore()

const mapRef = ref<InstanceType<typeof LMap> | null>(null)
const mapReady = ref(false)
const stops = ref<StopLocation[]>([])
const loading = ref(false)
const center = ref<LatLngExpression>(props.initialCenter)
const zoom = ref(props.initialZoom)

const { get } = useFetch<{ stops: StopLocation[] }>()

// Helper function to encode SVG as base64 (handles Unicode)
const svgToBase64 = (svg: string): string => {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

// Custom icons - using simple shapes instead of emoji for compatibility
const defaultIcon = computed(() => ({
  iconUrl: svgToBase64(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#0052A5" stroke="white" stroke-width="2"/>
      <rect x="9" y="7" width="6" height="10" rx="1" fill="white"/>
      <line x1="12" y1="17" x2="12" y2="20" stroke="white" stroke-width="2"/>
    </svg>
  `),
  iconSize: [32, 32] as [number, number],
  iconAnchor: [16, 32] as [number, number],
  popupAnchor: [0, -32] as [number, number],
}))

const userStopIcon = computed(() => ({
  iconUrl: svgToBase64(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <circle cx="12" cy="12" r="10" fill="#FFD100" stroke="#0052A5" stroke-width="3"/>
      <polygon points="12,6 14,10 18,10 15,13 16,17 12,15 8,17 9,13 6,10 10,10" fill="#0052A5"/>
    </svg>
  `),
  iconSize: [36, 36] as [number, number],
  iconAnchor: [18, 36] as [number, number],
  popupAnchor: [0, -36] as [number, number],
}))

const highlightedIcon = computed(() => ({
  iconUrl: svgToBase64(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="white" stroke-width="3"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40] as [number, number],
  iconAnchor: [20, 40] as [number, number],
  popupAnchor: [0, -40] as [number, number],
}))

const getIconForStop = (stop: StopLocation) => {
  if (props.highlightStopId === stop.stopId) {
    return highlightedIcon.value
  }
  if (userStopsStore.isStopAdded(stop.stopId)) {
    return userStopIcon.value
  }
  return defaultIcon.value
}


const visibleStops = computed(() => {
  // Don't show markers until map is ready
  if (!mapReady.value) {
    return []
  }
  
  if (props.showUserStops) {
    // Filter to show only user stops or all stops on zoom
    if (zoom.value < 15) {
      return stops.value.filter(s => 
        userStopsStore.isStopAdded(s.stopId) || s.stopId === props.highlightStopId
      )
    }
  }
  return stops.value
})

const fetchStops = async () => {
  loading.value = true
  
  try {
    const response = await get('/stops')
    
    if (response) {
      stops.value = response.stops.filter(s => s.stopLat && s.stopLon)
    }
  } catch (err) {
    console.error('Failed to fetch stops:', err)
  } finally {
    loading.value = false
  }
}

const handleMapReady = () => {
  nextTick(() => {
    mapReady.value = true
  })
}

const handleStopClick = (stop: StopLocation) => {
  emit('stop-click', stop)
}

const handleAddStop = async (stop: StopLocation) => {
  console.log('handleAddStop called for:', stop.stopId, stop.stopName)
  try {
    await userStopsStore.addStop(stop.stopId, stop.stopName)
    console.log('Stop added successfully')
    emit('add-stop', stop)
  } catch (error) {
    console.error('Failed to add stop:', error)
  }
}

const centerOnStop = (stopId: number) => {
  const stop = stops.value.find(s => s.stopId === stopId)
  if (stop && mapRef.value) {
    center.value = [stop.stopLat, stop.stopLon]
    zoom.value = 17
  }
}

// Watch for highlighted stop
watch(() => props.highlightStopId, (stopId) => {
  if (stopId) {
    centerOnStop(stopId)
  }
})

// Global click handler for popup buttons (Leaflet popups are outside Vue's event system)
const handleDocumentClick = async (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('add-stop-btn')) {
    event.preventDefault()
    event.stopPropagation()
    
    const stopId = parseInt(target.dataset.stopId || '0', 10)
    const stopName = target.dataset.stopName || ''
    
    if (stopId && stopName) {
      console.log('Adding stop:', stopId, stopName)
      try {
        await userStopsStore.addStop(stopId, stopName)
        // Update button to show success
        target.textContent = '✓ Dodano'
        target.classList.remove('bg-ztm-blue', 'hover:bg-ztm-dark-blue')
        target.classList.add('bg-green-600', 'cursor-default')
        target.classList.remove('add-stop-btn')
      } catch (error) {
        console.error('Failed to add stop:', error)
        target.textContent = '✗ Błąd'
        target.classList.remove('bg-ztm-blue')
        target.classList.add('bg-red-600')
      }
    }
  }
}

onMounted(() => {
  fetchStops()
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

defineExpose({
  centerOnStop,
  fetchStops,
})
</script>

<template>
  <div class="relative rounded-lg overflow-hidden shadow-lg">
    <!-- Loading overlay -->
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-white bg-opacity-75 z-[1000] flex items-center justify-center"
    >
      <div class="flex items-center space-x-2 text-gray-600">
        <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Ładowanie mapy...</span>
      </div>
    </div>
    
    <!-- Map -->
    <LMap
      ref="mapRef"
      v-model:center="center"
      v-model:zoom="zoom"
      :style="{ height }"
      :use-global-leaflet="false"
      @ready="handleMapReady"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
      
      <LMarker
        v-for="stop in visibleStops"
        :key="stop.stopId"
        :lat-lng="[stop.stopLat, stop.stopLon]"
        @click="handleStopClick(stop)"
      >
        <LIcon
          :icon-url="getIconForStop(stop).iconUrl"
          :icon-size="getIconForStop(stop).iconSize"
          :icon-anchor="getIconForStop(stop).iconAnchor"
          :popup-anchor="getIconForStop(stop).popupAnchor"
        />
        
        <LPopup :options="{ closeButton: true }">
          <div class="min-w-[200px] stop-popup">
            <h3 class="font-semibold text-gray-900 mb-1">{{ stop.stopName }}</h3>
            <p class="text-sm text-gray-500 mb-2">
              ID: {{ stop.stopId }}
              <span v-if="stop.subName"> • {{ stop.subName }}</span>
            </p>
            
            <div class="flex items-center gap-3">
              <a
                :href="`/stop/${stop.stopId}`"
                class="text-ztm-blue hover:text-ztm-dark-blue text-sm font-medium"
              >
                Szczegóły →
              </a>
              
              <button
                v-if="!userStopsStore.isStopAdded(stop.stopId)"
                type="button"
                class="add-stop-btn bg-ztm-blue text-white px-3 py-1 rounded text-sm font-medium hover:bg-ztm-dark-blue cursor-pointer"
                :data-stop-id="stop.stopId"
                :data-stop-name="stop.stopName"
              >
                + Dodaj
              </button>
              <span 
                v-else 
                class="text-green-600 text-sm font-medium"
              >
                ✓ Na liście
              </span>
            </div>
          </div>
        </LPopup>
      </LMarker>
    </LMap>
    
    <!-- Legend -->
    <div class="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md z-[1000] text-sm">
      <h4 class="font-medium text-gray-900 mb-2">Legenda</h4>
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="w-4 h-4 rounded-full bg-ztm-blue"></span>
          <span class="text-gray-600">Przystanek</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="w-4 h-4 rounded-full bg-ztm-yellow border-2 border-ztm-blue"></span>
          <span class="text-gray-600">Twój przystanek</span>
        </div>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        Przybliż mapę, aby zobaczyć wszystkie przystanki
      </p>
    </div>
  </div>
</template>

<style>
/* Leaflet overrides */
.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.leaflet-popup-content {
  margin: 12px 16px;
}
</style>
