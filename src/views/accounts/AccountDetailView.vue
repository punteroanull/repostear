<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <template v-else-if="account">
      <!-- Back Button -->
      <Button 
        icon="pi pi-arrow-left" 
        text 
        :label="$t('dashboard.backToAccounts')"
        @click="router.push('/dashboard/accounts')"
      />

      <!-- Account Header -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
        <!-- Cover/Banner Area -->
        <div class="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        
        <!-- Profile Info -->
        <div class="px-6 pb-6">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-12">
            <div class="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <Avatar 
                :image="account.avatar_url" 
                size="xlarge"
                shape="circle"
                class="border-4 border-white dark:border-neutral-800"
                style="width: 120px; height: 120px;"
              />
              <div class="pb-2">
                <div class="flex items-center space-x-2 mb-1">
                  <h1 class="text-2xl font-bold">{{ account.display_name }}</h1>
                  <Tag 
                    :value="account.platform" 
                    :severity="getPlatformSeverity(account.platform)"
                    class="capitalize"
                  />
                </div>
                <p class="text-neutral-600 dark:text-neutral-400 mb-2">@{{ account.username }}</p>
                <div class="flex items-center space-x-4 text-sm text-neutral-500">
                  <span class="flex items-center">
                    <i class="pi pi-calendar mr-1"></i>
                    {{ $t('dashboard.joined') }} {{ formatDate(account.created_at, true) }}
                  </span>
                  <span class="flex items-center">
                    <i class="pi pi-clock mr-1"></i>
                    {{ $t('dashboard.lastSync') }}: {{ formatDate(account.last_synced_at) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 mt-4 md:mt-0">
              <Button 
                icon="pi pi-refresh" 
                :label="$t('dashboard.refresh')"
                outlined
                @click="refreshAccount"
                :loading="refreshing"
              />
              <Button 
                icon="pi pi-cog" 
                :label="$t('dashboard.settings')"
                outlined
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 text-center">
          <p class="text-3xl font-bold text-primary-500 mb-1">{{ formatNumber(account.follower_count) }}</p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.followers') }}</p>
        </div>
        <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 text-center">
          <p class="text-3xl font-bold text-secondary-500 mb-1">{{ formatNumber(account.following_count) }}</p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.following') }}</p>
        </div>
        <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 text-center">
          <p class="text-3xl font-bold text-accent-500 mb-1">{{ formatNumber(account.post_count) }}</p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.posts') }}</p>
        </div>
        <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 text-center">
          <p class="text-3xl font-bold text-success-500 mb-1">{{ engagementRate }}</p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t('dashboard.engagement') }}</p>
        </div>
      </div>

      <!-- Analytics Navigation -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.analytics') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Followers -->
          <button
            @click="navigateTo(`/dashboard/accounts/${account.id}/followers`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <i class="pi pi-user-plus text-primary-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.followers') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.followersDescription') }}
            </p>
          </button>

          <!-- Interactions -->
          <button
            @click="navigateTo(`/dashboard/accounts/${account.id}/interactions`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center group-hover:bg-secondary-500 transition-colors">
                <i class="pi pi-comments text-secondary-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.interactions') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.interactionsDescription') }}
            </p>
          </button>

          <!-- Posts -->
          <button
            @click="navigateTo(`/dashboard/accounts/${account.id}/posts`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center group-hover:bg-accent-500 transition-colors">
                <i class="pi pi-inbox text-accent-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.posts') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.postsDescription') }}
            </p>
          </button>

          <!-- Statistics -->
          <button
            @click="navigateTo(`/dashboard/accounts/${account.id}/statistics`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center group-hover:bg-success-500 transition-colors">
                <i class="pi pi-chart-bar text-success-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.statistics') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.statisticsDescription') }}
            </p>
          </button>

          <!-- Word Analysis -->
          <button
            @click="navigateTo(`/dashboard/accounts/${account.id}/word-analysis`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center group-hover:bg-warning-500 transition-colors">
                <i class="pi pi-hashtag text-warning-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.wordAnalysis') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.wordAnalysisDescription') }}
            </p>
          </button>

          <!-- Lists (Bluesky only) -->
          <button
            v-if="account.platform === 'bluesky'"
            @click="navigateTo(`/dashboard/accounts/${account.id}/lists`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-info-500 hover:bg-info-50 dark:hover:bg-info-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-info-100 dark:bg-info-900/30 rounded-lg flex items-center justify-center group-hover:bg-info-500 transition-colors">
                <i class="pi pi-list text-info-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.lists') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.listsDescription') }}
            </p>
          </button>

          <!-- Blocking (Bluesky only) -->
          <button
            v-if="account.platform === 'bluesky'"
            @click="navigateTo(`/dashboard/accounts/${account.id}/blocking`)"
            class="text-left p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all group"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-error-100 dark:bg-error-900/30 rounded-lg flex items-center justify-center group-hover:bg-error-500 transition-colors">
                <i class="pi pi-ban text-error-500 group-hover:text-white text-lg"></i>
              </div>
              <h3 class="font-semibold">{{ $t('dashboard.blocking') }}</h3>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.blockingDescription') }}
            </p>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.recentActivity') }}</h2>
        <div class="text-center py-12">
          <i class="pi pi-inbox text-4xl text-neutral-300 dark:text-neutral-600 mb-3"></i>
          <p class="text-neutral-600 dark:text-neutral-400">
            {{ $t('dashboard.noRecentActivityForAccount') }}
          </p>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border-2 border-error-200 dark:border-error-800">
        <h2 class="text-xl font-bold text-error-600 dark:text-error-400 mb-4">{{ $t('dashboard.dangerZone') }}</h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium mb-1">{{ $t('dashboard.removeAccount') }}</p>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('dashboard.removeAccountDescription') }}
            </p>
          </div>
          <Button 
            :label="$t('dashboard.removeAccount')" 
            severity="danger"
            outlined
            @click="confirmDelete"
          />
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
          <p>{{ $t('dashboard.deleteAccountConfirm', { name: account.display_name }) }}</p>
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
    </template>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <i class="pi pi-exclamation-circle text-4xl text-error-500 mb-3"></i>
      <p class="text-neutral-600 dark:text-neutral-400">
        {{ $t('dashboard.accountNotFound') }}
      </p>
      <Button 
        :label="$t('dashboard.backToAccounts')" 
        class="mt-4"
        @click="router.push('/dashboard/accounts')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountsStore } from '@/stores/accounts'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const accountsStore = useAccountsStore()

