import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export interface SocialMediaAccount {
  id: number
  user_id: number
  username: string
  display_name: string
  platform: string
  avatar_url: string
  follower_count: number
  following_count: number
  post_count: number
  last_synced_at: string
  created_at: string
  updated_at: string
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<SocialMediaAccount[]>([])
  const currentAccount = ref<SocialMediaAccount | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const accountCount = computed(() => accounts.value.length)
  
  const fetchAccounts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/accounts')
      accounts.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch accounts'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const fetchAccount = async (id: number | string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/accounts/${id}`)
      currentAccount.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch account'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const addAccount = async (platform: string, username: string, token: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/accounts', {
        platform,
        username,
        token
      })
      
      // Add the new account to the accounts list
      accounts.value.push(response.data)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add account'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const removeAccount = async (id: number | string) => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/accounts/${id}`)
      
      // Remove the account from the accounts list
      accounts.value = accounts.value.filter(account => account.id !== Number(id))
      
      if (currentAccount.value?.id === Number(id)) {
        currentAccount.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove account'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const refreshAccountData = async (id: number | string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/accounts/${id}/refresh`)
      
      // Update the account data
      const index = accounts.value.findIndex(acc => acc.id === Number(id))
      if (index !== -1) {
        accounts.value[index] = response.data
      }
      
      if (currentAccount.value?.id === Number(id)) {
        currentAccount.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to refresh account data'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return {
    accounts,
    currentAccount,
    loading,
    error,
    accountCount,
    fetchAccounts,
    fetchAccount,
    addAccount,
    removeAccount,
    refreshAccountData
  }
})