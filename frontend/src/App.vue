<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  // Check for existing token on app load
  if (authStore.token) {
    authStore.fetchCurrentUser()
  }
})
</script>

<template>
  <RouterView />
</template>
