import { ref, readonly, type Ref } from 'vue'
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  loading: Ref<boolean>
  execute: (url: string, config?: AxiosRequestConfig) => Promise<T | null>
  get: (url: string, config?: AxiosRequestConfig) => Promise<T | null>
  post: <D = unknown>(url: string, body?: D, config?: AxiosRequestConfig) => Promise<T | null>
  put: <D = unknown>(url: string, body?: D, config?: AxiosRequestConfig) => Promise<T | null>
  del: (url: string, config?: AxiosRequestConfig) => Promise<T | null>
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Composable for fetching data with automatic JWT token injection
 */
export function useFetch<T = unknown>(): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getAuthHeader = (): Record<string, string> => {
    const authStore = useAuthStore()
    if (authStore.token) {
      return { Authorization: `Bearer ${authStore.token}` }
    }
    return {}
  }

  const handleError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ error?: string; message?: string }>
      
      // Handle 401 - auto logout
      if (axiosError.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        return 'Sesja wygasła. Zaloguj się ponownie.'
      }
      
      return axiosError.response?.data?.error 
        || axiosError.response?.data?.message 
        || axiosError.message 
        || 'Wystąpił błąd'
    }
    
    if (err instanceof Error) {
      return err.message
    }
    
    return 'Wystąpił nieznany błąd'
  }

  const execute = async (url: string, config: AxiosRequestConfig = {}): Promise<T | null> => {
    loading.value = true
    error.value = null
    
    try {
      const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
      
      const response = await axios({
        ...config,
        url: fullUrl,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
          ...config.headers,
        },
      })
      
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = handleError(err)
      data.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const get = (url: string, config?: AxiosRequestConfig) => 
    execute(url, { ...config, method: 'GET' })

  const post = <D = unknown>(url: string, body?: D, config?: AxiosRequestConfig) =>
    execute(url, { ...config, method: 'POST', data: body })

  const put = <D = unknown>(url: string, body?: D, config?: AxiosRequestConfig) =>
    execute(url, { ...config, method: 'PUT', data: body })

  const del = (url: string, config?: AxiosRequestConfig) =>
    execute(url, { ...config, method: 'DELETE' })

  return {
    data: readonly(data) as Ref<T | null>,
    error: readonly(error) as Ref<string | null>,
    loading: readonly(loading) as Ref<boolean>,
    execute,
    get,
    post,
    put,
    del,
  }
}

export default useFetch
