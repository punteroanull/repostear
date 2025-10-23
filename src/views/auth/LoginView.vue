<template>
  <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">{{ $t('auth.loginTitle') }}</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('auth.loginSubtitle') }}
      </p>
    </div>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {{ $t('auth.email') }}
        </label>
        <InputText 
          id="email" 
          v-model="email" 
          type="email" 
          :placeholder="$t('auth.emailPlaceholder')"
          autocomplete="email"
          :class="{ 'p-invalid': errors.email }"
          aria-required="true"
        />
        <small v-if="errors.email" class="p-error block mt-1">{{ errors.email }}</small>
      </div>
      
      <div class="form-group">
        <div class="flex justify-between items-center mb-1">
          <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {{ $t('auth.password') }}
          </label>
          <router-link 
            to="/auth/forgot-password" 
            class="text-xs text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t('auth.forgotPassword') }}
          </router-link>
        </div>
        <Password 
          id="password" 
          v-model="password" 
          :placeholder="$t('auth.passwordPlaceholder')"
          :feedback="false"
          toggleMask
          :class="{ 'p-invalid': errors.password }"
          aria-required="true"
        />
        <small v-if="errors.password" class="p-error block mt-1">{{ errors.password }}</small>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Checkbox id="remember" v-model="remember" :binary="true" />
          <label for="remember" class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
            {{ $t('auth.rememberMe') }}
          </label>
        </div>
      </div>
      
      <Button 
        type="submit" 
        :label="$t('auth.login')" 
        class="w-full text-sm" 
        :loading="loading"
      />
      
      <div class="text-center mt-6">
        <p class="text-xs text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.noAccount') }}
          <router-link 
            to="/auth/register" 
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t('auth.register') }}
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  let isValid = true
  
  if (!email.value) {
    errors.value.email = t('auth.errors.emailRequired')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = t('auth.errors.emailInvalid')
    isValid = false
  }
  
  if (!password.value) {
    errors.value.password = t('auth.errors.passwordRequired')
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await authStore.login(email.value, password.value)
    
    toast.add({
      severity: 'success',
      summary: t('auth.loginSuccess'),
      detail: t('auth.welcomeBack'),
      life: 3000
    })
    
    // Redirect to the dashboard or any previously attempted page
    const redirectPath = route.query.redirect ? String(route.query.redirect) : '/dashboard'
    router.push(redirectPath)
  } catch (error: any) {
    console.error('Login error:', error)
    
    toast.add({
      severity: 'error',
      summary: t('auth.loginFailed'),
      detail: error.response?.data?.message || t('auth.errors.general'),
      life: 5000
    })
    
    // Add specific errors if they exist in the response
    if (error.response?.data?.errors) {
      const responseErrors = error.response.data.errors
      Object.keys(responseErrors).forEach(key => {
        errors.value[key] = responseErrors[key][0]
      })
    }
  } finally {
    loading.value = false
  }
}
</script>