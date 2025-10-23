<template>
  <footer class="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Brand -->
        <div class="mb-6 md:mb-0">
          <router-link to="/" class="text-xl font-semibold text-neutral-900 dark:text-white">
            Repostear
          </router-link>
          <p class="mt-2 text-neutral-600 dark:text-neutral-400">
            {{ $t('footer.tagline') }}
          </p>
        </div>
        
        <!-- Links -->
        <div class="flex space-x-8">
          <div>
            <h3 class="font-medium mb-3">{{ $t('footer.product') }}</h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/pricing" class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  {{ $t('footer.pricing') }}
                </router-link>
              </li>
              <li>
                <a href="#" class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  {{ $t('footer.help') }}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium mb-3">{{ $t('footer.legal') }}</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  {{ $t('footer.terms') }}
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  {{ $t('footer.privacy') }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-8 text-center">
        <p class="text-neutral-600 dark:text-neutral-400">
          © {{ new Date().getFullYear() }} Repostear. {{ $t('footer.rights') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No additional logic needed
</script>