const loading = ref(false)
const refreshing = ref(false)
const deleteDialogVisible = ref(false)
const deleting = ref(false)

const account = computed(() => accountsStore.currentAccount)
const engagementRate = computed(() => {
  if (!account.value || account.value.follower_count === 0) return '0%'
  const randomRate = Math.random() * 10
  return randomRate.toFixed(1) + '%'
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

const formatDate = (dateString: string, long: boolean = false): string => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  
  if (long) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }
  
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

const refreshAccount = async () => {
  if (!account.value) return
  
  refreshing.value = true
  try {
    await accountsStore.refreshAccountData(account.value.id)
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
    refreshing.value = false
  }
}

const confirmDelete = () => {
  deleteDialogVisible.value = true
}

const deleteAccount = async () => {
  if (!account.value) return
  
  deleting.value = true
  try {
    await accountsStore.removeAccount(account.value.id)
    toast.add({
      severity: 'success',
      summary: t('dashboard.success'),
      detail: t('dashboard.accountDeleted'),
      life: 3000
    })
    router.push('/dashboard/accounts')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('dashboard.error'),
      detail: t('dashboard.accountDeleteFailed'),
      life: 5000
    })
  } finally {
    deleting.value = false
    deleteDialogVisible.value = false
  }
}

onMounted(async () => {
  const accountId = route.params.id as string
  loading.value = true
  try {
    await accountsStore.fetchAccount(accountId)
  } catch (error) {
    console.error('Failed to load account:', error)
    toast.add({
      severity: 'error',
      summary: t('dashboard.error'),
      detail: t('dashboard.accountLoadFailed'),
      life: 5000
    })
  } finally {
    loading.value = false
  }
})
</script>