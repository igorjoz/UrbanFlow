<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { useUserStopsStore } from '@/stores/userStops'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

interface StopSearchResult {
  stopId: number
  stopName: string
  stopDesc?: string
  subName?: string
}

const emit = defineEmits<{
  added: [stopId: number, stopName: string]
}>()

const userStopsStore = useUserStopsStore()

const searchQuery = ref('')
const searchResults = ref<StopSearchResult[]>([])
const showResults = ref(false)
const error = ref<string | null>(null)
const addingStopId = ref<number | null>(null)

const { get, loading: searching } = useFetch<{ stops: StopSearchResult[] }>()

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (query) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (query.length < 2) {
    searchResults.value = []
    showResults.value = false
    return
  }
  
  searchTimeout = setTimeout(async () => {
    try {
      const response = await get(`/stops/search?q=${encodeURIComponent(query)}`)
      
      if (response) {
        searchResults.value = response.stops
        showResults.value = true
      }
    } catch (err) {
      error.value = 'Błąd wyszukiwania przystanków'
    }
  }, 300)
})

const addStop = async (stop: StopSearchResult) => {
  if (userStopsStore.isStopAdded(stop.stopId)) {
    error.value = 'Ten przystanek jest już na liście'
    return
  }
  
  addingStopId.value = stop.stopId
  error.value = null
  
  const success = await userStopsStore.addStop(stop.stopId, stop.stopName)
  
  if (success) {
    emit('added', stop.stopId, stop.stopName)
    searchQuery.value = ''
    searchResults.value = []
    showResults.value = false
  } else {
    error.value = userStopsStore.error || 'Nie udało się dodać przystanku'
  }
  
  addingStopId.value = null
}

const handleBlur = () => {
  // Delay hiding results to allow click on result
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const handleFocus = () => {
  if (searchResults.value.length > 0) {
    showResults.value = true
  }
}
</script>

<template>
  <div class="relative">
    <BaseAlert 
      v-if="error" 
      type="error" 
      dismissible 
      class="mb-4"
      @dismiss="error = null"
    >
      {{ error }}
    </BaseAlert>
    
    <div class="relative">
      <div class="flex items-center space-x-2">
        <div class="flex-1">
          <BaseInput
            v-model="searchQuery"
            placeholder="Wyszukaj przystanek..."
            @blur="handleBlur"
            @focus="handleFocus"
          >
            <template #prefix>
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
          </BaseInput>
        </div>
      </div>
      
      <!-- Search results dropdown -->
      <Transition name="fade">
        <div 
          v-if="showResults && (searchResults.length > 0 || searching)"
          class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
        >
          <!-- Loading -->
          <div v-if="searching" class="px-4 py-3 text-gray-500 text-sm">
            <div class="flex items-center space-x-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Wyszukiwanie...</span>
            </div>
          </div>
          
          <!-- Results -->
          <ul v-else class="divide-y divide-gray-100">
            <li 
              v-for="stop in searchResults" 
              :key="stop.stopId"
              class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              @click="addStop(stop)"
            >
              <div>
                <p class="font-medium text-gray-900">{{ stop.stopName }}</p>
                <p class="text-sm text-gray-500">
                  ID: {{ stop.stopId }}
                  <span v-if="stop.subName"> • {{ stop.subName }}</span>
                </p>
              </div>
              
              <BaseButton
                v-if="!userStopsStore.isStopAdded(stop.stopId)"
                variant="primary"
                size="sm"
                :loading="addingStopId === stop.stopId"
                @click.stop="addStop(stop)"
              >
                Dodaj
              </BaseButton>
              <span 
                v-else 
                class="text-green-600 text-sm font-medium"
              >
                ✓ Dodano
              </span>
            </li>
          </ul>
          
          <!-- No results -->
          <div 
            v-if="!searching && searchResults.length === 0 && searchQuery.length >= 2" 
            class="px-4 py-3 text-gray-500 text-sm"
          >
            Nie znaleziono przystanków
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
