import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials
      )
      
      setToken(response.data.token)
      user.value = response.data.user
      return true
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.error || 'Błąd logowania'
      } else {
        error.value = 'Wystąpił nieznany błąd'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/register`,
        credentials
      )
      
      setToken(response.data.token)
      user.value = response.data.user
      return true
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.error || 'Błąd rejestracji'
      } else {
        error.value = 'Wystąpił nieznany błąd'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentUser = async (): Promise<void> => {
    if (!token.value) return
    
    loading.value = true
    
    try {
      const response = await axios.get<{ user: User }>(
        `${API_BASE_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token.value}` }
        }
      )
      
      user.value = response.data.user
    } catch (err) {
      // Token invalid - logout
      logout()
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    setToken(null)
    user.value = null
    error.value = null
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  }
})

export type { User, LoginCredentials, RegisterCredentials }
