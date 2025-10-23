import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import router from '@/router'
import { useI18n } from 'vue-i18n'

export interface User {
  id: number
  name: string
  email: string
  language: string
  subscription_type: string
  tokens: number
  created_at: string
  updated_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const { locale } = useI18n()
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  
  const subscriptionTier = computed(() => {
    if (!user.value) return 'free'
    return user.value.subscription_type
  })
  
  const initialize = async () => {
    if (token.value) {
      try {
        await fetchUser()
      } catch (error) {
        logout()
      }
    }
  }
  
  const setUser = (userData: User) => {
    user.value = userData
    // Set the language based on user preference
    if (userData.language) {
      locale.value = userData.language
    }
  }
  
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    // Set the token in the API service
    api.setToken(newToken)
  }
  
  const fetchUser = async () => {
    try {
      const response = await api.get('/user')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  }
  
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password })
      setToken(response.data.token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }
  
  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
      setToken(response.data.token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }
  
  const logout = async () => {
    try {
      if (token.value) {
        await api.post('/logout')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      api.removeToken()
      router.push({ name: 'login' })
    }
  }
  
  const updateLanguage = async (language: string) => {
    try {
      await api.put('/user/language', { language })
      if (user.value) {
        user.value.language = language
      }
      locale.value = language
      return true
    } catch (error) {
      console.error('Failed to update language:', error)
      throw error
    }
  }
  
  const checkIsBlueskyAccount = async (accountId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/accounts/${accountId}`)
      return response.data.platform === 'bluesky'
    } catch (error) {
      console.error('Failed to check if Bluesky account:', error)
      return false
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    subscriptionTier,
    initialize,
    login,
    register,
    logout,
    fetchUser,
    updateLanguage,
    checkIsBlueskyAccount
  }
})