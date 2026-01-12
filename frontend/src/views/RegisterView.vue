<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref<string | null>(null)

const validateForm = (): boolean => {
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    formError.value = 'Wypełnij wszystkie pola'
    return false
  }
  
  if (username.value.length < 3 || username.value.length > 50) {
    formError.value = 'Nazwa użytkownika musi mieć 3-50 znaków'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    formError.value = 'Podaj prawidłowy adres email'
    return false
  }
  
  if (password.value.length < 8) {
    formError.value = 'Hasło musi mieć minimum 8 znaków'
    return false
  }
  
  if (!/[A-Z]/.test(password.value)) {
    formError.value = 'Hasło musi zawierać wielką literę'
    return false
  }
  
  if (!/[a-z]/.test(password.value)) {
    formError.value = 'Hasło musi zawierać małą literę'
    return false
  }
  
  if (!/[0-9]/.test(password.value)) {
    formError.value = 'Hasło musi zawierać cyfrę'
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    formError.value = 'Hasła nie są identyczne'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  formError.value = null
  authStore.clearError()
  
  if (!validateForm()) {
    return
  }
  
  const success = await authStore.register({
    username: username.value,
    email: email.value,
    password: password.value,
  })
  
  if (success) {
    router.push('/dashboard')
  } else {
    formError.value = authStore.error || 'Błąd rejestracji'
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
      
      <!-- Register form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="bg-white py-8 px-6 shadow rounded-lg">
          <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">
            Utwórz konto
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
              v-model="username"
              v-focus
              type="text"
              label="Nazwa użytkownika"
              placeholder="jankowalski"
              required
              autocomplete="username"
            />
            
            <BaseInput
              v-model="email"
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
              autocomplete="new-password"
            />
            
            <BaseInput
              v-model="confirmPassword"
              type="password"
              label="Potwierdź hasło"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
            
            <div class="text-xs text-gray-500 space-y-1">
              <p class="font-medium">Wymagania hasła:</p>
              <ul class="list-disc list-inside space-y-0.5">
                <li :class="password.length >= 8 ? 'text-green-600' : ''">Minimum 8 znaków</li>
                <li :class="/[A-Z]/.test(password) ? 'text-green-600' : ''">Wielka litera</li>
                <li :class="/[a-z]/.test(password) ? 'text-green-600' : ''">Mała litera</li>
                <li :class="/[0-9]/.test(password) ? 'text-green-600' : ''">Cyfra</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-6">
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              full-width
              :loading="authStore.loading"
            >
              Zarejestruj się
            </BaseButton>
          </div>
        </div>
        
        <p class="text-center text-sm text-gray-600">
          Masz już konto?
          <router-link 
            to="/login" 
            class="font-medium text-ztm-blue hover:text-ztm-dark-blue"
          >
            Zaloguj się
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>
