<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const formError = ref<string | null>(null)

const handleSubmit = async () => {
  formError.value = null
  authStore.clearError()
  
  if (!email.value || !password.value) {
    formError.value = 'Wypełnij wszystkie pola'
    return
  }
  
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })
  
  if (success) {
    const redirectTo = (route.query.redirect as string) || '/dashboard'
    router.push(redirectTo)
  } else {
    formError.value = authStore.error || 'Błąd logowania'
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and title -->
      <div class="text-center">
        <span class="text-6xl">🚌</span>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          UrbanFlow
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          ZTM Gdańsk - Śledzenie opóźnień
        </p>
      </div>
      
      <!-- Login form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="bg-white py-8 px-6 shadow rounded-lg">
          <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">
            Zaloguj się
          </h3>
          
          <BaseAlert 
            v-if="formError" 
            type="error" 
            class="mb-4"
          >
            {{ formError }}
          </BaseAlert>
          
          <div class="space-y-4">
            <BaseInput
              v-model="email"
              v-focus
              type="email"
              label="Email"
              placeholder="twoj@email.com"
              required
              autocomplete="email"
            />
            
            <BaseInput
              v-model="password"
              type="password"
              label="Hasło"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>
          
          <div class="mt-6">
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              full-width
              :loading="authStore.loading"
            >
              Zaloguj się
            </BaseButton>
          </div>
        </div>
        
        <p class="text-center text-sm text-gray-600">
          Nie masz konta?
          <router-link 
            to="/register" 
            class="font-medium text-ztm-blue hover:text-ztm-dark-blue"
          >
            Zarejestruj się
          </router-link>
        </p>
        
        <!-- Test user hint -->
        <div class="text-center text-xs text-gray-400 bg-gray-100 p-3 rounded-md">
          <p class="font-medium">Testowe konto:</p>
          <p>Email: test@urbanflow.pl</p>
          <p>Hasło: Test123!</p>
        </div>
      </form>
    </div>
  </div>
</template>
