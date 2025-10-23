<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
    <!-- Header -->
    <AppHeader />
    
    <div class="flex flex-col md:flex-row flex-grow">
      <!-- Sidebar -->
      <aside 
        :class="[
          'bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300',
          'md:w-64 md:flex-shrink-0 md:flex md:flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'fixed md:static inset-y-0 left-0 z-40 md:z-0 w-64 h-full'
        ]"
      >
        <!-- Mobile Close Button -->
        <div class="flex items-center justify-between p-4 md:hidden">
          <span class="text-xl font-semibold">{{ $t('dashboard.menu') }}</span>
          <button 
            @click="closeSidebar" 
            class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        
        <!-- Sidebar Content -->
        <div class="p-4 flex-grow overflow-y-auto">
          <!-- Account Selector (if multiple accounts) -->
          <div v-if="accounts.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              {{ $t('dashboard.accounts') }}
            </label>
            <Dropdown
              v-model="selectedAccount"
              :options="accounts"
              optionLabel="display_name"
              :placeholder="$t('dashboard.selectAccount')"
              class="w-full"
              @change="onAccountChange"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <Avatar 
                    :image="slotProps.value.avatar_url" 
                    shape="circle" 
                    class="mr-2"
                    placeholder="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
                  />
                  <div>
                    <div>{{ slotProps.value.display_name }}</div>
                    <div class="text-xs text-neutral-500">@{{ slotProps.value.username }}</div>
                  </div>
                </div>
                <span v-else>{{ $t('dashboard.selectAccount') }}</span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  <Avatar 
                    :image="slotProps.option.avatar_url" 
                    shape="circle" 
                    class="mr-2"
                    placeholder="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
                  />
                  <div>
                    <div>{{ slotProps.option.display_name }}</div>
                    <div class="text-xs text-neutral-500">@{{ slotProps.option.username }}</div>
                  </div>
                </div>
              </template>
            </Dropdown>
            <Button 
              icon="pi pi-plus" 
              label="Add Account" 
              class="p-button-outlined w-full mt-2" 
              @click="navigateTo('/dashboard/accounts/add')"
            />
          </div>
          
          <!-- No Accounts Message -->
          <div v-else class="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4 mb-6">
            <p class="text-neutral-700 dark:text-neutral-300 mb-3">
              {{ $t('dashboard.noAccounts') }}
            </p>
            <Button 
              icon="pi pi-plus" 
              :label="$t('dashboard.addAccount')" 
              @click="navigateTo('/dashboard/accounts/add')"
              class="w-full"
            />
          </div>
          
          <!-- Navigation Menu -->
          <nav class="space-y-1">
            <div v-for="group in menuItems" :key="group.label" class="mb-4">
              <div class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 px-2">
                {{ $t(group.label) }}
              </div>
              
              <div class="space-y-1">
                <template v-for="item in group.items" :key="item.to">
                  <router-link
                    v-if="!item.accountRequired || selectedAccount"
                    :to="getItemPath(item)"
                    class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    :class="[
                      isActive(item) 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    ]"
                    @click="closeSidebar"
                  >
                    <i :class="[item.icon, 'mr-3 text-lg flex-shrink-0', isActive(item) ? 'text-primary-500' : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300']"></i>
                    {{ $t(item.label) }}
                  </router-link>
                </template>
              </div>
            </div>
          </nav>
        </div>
        
        <!-- User Section -->
        <div class="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <Avatar 
                :image="userAvatar" 
                shape="circle" 
                placeholder="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
              />
              <div>
                <p class="font-medium text-neutral-800 dark:text-neutral-200">{{ user?.name }}</p>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ subscriptionName }}</p>
              </div>
            </div>
            
            <Menu ref="userSettingsMenu" :model="userSettingsItems" :popup="true" />
            <button 
              @click="toggleUserSettingsMenu" 
              class="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <i class="pi pi-cog text-lg"></i>
            </button>
          </div>
        </div>
      </aside>
      
      <!-- Mobile Sidebar Backdrop -->
      <div 
        v-if="sidebarOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
        @click="closeSidebar"
      ></div>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-auto p-4 md:p-6">
        <!-- Mobile Header -->
        <div class="flex items-center justify-between md:hidden mb-4">
          <button 
            @click="sidebarOpen = true" 
            class="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800"
          >
            <i class="pi pi-bars text-xl"></i>
          </button>
          
          <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
          
          <div class="w-8"></div> <!-- Spacer for alignment -->
        </div>
        
        <!-- Page Content -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore, type SocialMediaAccount } from '@/stores/accounts'
import { useSubscriptionStore } from '@/stores/subscription'
import AppHeader from '@/components/AppHeader.vue'
import Avatar from 'primevue/avatar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()
const subscriptionStore = useSubscriptionStore()

const sidebarOpen = ref(false)
const userSettingsMenu = ref()
const selectedAccount = ref<SocialMediaAccount | null>(null)

