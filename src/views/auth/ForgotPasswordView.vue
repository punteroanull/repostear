<template>
  <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">{{ $t('auth.forgotPassword') }}</h1>
      <p class="text-neutral-600 dark:text-neutral-400">
        {{ $t('auth.forgotPasswordSubtitle') }}
      </p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
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
      
      <Button 
        type="submit" 
        :label="$t('auth.sendResetLink')" 
        class="w-full" 
        :loading="loading"
      />
      
      <div class="text-center mt-6">
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.rememberPassword') }}
          <router-link 
            to="/auth/login" 
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t('auth.login') }}
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import api from '@/services/api'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

const email = ref('')
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
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await api.post('/forgot-password', { email: email.value })
    
    toast.add({
      severity: 'success',
      summary: t('auth.resetLinkSent'),
      detail: t('auth.checkEmail'),
      life: 5000
    })
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (error: any) {
    console.error('Password reset request error:', error)
    
    toast.add({
      severity: 'error',
      summary: t('auth.resetLinkFailed'),
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