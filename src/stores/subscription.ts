import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export interface SubscriptionPlan {
  id: number
  name: string
  key: 'free' | 'pro' | 'influencer' | 'business'
  price: number
  account_limit: number | null
  update_frequency: number // in hours
  features: string[]
  token_limit: number | null
}

export interface UserSubscription {
  id: number
  user_id: number
  plan_id: number
  status: 'active' | 'canceled' | 'expired'
  current_period_end: string
  created_at: string
  updated_at: string
  plan: SubscriptionPlan
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const authStore = useAuthStore()
  
  const plans = ref<SubscriptionPlan[]>([])
  const currentSubscription = ref<UserSubscription | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const currentPlan = computed(() => {
    if (!currentSubscription.value) return null
    return currentSubscription.value.plan
  })
  
  const isSubscriptionActive = computed(() => {
    if (!currentSubscription.value) return false
    return currentSubscription.value.status === 'active'
  })
  
  const fetchPlans = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/subscriptions')
      plans.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch subscription plans'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const fetchCurrentSubscription = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/subscriptions/current')
      currentSubscription.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch current subscription'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const subscribe = async (planId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/subscriptions', {
        plan_id: planId
      })
      currentSubscription.value = response.data
      
      // Update user data since subscription affects user properties
      await authStore.fetchUser()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to subscribe to plan'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const upgradePlan = async (planId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/subscriptions/upgrade', {
        plan_id: planId
      })
      currentSubscription.value = response.data
      
      // Update user data since subscription affects user properties
      await authStore.fetchUser()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to upgrade subscription'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const downgradePlan = async (planId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/subscriptions/downgrade', {
        plan_id: planId
      })
      currentSubscription.value = response.data
      
      // Update user data since subscription affects user properties
      await authStore.fetchUser()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to downgrade subscription'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const cancelSubscription = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/subscriptions/cancel')
      currentSubscription.value = response.data
      
      // Update user data since subscription affects user properties
      await authStore.fetchUser()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel subscription'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  const purchaseTokens = async (amount: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/tokens/purchase', {
        amount
      })
      
      // Update user data to reflect new token amount
      await authStore.fetchUser()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to purchase tokens'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return {
    plans,
    currentSubscription,
    currentPlan,
    isSubscriptionActive,
    loading,
    error,
    fetchPlans,
    fetchCurrentSubscription,
    subscribe,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    purchaseTokens
  }
})