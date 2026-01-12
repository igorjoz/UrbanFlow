<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStopsStore } from '@/stores/userStops'
import { AppLayout } from '@/components/layout'
import { StopMap } from '@/components/map'
import BaseAlert from '@/components/common/BaseAlert.vue'

interface StopLocation {
  stopId: number
  stopName: string
  stopLat: number
  stopLon: number
  subName?: string
}

const router = useRouter()
const userStopsStore = useUserStopsStore()

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const handleStopClick = (stop: StopLocation) => {
  router.push(`/stop/${stop.stopId}`)
}

const handleAddStop = async (stop: StopLocation) => {
  if (userStopsStore.isStopAdded(stop.stopId)) {
    errorMessage.value = 'Ten przystanek jest już na liście'
    return
  }
  
  const success = await userStopsStore.addStop(stop.stopId, stop.stopName)
  
  if (success) {
    successMessage.value = `Dodano przystanek "${stop.stopName}"`
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } else {
    errorMessage.value = userStopsStore.error || 'Nie udało się dodać przystanku'
  }
}

onMounted(() => {
  userStopsStore.fetchStops()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mapa przystanków</h1>
        <p class="text-gray-600">Przeglądaj przystanki ZTM Gdańsk</p>
      </div>
      
      <!-- Messages -->
      <Transition name="fade">
        <BaseAlert 
          v-if="successMessage" 
          type="success"
          dismissible
          @dismiss="successMessage = null"
        >
          {{ successMessage }}
        </BaseAlert>
      </Transition>
      
      <Transition name="fade">
        <BaseAlert 
          v-if="errorMessage" 
          type="error"
          dismissible
          @dismiss="errorMessage = null"
        >
          {{ errorMessage }}
        </BaseAlert>
      </Transition>
      
      <!-- Map -->
      <StopMap
        height="calc(100vh - 280px)"
        :show-user-stops="true"
        @stop-click="handleStopClick"
        @add-stop="handleAddStop"
      />
    </div>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
