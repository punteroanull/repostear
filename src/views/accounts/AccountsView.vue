<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">{{ $t('dashboard.accounts') }}</h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          {{ $t('dashboard.manageYourAccounts') }}
        </p>
      </div>
      <Button 
        icon="pi pi-plus" 
        :label="$t('dashboard.addAccount')" 
        @click="navigateTo('/dashboard/accounts/add')"
        class="mt-4 md:mt-0"
      />
    </div>

    <!-- Account Limit Warning -->
    <div v-if="isNearLimit" class="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-4">
      <div class="flex items-start">
        <i class="pi pi-exclamation-triangle text-warning-500 mr-3 mt-1"></i>
        <div class="flex-1">
          <p class="font-medium text-warning-800 dark:text-warning-200 mb-1">
            {{ $t('dashboard.accountLimitWarning') }}
          </p>
          <p class="text-sm text-warning-700 dark:text-warning-300 mb-3">
            {{ $t('dashboard.accountLimitMessage', { current: accountCount, limit: accountLimit }) }}
          </p>
          <Button 
            :label="$t('dashboard.upgradePlan')" 
            size="small"
            severity="warning"
            @click="navigateTo('/dashboard/subscription/plans')"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Empty State -->
    <div v-else-if="accounts.length === 0" class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-12 text-center">
      <i class="pi pi-users text-6xl text-neutral-300 dark:text-neutral-600 mb-4"></i>
      <h2 class="text-2xl font-bold mb-2">{{ $t('dashboard.noAccountsYet') }}</h2>
      <p class="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
        {{ $t('dashboard.addFirstAccount') }}
      </p>
      <Button 
        icon="pi pi-plus" 
        :label="$t('dashboard.addAccount')" 
        @click="navigateTo('/dashboard/accounts/add')"
        size="large"
      />
    </div>

    <!-- Accounts List -->
    <div v-else class="space-y-4">
      <div 
        v-for="account in accounts" 
        :key="account.id"
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <!-- Account Info -->
            <div class="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar 
                :image="account.avatar_url" 
                size="xlarge"
                shape="circle"
              />
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-xl font-bold">{{ account.display_name }}</h3>
                  <Tag 
                    :value="account.platform" 
                    :severity="getPlatformSeverity(account.platform)"
                    class="capitalize"
                  />
                </div>
                <p class="text-neutral-600 dark:text-neutral-400 mb-2">@{{ account.username }}</p>
                <div class="flex items-center space-x-4 text-sm">
                  <span class="flex items-center text-neutral-500">
                    <i class="pi pi-clock mr-1"></i>
                    {{ $t('dashboard.lastSynced') }}: {{ formatDate(account.last_synced_at) }}
                  </span>
                  <span class="flex items-center text-neutral-500">
                    <i class="pi pi-calendar mr-1"></i>
                    {{ $t('dashboard.added') }}: {{ formatDate(account.created_at) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <Button 
                icon="pi pi-refresh" 
                :label="$t('dashboard.refresh')"
                outlined
                size="small"
                @click="refreshAccount(account.id)"
                :loading="refreshingAccounts.has(account.id)"
              />
              <Button 
                icon="pi pi-eye" 
                :label="$t('dashboard.view')"
                size="small"
                @click="navigateTo(`/dashboard/accounts/${account.id}`)"
              />
              <Button 
                icon="pi pi-trash" 
                severity="danger"
                outlined
                size="small"
                @click="confirmDeleteAccount(account)"
              />
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div class="text-center">
              <p class="text-2xl font-bold text-primary-500">{{ formatNumber(account.follower_count) }}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.followers') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-secondary-500">{{ formatNumber(account.following_count) }}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.following') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-accent-500">{{ formatNumber(account.post_count) }}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.posts') }}</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-success-500">{{ calculateEngagementRate(account) }}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.engagement') }}</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="flex flex-wrap gap-2 mt-4">
            <Button 
              :label="$t('dashboard.followers')" 
              icon="pi pi-user-plus"
              text
              size="small"
              @click="navigateTo(`/dashboard/accounts/${account.id}/followers`)"
            />
            <Button 
              :label="$t('dashboard.posts')" 
              icon="pi pi-inbox"
              text
              size="small"
              @click="navigateTo(`/dashboard/accounts/${account.id}/posts`)"
            />
            <Button 
              :label="$t('dashboard.statistics')" 
              icon="pi pi-chart-bar"
              text
              size="small"
              @click="navigateTo(`/dashboard/accounts/${account.id}/statistics`)"
            />
            <Button 
              :label="$t('dashboard.wordAnalysis')" 
              icon="pi pi-hashtag"
              text
              size="small"
              @click="navigateTo(`/dashboard/accounts/${account.id}/word-analysis`)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="deleteDialogVisible" 
      :header="$t('dashboard.deleteAccount')"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <p>{{ $t('dashboard.deleteAccountConfirm', { name: accountToDelete?.display_name }) }}</p>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('dashboard.deleteAccountWarning') }}
        </p>
      </div>
      <template #footer>
        <Button 
          :label="$t('dashboard.cancel')" 
          text 
          @click="deleteDialogVisible = false"
        />
        <Button 
          :label="$t('dashboard.delete')" 
          severity="danger"
          @click="deleteAccount"
          :loading="deleting"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore, type SocialMediaAccount } from '@/stores/accounts'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const loading = ref(false)
