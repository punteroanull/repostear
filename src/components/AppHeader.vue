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
      <div class="flex items-center space-x-2">
        <!-- Language Selector -->
        <Menu ref="langMenu" :model="languageMenuItems" :popup="true" />
        <button
          @click="toggleLangMenu"
          class="px-2.5 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          aria-label="Change Language"
        >
          {{ selectedLanguage.toUpperCase() }}
        </button>

        <!-- Theme Toggle -->
        <button
          @click="() => isDarkMode = !isDarkMode"
          class="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          aria-label="Toggle Dark Mode"
        >
          <i :class="[isDarkMode ? 'pi pi-sun' : 'pi pi-moon']" class="text-sm"></i>
        </button>
        
        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <Button
            :label="$t('auth.login')"
            class="p-button-text text-sm px-6 py-2 whitespace-nowrap transition-all duration-150 active:scale-95 border border-neutral-300 dark:border-white text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-white hover:text-neutral-900"
            @click="navigateTo('/auth/login')"
          />
          <Button
            :label="$t('auth.register')"
            class="text-sm px-6 py-2 whitespace-nowrap transition-all duration-150 active:scale-95 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-100"
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
import { useDark } from '@vueuse/core'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const userMenu = ref()
const langMenu = ref()
const mobileMenuOpen = ref(false)
const isDarkMode = useDark()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const userAvatar = computed(() => user.value?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg')

const selectedLanguage = ref(locale.value)

const navItems = [
  { path: '/', label: 'nav.home' },
  { path: '/pricing', label: 'nav.pricing' },
  { path: '/dashboard', label: 'nav.dashboard', requiresAuth: true }
]

const languageMenuItems = computed(() => [
  {
    label: 'English',
    command: () => changeLanguage('en')
  },
  {
    label: 'Español',
    command: () => changeLanguage('es')
  }
])

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

const toggleLangMenu = (event: Event) => {
  langMenu.value?.toggle(event)
}

const toggleUserMenu = (event: Event) => {
  userMenu.value?.toggle(event)
}

const navigateTo = (path: string) => {
  router.push(path)
  mobileMenuOpen.value = false
}

const changeLanguage = (lang: string) => {
  selectedLanguage.value = lang
  locale.value = lang
  if (isAuthenticated.value) {
    authStore.updateLanguage(lang)
  } else {
    localStorage.setItem('language', lang)
  }
}
</script>