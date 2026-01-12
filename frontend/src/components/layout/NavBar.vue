<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const user = computed(() => authStore.currentUser)

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Mapa', path: '/map', icon: '🗺️' },
]

const isActive = (path: string) => route.path === path

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <nav class="bg-ztm-blue shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and navigation -->
        <div class="flex">
          <RouterLink 
            to="/dashboard" 
            class="flex items-center flex-shrink-0"
          >
            <span class="text-2xl mr-2">🚌</span>
            <span class="text-white font-bold text-xl">UrbanFlow</span>
          </RouterLink>
          
          <div class="hidden sm:ml-8 sm:flex sm:space-x-4">
            <RouterLink
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              :class="[
                'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-ztm-dark-blue text-white'
                  : 'text-blue-100 hover:bg-ztm-dark-blue hover:text-white'
              ]"
            >
              <span class="mr-2">{{ item.icon }}</span>
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
        
        <!-- User menu -->
        <div class="flex items-center">
          <div class="flex items-center space-x-4">
            <span class="text-blue-100 text-sm hidden sm:block">
              Witaj, <strong class="text-white">{{ user?.username }}</strong>
            </span>
            
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-ztm-blue bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ztm-blue focus:ring-white transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile navigation -->
    <div class="sm:hidden border-t border-ztm-dark-blue">
      <div class="px-2 py-2 space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          :class="[
            'block px-3 py-2 rounded-md text-base font-medium',
            isActive(item.path)
              ? 'bg-ztm-dark-blue text-white'
              : 'text-blue-100 hover:bg-ztm-dark-blue hover:text-white'
          ]"
        >
          <span class="mr-2">{{ item.icon }}</span>
          {{ item.name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
