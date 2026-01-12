<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="text-center">
      <span class="text-8xl mb-6 block">🚧</span>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">
        Strona nie została znaleziona
      </p>
      
      <RouterLink to="/dashboard">
        <BaseButton variant="primary" size="lg">
          Wróć do dashboardu
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
