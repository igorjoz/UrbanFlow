import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useAuthStore()
      
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should load token from localStorage', () => {
      localStorage.setItem('token', 'test-token')
      
      const store = useAuthStore()
      
      expect(store.token).toBe('test-token')
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          token: 'new-token',
          user: { id: 1, username: 'testuser', email: 'test@example.com' }
        }
      })
      
      const store = useAuthStore()
      const result = await store.login({ email: 'test@example.com', password: 'Test123!' })
      
      expect(result).toBe(true)
      expect(store.token).toBe('new-token')
      expect(store.user?.username).toBe('testuser')
      expect(store.isAuthenticated).toBe(true)
      expect(localStorage.getItem('token')).toBe('new-token')
    })

    it('should handle login error', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { error: 'Nieprawidłowe dane' } }
      })
      mockedAxios.isAxiosError.mockReturnValue(true)
      
      const store = useAuthStore()
      const result = await store.login({ email: 'test@example.com', password: 'wrong' })
      
      expect(result).toBe(false)
      expect(store.error).toBe('Nieprawidłowe dane')
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear state on logout', async () => {
      const store = useAuthStore()
      
      // Set some state
      store.token = 'test-token'
      store.user = { id: 1, username: 'test', email: 'test@test.com' }
      localStorage.setItem('token', 'test-token')
      
      store.logout()
      
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          token: 'new-token',
          user: { id: 1, username: 'newuser', email: 'new@example.com' }
        }
      })
      
      const store = useAuthStore()
      const result = await store.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'Test123!'
      })
      
      expect(result).toBe(true)
      expect(store.token).toBe('new-token')
      expect(store.user?.username).toBe('newuser')
    })
  })
})
