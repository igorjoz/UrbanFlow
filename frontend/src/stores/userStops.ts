import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'

interface UserStop {
  id: number
  stopId: number
  stopName: string
  userId?: number
  createdAt?: string
  updatedAt?: string
}

interface StopInfo {
  stopId: number
  stopName: string
  stopDesc?: string
  subName?: string
  date?: string
  zoneId?: number
  zoneName?: string
}

export const useUserStopsStore = defineStore('userStops', () => {
  // State
  const stops = ref<UserStop[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedStops = computed(() => 
    [...stops.value].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
  )
  
  const stopIds = computed(() => stops.value.map(s => s.stopId))
  
  const hasStops = computed(() => stops.value.length > 0)

  // Actions
  const fetchStops = async (): Promise<void> => {
    const { get } = useFetch<{ stops: UserStop[] }>()
    
    loading.value = true
    error.value = null
    
    try {
      const response = await get('/user-stops')
      
      if (response) {
        stops.value = response.stops
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Błąd pobierania przystanków'
    } finally {
      loading.value = false
    }
  }

  const addStop = async (stopId: number, stopName: string): Promise<boolean> => {
    const { post } = useFetch<{ stop: UserStop }>()
    
    loading.value = true
    error.value = null
    
    try {
      const response = await post('/user-stops', { stopId, stopName })
      
      if (response) {
        stops.value.push(response.stop)
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Błąd dodawania przystanku'
      return false
    } finally {
      loading.value = false
    }
  }

  const removeStop = async (id: number): Promise<boolean> => {
    const { del } = useFetch<void>()
    
    loading.value = true
    error.value = null
    
    try {
      await del(`/user-stops/${id}`)
      stops.value = stops.value.filter(s => s.id !== id)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Błąd usuwania przystanku'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateOrder = async (id: number, newOrder: number): Promise<boolean> => {
    const { put } = useFetch<{ stop: UserStop }>()
    
    loading.value = true
    error.value = null
    
    try {
      const response = await put(`/user-stops/${id}`, { display_order: newOrder })
      
      if (response) {
        const index = stops.value.findIndex(s => s.id === id)
        if (index !== -1) {
          stops.value[index] = response.stop
        }
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Błąd aktualizacji kolejności'
      return false
    } finally {
      loading.value = false
    }
  }

  const isStopAdded = (stopId: number): boolean => {
    return stopIds.value.includes(stopId)
  }

  const clearStops = (): void => {
    stops.value = []
    error.value = null
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    stops,
    loading,
    error,
    // Getters
    sortedStops,
    stopIds,
    hasStops,
    // Actions
    fetchStops,
    addStop,
    removeStop,
    updateOrder,
    isStopAdded,
    clearStops,
    clearError,
  }
})

export type { UserStop, StopInfo }
