<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStopsStore } from '@/stores/userStops'
import { AppLayout } from '@/components/layout'
import { StopList, AddStopForm } from '@/components/stops'
import BaseAlert from '@/components/common/BaseAlert.vue'

const userStopsStore = useUserStopsStore()

const successMessage = ref<string | null>(null)

const handleStopAdded = (stopId: number, stopName: string) => {
  successMessage.value = `Dodano przystanek "${stopName}" do listy`
  
  setTimeout(() => {
    successMessage.value = null
  }, 3000)
}

const handleRemoveStop = async (id: number) => {
  const success = await userStopsStore.removeStop(id)
  
  if (success) {
    successMessage.value = 'Przystanek został usunięty'
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }
}

onMounted(() => {
  userStopsStore.fetchStops()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600">Twoje zapisane przystanki</p>
        </div>
      </div>
      
      <!-- Success message -->
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
      
      <!-- Error message -->
      <BaseAlert 
        v-if="userStopsStore.error" 
        type="error"
        dismissible
        @dismiss="userStopsStore.clearError()"
      >
        {{ userStopsStore.error }}
      </BaseAlert>
      
      <!-- Add stop form -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Dodaj przystanek
        </h2>
        <AddStopForm @added="handleStopAdded" />
      </div>
      
      <!-- Stops list -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Twoje przystanki ({{ userStopsStore.stops.length }})
        </h2>
        
        <StopList
          :stops="userStopsStore.sortedStops"
          :loading="userStopsStore.loading"
          @remove="handleRemoveStop"
        />
      </div>
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
