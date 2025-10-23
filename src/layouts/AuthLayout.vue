<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col transition-colors duration-200">
    <div class="p-6">
      <router-link to="/" class="text-2xl font-bold text-primary-500">Repostear</router-link>
    </div>
    
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
    <div class="p-6 text-center text-neutral-600 dark:text-neutral-400">
      <p>© {{ new Date().getFullYear() }} Repostear. {{ $t('footer.rights') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>