import { ref, readonly, onUnmounted, type Ref } from 'vue'
import { useFetch } from './useFetch'

interface Delay {
  id: string
  routeId: number
  routeShortName: string
  headsign: string
  theoreticalTime: string
  estimatedTime: string
  delayInSeconds: number
  delayFormatted: string
  status: string
  vehicleCode: number | null
}

interface DelaysResponse {
  stopId: number
  count: number
  delays: Delay[]
  lastUpdate: string
}

interface UseDelaysReturn {
  delays: Ref<Delay[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  lastUpdate: Ref<string | null>
  fetchDelays: () => Promise<void>
  startAutoRefresh: (intervalMs?: number) => void
  stopAutoRefresh: () => void
}

/**
 * Composable for fetching and auto-refreshing delays for a stop
 */
export function useDelays(stopId: Ref<number> | number): UseDelaysReturn {
  const delays = ref<Delay[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdate = ref<string | null>(null)
  
  let refreshInterval: ReturnType<typeof setInterval> | null = null
  
  const { get } = useFetch<DelaysResponse>()

  const fetchDelays = async (): Promise<void> => {
    const id = typeof stopId === 'number' ? stopId : stopId.value
    
    if (!id) {
      error.value = 'Brak ID przystanku'
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await get(`/delays/${id}`)
      
      if (response) {
        delays.value = response.delays || []
        lastUpdate.value = response.lastUpdate
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Błąd pobierania danych'
      delays.value = []
    } finally {
      loading.value = false
    }
  }

  const startAutoRefresh = (intervalMs: number = 30000): void => {
    stopAutoRefresh()
    
    // Fetch immediately
    fetchDelays()
    
    // Then set interval
    refreshInterval = setInterval(fetchDelays, intervalMs)
  }

  const stopAutoRefresh = (): void => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    delays: readonly(delays) as Ref<Delay[]>,
    loading: readonly(loading) as Ref<boolean>,
    error: readonly(error) as Ref<string | null>,
    lastUpdate: readonly(lastUpdate) as Ref<string | null>,
    fetchDelays,
    startAutoRefresh,
    stopAutoRefresh,
  }
}

export type { Delay, DelaysResponse }
export default useDelays
