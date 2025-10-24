<template>
  <header class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="text-xl font-semibold text-neutral-900 dark:text-white">
        Repostear
      </router-link>
      
      <!-- Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          {{ $t(item.label) }}
        </router-link>
      </nav>
      
      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Language Selector -->
        <Dropdown
          v-model="selectedLanguage"
          :options="languages"
          optionLabel="name"
          optionValue="code"
          class="w-16 text-xs"
          @change="changeLanguage"
        />
        
        <!-- Theme Toggle -->
        <button 
          @click="toggleDarkMode" 
          class="p-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          aria-label="Toggle Dark Mode"
        >
          <i :class="[isDarkMode ? 'pi pi-sun' : 'pi pi-moon']"></i>
        </button>
        
        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <Button 
            :label="$t('auth.login')" 
            class="p-button-outlined text-xs px-2 py-1 transition-all duration-150 active:scale-95 active:shadow-inner" 
            @click="navigateTo('/auth/login')" 
          />
          <Button 
            :label="$t('auth.register')" 
            class="text-xs px-3 py-1 transition-all duration-150 active:scale-95 active:shadow-inner"
            @click="navigateTo('/auth/register')" 
          />
        </template>
        
        <!-- User Menu -->
        <Menu v-else ref="userMenu" :model="userMenuItems" :popup="true" />
        <Button 
          v-if="isAuthenticated"
          @click="toggleUserMenu" 
          class="p-button-text"
        >
          <Avatar 
            :image="userAvatar" 
            shape="circle" 
            size="small"
            class="mr-2"
          />
          <span class="hidden md:inline">{{ user?.name }}</span>
        </Button>
      </div>
      
      <!-- Mobile Menu Button -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen" 
        class="md:hidden p-2"
      >
        <i :class="[mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars']"></i>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden border-t border-neutral-200 dark:border-neutral-800"
    >
      <div class="container mx-auto px-4 py-4 space-y-4">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="block py-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          @click="mobileMenuOpen = false"
        >
          {{ $t(item.label) }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useDark, useToggle } from '@vueuse/core'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import Dropdown from 'primevue/dropdown'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const userMenu = ref()
const mobileMenuOpen = ref(false)
const isDarkMode = useDark()
const toggleDarkMode = useToggle(isDarkMode)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const userAvatar = computed(() => user.value?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg')

const selectedLanguage = ref(locale.value)
const languages = [
  { name: 'EN', code: 'en' },
  { name: 'ES', code: 'es' }
]

const navItems = [
  { path: '/', label: 'nav.home' },
  { path: '/pricing', label: 'nav.pricing' },
  { path: '/dashboard', label: 'nav.dashboard', requiresAuth: true }
]

const userMenuItems = computed(() => [
  {
    label: t('user.dashboard'),
    icon: 'pi pi-th-large',
    command: () => navigateTo('/dashboard')
  },
  {
    label: t('user.settings'),
    icon: 'pi pi-cog',
    command: () => navigateTo('/dashboard/settings')
  },
  { separator: true },
  {
    label: t('auth.logout'),
    icon: 'pi pi-sign-out',
    command: () => authStore.logout()
  }
])

const toggleUserMenu = (event: Event) => {
  userMenu.value?.toggle(event)
}

const navigateTo = (path: string) => {
  router.push(path)
  mobileMenuOpen.value = false
}

const changeLanguage = () => {
  locale.value = selectedLanguage.value
  if (isAuthenticated.value) {
    authStore.updateLanguage(selectedLanguage.value)
  } else {
    localStorage.setItem('language', selectedLanguage.value)
  }
}
</script>