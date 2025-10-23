<template>
  <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">{{ $t('auth.registerTitle') }}</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('auth.registerSubtitle') }}
      </p>
    </div>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="form-group">
        <label for="name" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {{ $t('auth.name') }}
        </label>
        <InputText 
          id="name" 
          v-model="name" 
          type="text" 
          :placeholder="$t('auth.namePlaceholder')"
          autocomplete="name"
          :class="{ 'p-invalid': errors.name }"
          aria-required="true"
        />
        <small v-if="errors.name" class="p-error block mt-1">{{ errors.name }}</small>
      </div>

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
        <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {{ $t('auth.password') }}
        </label>
        <Password 
          id="password" 
          v-model="password" 
          :placeholder="$t('auth.passwordPlaceholder')"
          :feedback="true"
          toggleMask
          :class="{ 'p-invalid': errors.password }"
          aria-required="true"
        />
        <small v-if="errors.password" class="p-error block mt-1">{{ errors.password }}</small>
      </div>
      
      <div class="form-group">
        <label for="passwordConfirmation" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {{ $t('auth.confirmPassword') }}
        </label>
        <Password 
          id="passwordConfirmation" 
          v-model="passwordConfirmation" 
          :placeholder="$t('auth.passwordPlaceholder')"
          :feedback="false"
          toggleMask
          :class="{ 'p-invalid': errors.passwordConfirmation }"
          aria-required="true"
        />
        <small v-if="errors.passwordConfirmation" class="p-error block mt-1">{{ errors.passwordConfirmation }}</small>
      </div>
      
      <Button 
        type="submit" 
        :label="$t('auth.register')" 
        class="w-full text-sm" 
        :loading="loading"
      />
      
      <div class="text-center mt-6">
        <p class="text-xs text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.alreadyAccount') }}
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
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  let isValid = true
  
  if (!name.value) {
    errors.value.name = t('auth.errors.nameRequired')
    isValid = false
  }
  
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
  } else if (password.value.length < 8) {
    errors.value.password = t('auth.errors.passwordLength')
    isValid = false
  }
  
  if (password.value !== passwordConfirmation.value) {
    errors.value.passwordConfirmation = t('auth.errors.passwordMatch')
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await authStore.register(name.value, email.value, password.value, passwordConfirmation.value)
    
    toast.add({
      severity: 'success',
      summary: t('auth.registerSuccess'),
      detail: t('auth.welcomeNew'),
      life: 3000
    })
    
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Registration error:', error)
    
    toast.add({
      severity: 'error',
      summary: t('auth.registerFailed'),
      detail: error.response?.data?.message || t('auth.errors.general'),
      life: 5000
    })
    
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