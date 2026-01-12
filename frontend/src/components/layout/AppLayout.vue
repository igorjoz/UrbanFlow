<script setup lang="ts">
import NavBar from './NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
    
    <footer class="bg-gray-100 border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} UrbanFlow - ZTM Gdańsk Tracker
        </p>
      </div>
    </footer>
  </div>
</template>