// User information
const user = computed(() => authStore.user)
const userAvatar = computed(() => user.value?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg')
const subscriptionName = computed(() => {
  const tier = authStore.subscriptionTier
  return tier ? t(`subscription.${tier}`) : t('subscription.free')
})

// Accounts
const accounts = computed(() => accountsStore.accounts)

// Dynamic page title based on route
const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('/accounts/') && path.includes('/followers')) return t('dashboard.followers')
  if (path.includes('/accounts/') && path.includes('/interactions')) return t('dashboard.interactions')
  if (path.includes('/accounts/') && path.includes('/posts')) return t('dashboard.posts')
  if (path.includes('/accounts/') && path.includes('/statistics')) return t('dashboard.statistics')
  if (path.includes('/accounts/') && path.includes('/word-analysis')) return t('dashboard.wordAnalysis')
  if (path.includes('/accounts/') && path.includes('/lists')) return t('dashboard.lists')
  if (path.includes('/accounts/') && path.includes('/blocking')) return t('dashboard.blocking')
  if (path.includes('/accounts/add')) return t('dashboard.addAccount')
  if (path.includes('/accounts/')) return t('dashboard.accountDetails')
  if (path.includes('/accounts')) return t('dashboard.accounts')
  if (path.includes('/giveaways/create')) return t('dashboard.createGiveaway')
  if (path.includes('/giveaways/')) return t('dashboard.giveawayDetails')
  if (path.includes('/giveaways')) return t('dashboard.giveaways')
  if (path.includes('/subscription/plans')) return t('dashboard.subscriptionPlans')
  if (path.includes('/subscription')) return t('dashboard.subscription')
  if (path.includes('/tokens')) return t('dashboard.tokens')
  if (path.includes('/settings')) return t('dashboard.settings')
  return t('dashboard.dashboard')
})

// Navigation menu
const menuItems = computed(() => [
  {
    label: 'dashboard.menu.main',
    items: [
      { label: 'dashboard.dashboard', to: '/dashboard', icon: 'pi pi-th-large' },
      { label: 'dashboard.accounts', to: '/dashboard/accounts', icon: 'pi pi-users' }
    ]
  },
  {
    label: 'dashboard.menu.analytics',
    items: [
      { label: 'dashboard.followers', to: '/accounts/:id/followers', icon: 'pi pi-user-plus', accountRequired: true },
      { label: 'dashboard.interactions', to: '/accounts/:id/interactions', icon: 'pi pi-comments', accountRequired: true },
      { label: 'dashboard.posts', to: '/accounts/:id/posts', icon: 'pi pi-inbox', accountRequired: true },
      { label: 'dashboard.statistics', to: '/accounts/:id/statistics', icon: 'pi pi-chart-bar', accountRequired: true },
      { label: 'dashboard.wordAnalysis', to: '/accounts/:id/word-analysis', icon: 'pi pi-hashtag', accountRequired: true }
    ]
  },
  {
    label: 'dashboard.menu.giveaways',
    items: [
      { label: 'dashboard.giveaways', to: '/dashboard/giveaways', icon: 'pi pi-gift' }
    ]
  },
  {
    label: 'dashboard.menu.bluesky',
    items: [
      { label: 'dashboard.lists', to: '/accounts/:id/lists', icon: 'pi pi-list', accountRequired: true },
      { label: 'dashboard.blocking', to: '/accounts/:id/blocking', icon: 'pi pi-ban', accountRequired: true }
    ]
  },
  {
    label: 'dashboard.menu.subscription',
    items: [
      { label: 'dashboard.subscription', to: '/dashboard/subscription', icon: 'pi pi-credit-card' },
      { label: 'dashboard.tokens', to: '/dashboard/tokens', icon: 'pi pi-ticket' }
    ]
  }
])

// User settings menu
const userSettingsItems = computed(() => [
  {
    label: t('dashboard.settings'),
    icon: 'pi pi-cog',
    command: () => navigateTo('/dashboard/settings')
  },
  {
    label: t('dashboard.subscription'),
    icon: 'pi pi-credit-card',
    command: () => navigateTo('/dashboard/subscription')
  },
  { separator: true },
  {
    label: t('auth.logout'),
    icon: 'pi pi-sign-out',
    command: () => authStore.logout()
  }
])

// Methods
const closeSidebar = () => {
  sidebarOpen.value = false
}

const toggleUserSettingsMenu = (event: Event) => {
  userSettingsMenu.value?.toggle(event)
}

const navigateTo = (path: string) => {
  router.push(path)
  closeSidebar()
}

const isActive = (item: any) => {
  if (item.accountRequired && selectedAccount.value) {
    const actualPath = item.to.replace(':id', selectedAccount.value.id.toString())
    return route.path.includes(actualPath)
  }
  return route.path.includes(item.to)
}

const getItemPath = (item: any) => {
  if (item.accountRequired && selectedAccount.value) {
    return item.to.replace(':id', selectedAccount.value.id.toString())
  }
  return item.to
}

const onAccountChange = () => {
  if (selectedAccount.value) {
    // If we're on an account-specific page, navigate to the same page for the new account
    if (route.params.id) {
      const newPath = route.path.replace(route.params.id as string, selectedAccount.value.id.toString())
      router.push(newPath)
    }
  }
}

// Check if current route has account ID and select that account
const updateSelectedAccountFromRoute = () => {
  if (route.params.id && accounts.value.length > 0) {
    const accountId = Number(route.params.id)
    const account = accounts.value.find(a => a.id === accountId)
    if (account) {
      selectedAccount.value = account
    }
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Fetch accounts
  try {
    await accountsStore.fetchAccounts()
    if (accounts.value.length > 0) {
      // If no account is selected, select the first one
      if (!selectedAccount.value) {
        selectedAccount.value = accounts.value[0]
      }
    }
    
    // Update selected account based on route
    updateSelectedAccountFromRoute()
  } catch (error) {
    console.error('Failed to fetch accounts:', error)
  }
  
  // Fetch subscription
  try {
    await subscriptionStore.fetchCurrentSubscription()
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
  }
})

// Watch for route changes to update selected account
watch(
  () => route.params.id,
  () => updateSelectedAccountFromRoute()
)
</script>