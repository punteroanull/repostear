<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <Button 
        icon="pi pi-arrow-left" 
        text 
        :label="$t('dashboard.back')"
        @click="router.back()"
        class="mb-4"
      />
      <h1 class="text-3xl font-bold mb-2">{{ $t('dashboard.addAccount') }}</h1>
      <p class="text-neutral-600 dark:text-neutral-400">
        {{ $t('dashboard.connectSocialAccount') }}
      </p>
    </div>

    <!-- Account Limit Warning -->
    <div v-if="isAtLimit" class="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700 rounded-lg p-4">
      <div class="flex items-start">
        <i class="pi pi-times-circle text-error-500 mr-3 mt-1"></i>
        <div class="flex-1">
          <p class="font-medium text-error-800 dark:text-error-200 mb-1">
            {{ $t('dashboard.accountLimitReached') }}
          </p>
          <p class="text-sm text-error-700 dark:text-error-300 mb-3">
            {{ $t('dashboard.accountLimitReachedMessage') }}
          </p>
          <Button 
            :label="$t('dashboard.upgradePlan')" 
            size="small"
            severity="danger"
            @click="navigateTo('/dashboard/subscription/plans')"
          />
        </div>
      </div>
    </div>

    <!-- Platform Selection -->
    <div v-if="!isAtLimit" class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.selectPlatform') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Bluesky -->
        <div 
          :class="[
            'border-2 rounded-lg p-6 cursor-pointer transition-all',
            selectedPlatform === 'bluesky' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
          ]"
          @click="selectPlatform('bluesky')"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-globe text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold">Bluesky</h3>
              <Tag value="Available" severity="success" class="text-xs" />
            </div>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('dashboard.blueskyDescription') }}
          </p>
        </div>

        <!-- Twitter/X -->
        <div 
          :class="[
            'border-2 rounded-lg p-6 cursor-pointer transition-all opacity-50',
            'border-neutral-200 dark:border-neutral-700'
          ]"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <i class="pi pi-twitter text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold">Twitter (X)</h3>
              <Tag :value="$t('dashboard.comingSoon')" severity="warning" class="text-xs" />
            </div>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('dashboard.twitterDescription') }}
          </p>
        </div>

        <!-- Instagram -->
        <div 
          :class="[
            'border-2 rounded-lg p-6 cursor-pointer transition-all opacity-50',
            'border-neutral-200 dark:border-neutral-700'
          ]"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <i class="pi pi-instagram text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold">Instagram</h3>
              <Tag :value="$t('dashboard.comingSoon')" severity="warning" class="text-xs" />
            </div>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('dashboard.instagramDescription') }}
          </p>
        </div>

        <!-- Facebook -->
        <div 
          :class="[
            'border-2 rounded-lg p-6 cursor-pointer transition-all opacity-50',
            'border-neutral-200 dark:border-neutral-700'
          ]"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <i class="pi pi-facebook text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold">Facebook</h3>
              <Tag :value="$t('dashboard.comingSoon')" severity="warning" class="text-xs" />
            </div>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('dashboard.facebookDescription') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Authentication Form -->
    <div v-if="selectedPlatform && !isAtLimit" class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold mb-4">{{ $t('dashboard.connectAccount') }}</h2>
      
      <!-- Bluesky Form -->
      <form v-if="selectedPlatform === 'bluesky'" @submit.prevent="handleAddAccount" class="space-y-4">
        <div class="form-group">
          <label for="handle" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {{ $t('dashboard.blueskyHandle') }}
          </label>
          <InputText 
            id="handle" 
            v-model="formData.username" 
            type="text" 
            placeholder="username.bsky.social"
            :class="{ 'p-invalid': errors.username }"
            class="w-full"
          />
          <small v-if="errors.username" class="p-error block mt-1">{{ errors.username }}</small>
          <small class="text-neutral-500 block mt-1">{{ $t('dashboard.blueskyHandleHelp') }}</small>
        </div>

        <div class="form-group">
          <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {{ $t('dashboard.appPassword') }}
          </label>
          <Password 
            id="password" 
            v-model="formData.password" 
            :placeholder="$t('dashboard.appPasswordPlaceholder')"
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': errors.password }"
            class="w-full"
          />
          <small v-if="errors.password" class="p-error block mt-1">{{ errors.password }}</small>
          <small class="text-neutral-500 block mt-1">
            {{ $t('dashboard.appPasswordHelp') }}
            <a href="https://bsky.app/settings/app-passwords" target="_blank" class="text-primary-500 hover:underline">
              {{ $t('dashboard.createAppPassword') }}
            </a>
          </small>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div class="flex items-start">
            <i class="pi pi-info-circle text-blue-500 mr-3 mt-1"></i>
            <div class="text-sm text-blue-800 dark:text-blue-200">
              <p class="font-medium mb-1">{{ $t('dashboard.securityNote') }}</p>
              <p>{{ $t('dashboard.securityNoteMessage') }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <Button 
            :label="$t('dashboard.cancel')" 
            text
            @click="cancelAddAccount"
          />
          <Button 
            type="submit"
            :label="$t('dashboard.connect')" 
            icon="pi pi-link"
            :loading="loading"
          />
        </div>
      </form>
    </div>

    <!-- Help Section -->
    <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
      <h3 class="font-bold mb-3">{{ $t('dashboard.needHelp') }}</h3>
      <div class="space-y-3">
        <details class="group">
          <summary class="cursor-pointer font-medium text-sm">
            {{ $t('dashboard.howToGetAppPassword') }}
          </summary>
          <div class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 pl-4">
            <ol class="list-decimal list-inside space-y-1">
              <li>{{ $t('dashboard.appPasswordStep1') }}</li>
              <li>{{ $t('dashboard.appPasswordStep2') }}</li>
              <li>{{ $t('dashboard.appPasswordStep3') }}</li>
              <li>{{ $t('dashboard.appPasswordStep4') }}</li>
            </ol>
          </div>
        </details>
        
        <details class="group">
          <summary class="cursor-pointer font-medium text-sm">
            {{ $t('dashboard.whyAppPassword') }}
          </summary>
          <div class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 pl-4">
            <p>{{ $t('dashboard.whyAppPasswordAnswer') }}</p>
          </div>
        </details>

        <details class="group">
          <summary class="cursor-pointer font-medium text-sm">
            {{ $t('dashboard.isMyDataSafe') }}
          </summary>
          <div class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 pl-4">
            <p>{{ $t('dashboard.isMyDataSafeAnswer') }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccountsStore } from '@/stores/accounts'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Tag from 'primevue/tag'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const selectedPlatform = ref<string>('')
const loading = ref(false)
const formData = ref({
  username: '',
  password: ''
})
const errors = ref<Record<string, string>>({})

const accountCount = computed(() => accountsStore.accountCount)
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

const isAtLimit = computed(() => {
  return accountCount.value >= accountLimit.value && accountLimit.value !== Infinity
})

const selectPlatform = (platform: string) => {
  if (platform === 'bluesky') {
    selectedPlatform.value = platform
    formData.value = { username: '', password: '' }
    errors.value = {}
  } else {
    toast.add({
      severity: 'info',
      summary: t('dashboard.comingSoon'),
      detail: t('dashboard.platformComingSoon', { platform }),
      life: 3000
    })
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.username) {
    errors.value.username = t('dashboard.usernameRequired')
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = t('dashboard.passwordRequired')
    isValid = false
  }

  return isValid
}

const handleAddAccount = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // Format username (remove @ if present, ensure .bsky.social)
    let username = formData.value.username.trim()
    if (username.startsWith('@')) {
      username = username.substring(1)
    }
    if (!username.includes('.')) {
      username = `${username}.bsky.social`
    }

    await accountsStore.addAccount(
      selectedPlatform.value,
      username,
      formData.value.password
    )

    toast.add({
      severity: 'success',
      summary: t('dashboard.success'),
      detail: t('dashboard.accountConnected'),
      life: 3000
    })

    router.push('/dashboard/accounts')
  } catch (error: any) {
    console.error('Failed to add account:', error)
    
    const errorMessage = error.response?.data?.message || t('dashboard.accountConnectionFailed')
    
    toast.add({
      severity: 'error',
      summary: t('dashboard.error'),
      detail: errorMessage,
      life: 5000
    })

    // Handle specific field errors
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  } finally {
    loading.value = false
  }
}

const cancelAddAccount = () => {
  router.push('/dashboard/accounts')
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>