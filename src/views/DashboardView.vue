<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-sm p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">{{ $t('dashboard.welcome') }}, {{ user?.name }}! 👋</h1>
      <p class="text-lg opacity-90">{{ $t('dashboard.welcomeMessage') }}</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.totalAccounts') }}</p>
            <p class="text-3xl font-bold text-primary-500">{{ accountCount }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <i class="pi pi-users text-primary-500 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.totalFollowers') }}</p>
            <p class="text-3xl font-bold text-secondary-500">{{ formatNumber(totalFollowers) }}</p>
          </div>
          <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
            <i class="pi pi-user-plus text-secondary-500 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.activeGiveaways') }}</p>
            <p class="text-3xl font-bold text-accent-500">{{ activeGiveaways }}</p>
          </div>
          <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
            <i class="pi pi-gift text-accent-500 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.availableTokens') }}</p>
            <p class="text-3xl font-bold text-success-500">{{ user?.tokens || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
            <i class="pi pi-ticket text-success-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Accounts Overview -->
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">{{ $t('dashboard.yourAccounts') }}</h2>
        <Button 
          icon="pi pi-plus" 
          :label="$t('dashboard.addAccount')" 
          @click="navigateTo('/dashboard/accounts/add')"
          size="small"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <ProgressSpinner />
      </div>

      <!-- Empty State -->
      <div v-else-if="accounts.length === 0" class="text-center py-12">
        <i class="pi pi-users text-6xl text-neutral-300 dark:text-neutral-600 mb-4"></i>
        <h3 class="text-lg font-semibold mb-2">{{ $t('dashboard.noAccountsYet') }}</h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          {{ $t('dashboard.addFirstAccount') }}
        </p>
        <Button 
          icon="pi pi-plus" 
          :label="$t('dashboard.addAccount')" 
          @click="navigateTo('/dashboard/accounts/add')"
        />
      </div>

      <!-- Accounts Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="account in accounts" 
          :key="account.id"
          class="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
          @click="navigateTo(`/dashboard/accounts/${account.id}`)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <Avatar 
                :image="account.avatar_url" 
                size="large"
                shape="circle"
              />
              <div>
                <h3 class="font-semibold text-lg">{{ account.display_name }}</h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">@{{ account.username }}</p>
              </div>
            </div>
            <Tag 
              :value="account.platform" 
              :severity="getPlatformSeverity(account.platform)"
              class="capitalize"
            />
          </div>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <p class="text-2xl font-bold text-primary-500">{{ formatNumber(account.follower_count) }}</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.followers') }}</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-secondary-500">{{ formatNumber(account.following_count) }}</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.following') }}</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-accent-500">{{ formatNumber(account.post_count) }}</p>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.posts') }}</p>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ $t('dashboard.lastSynced') }}: {{ formatDate(account.last_synced_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Posts -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.recentActivity') }}</h2>
        <div class="space-y-3">
          <div 
            v-for="i in 3" 
            :key="i"
            class="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
          >
            <i class="pi pi-inbox text-neutral-400"></i>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ $t('dashboard.noRecentActivity') }}</p>
              <p class="text-xs text-neutral-500">{{ $t('dashboard.connectAccountToSee') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Info -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.subscription') }}</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
            <div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.currentPlan') }}</p>
              <p class="text-2xl font-bold capitalize">{{ subscriptionTier }}</p>
            </div>
            <Button 
              :label="$t('dashboard.upgrade')" 
              icon="pi pi-arrow-up"
              @click="navigateTo('/dashboard/subscription/plans')"
              outlined
              size="small"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.accountLimit') }}</p>
              <p class="text-lg font-bold">{{ getAccountLimit() }}</p>
            </div>
            <div class="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{{ $t('dashboard.updateFrequency') }}</p>
              <p class="text-lg font-bold">{{ getUpdateFrequency() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.quickActions') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          @click="navigateTo('/dashboard/accounts/add')"
          class="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
        >
          <i class="pi pi-plus-circle text-3xl text-primary-500 mb-2"></i>
          <p class="font-medium">{{ $t('dashboard.addAccount') }}</p>
        </button>

        <button
          @click="navigateTo('/dashboard/giveaways/create')"
          class="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all"
        >
          <i class="pi pi-gift text-3xl text-secondary-500 mb-2"></i>
          <p class="font-medium">{{ $t('dashboard.createGiveaway') }}</p>
        </button>

        <button
          @click="navigateTo('/dashboard/subscription/plans')"
          class="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all"
        >
          <i class="pi pi-star text-3xl text-accent-500 mb-2"></i>
          <p class="font-medium">{{ $t('dashboard.upgradePlan') }}</p>
        </button>

        <button
          @click="navigateTo('/dashboard/tokens')"
          class="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 transition-all"
        >
          <i class="pi pi-ticket text-3xl text-success-500 mb-2"></i>
          <p class="font-medium">{{ $t('dashboard.buyTokens') }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore } from '@/stores/accounts'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const loading = ref(false)
const activeGiveaways = ref(0)

const user = computed(() => authStore.user)
const accounts = computed(() => accountsStore.accounts)
const accountCount = computed(() => accounts.value.length)
const subscriptionTier = computed(() => authStore.subscriptionTier)

const totalFollowers = computed(() => {
  return accounts.value.reduce((sum, account) => sum + account.follower_count, 0)
})

const navigateTo = (path: string) => {
  router.push(path)
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return 'Yesterday'
  return date.toLocaleDateString()
}

const getPlatformSeverity = (platform: string): string => {
  const severityMap: Record<string, string> = {
    'bluesky': 'info',
    'twitter': 'primary',
    'x': 'primary',
    'instagram': 'warning',
    'facebook': 'secondary'
  }
  return severityMap[platform.toLowerCase()] || 'info'
}

const getAccountLimit = (): string => {
  const limits: Record<string, string> = {
    'free': '1',
    'pro': '2',
    'influencer': '5',
    'business': 'Unlimited'
  }
  return limits[subscriptionTier.value] || '1'
}

const getUpdateFrequency = (): string => {
  const frequencies: Record<string, string> = {
    'free': '24h',
    'pro': '6h',
    'influencer': '2h',
    'business': 'Real-time'
  }
  return frequencies[subscriptionTier.value] || '24h'
}

onMounted(async () => {
  loading.value = true
  try {
    await accountsStore.fetchAccounts()
  } catch (error) {
    console.error('Failed to load accounts:', error)
  } finally {
    loading.value = false
  }
})
</script>