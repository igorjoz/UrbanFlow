<script setup lang="ts">
import { computed } from 'vue'
import type { UserStop } from '@/stores/userStops'
import StopCard from './StopCard.vue'

interface Props {
  stops: UserStop[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  remove: [id: number]
}>()

const sortedStops = computed(() => 
  [...props.stops].sort((a, b) => a.display_order - b.display_order)
)

const handleRemove = (id: number) => {
  emit('remove', id)
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="grid gap-4 md:grid-cols-2">
      <div 
        v-for="n in 4" 
        :key="n"
        class="bg-white rounded-lg shadow-md p-4 animate-pulse"
      >
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div 
      v-else-if="stops.length === 0" 
      class="text-center py-12 bg-white rounded-lg shadow-md"
    >
      <span class="text-6xl mb-4 block">🚌</span>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Brak zapisanych przystanków
      </h3>
      <p class="text-gray-500">
        Wyszukaj i dodaj przystanki, aby śledzić odjazdy
      </p>
    </div>
    
    <!-- Stops grid -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <StopCard
        v-for="stop in sortedStops"
        :key="stop.id"
        :stop="stop"
        :expanded="sortedStops.length <= 2"
        @remove="handleRemove"
      />
    </div>
  </div>
</template>