const deleteDialogVisible = ref(false)
const accountToDelete = ref<SocialMediaAccount | null>(null)
const deleting = ref(false)
const refreshingAccounts = ref(new Set<number>())

const accounts = computed(() => accountsStore.accounts)
const accountCount = computed(() => accounts.value.length)
const subscriptionTier = computed(() => authStore.subscriptionTier)

const accountLimit = computed(() => {
  const limits: Record<string, number> = {
    'free': 1,
    'pro': 2,
    'influencer': 5,
    'business': Infinity
  }
  return limits[subscriptionTier.value] || 1
})

const isNearLimit = computed(() => {
  return accountCount.value >= accountLimit.value && accountLimit.value !== Infinity
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
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}d ago`
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

const calculateEngagementRate = (account: SocialMediaAccount): string => {
  // This is a placeholder calculation
  // In a real app, you'd calculate this based on actual engagement metrics
  if (account.follower_count === 0) return '0%'
  const randomRate = Math.random() * 10
  return randomRate.toFixed(1) + '%'
}

const refreshAccount = async (accountId: number) => {
  refreshingAccounts.value.add(accountId)
  try {
    await accountsStore.refreshAccountData(accountId)
    toast.add({
      severity: 'success',
      summary: t('dashboard.success'),
      detail: t('dashboard.accountRefreshed'),
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('dashboard.error'),
      detail: t('dashboard.accountRefreshFailed'),
      life: 5000
    })
  } finally {
    refreshingAccounts.value.delete(accountId)
  }
}

const confirmDeleteAccount = (account: SocialMediaAccount) => {
  accountToDelete.value = account
  deleteDialogVisible.value = true
}

const deleteAccount = async () => {
  if (!accountToDelete.value) return
  
  deleting.value = true
  try {
    await accountsStore.removeAccount(accountToDelete.value.id)
    toast.add({
      severity: 'success',
      summary: t('dashboard.success'),
      detail: t('dashboard.accountDeleted'),
      life: 3000
    })
    deleteDialogVisible.value = false
    accountToDelete.value = null
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('dashboard.error'),
      detail: t('dashboard.accountDeleteFailed'),
      life: 5000
    })
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await accountsStore.fetchAccounts()
  } catch (error) {
    console.error('Failed to load accounts:', error)
    toast.add({
      severity: 'error',
      summary: t('dashboard.error'),
      detail: t('dashboard.accountsLoadFailed'),
      life: 5000
    })
  } finally {
    loading.value = false
  }
})
</script>