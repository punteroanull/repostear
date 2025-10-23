<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center">
          <div class="lg:w-1/2 mb-8 lg:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-slide-up">
              {{ $t('home.hero.title') }}
            </h1>
            <p class="text-xl md:text-2xl mb-6 max-w-lg opacity-90 animate-slide-up" style="animation-delay: 100ms">
              {{ $t('home.hero.subtitle') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 animate-slide-up" style="animation-delay: 200ms">
              <Button :label="$t('home.hero.getStarted')" class="p-button-lg" @click="navigateTo('/auth/register')" />
              <Button :label="$t('home.hero.learnMore')" class="p-button-outlined p-button-lg p-button-secondary" @click="scrollToFeatures" />
            </div>
          </div>
          <div class="lg:w-1/2 flex justify-center animate-slide-up" style="animation-delay: 300ms">
            <img src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg" alt="Analytics Dashboard" class="rounded-lg shadow-xl max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Platforms Section -->
    <section class="py-16 bg-white dark:bg-neutral-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-8">{{ $t('home.platforms.title') }}</h2>
        <div class="flex flex-wrap justify-center items-center gap-12">
          <div class="flex flex-col items-center">
            <i class="pi pi-twitter text-5xl text-[#1DA1F2] mb-3"></i>
            <span class="text-lg font-medium">Twitter (X)</span>
          </div>
          <div class="flex flex-col items-center">
            <i class="pi pi-globe text-5xl text-[#0063FF] mb-3"></i>
            <span class="text-lg font-medium">Bluesky</span>
          </div>
          <div class="flex flex-col items-center opacity-50">
            <i class="pi pi-instagram text-5xl text-[#E1306C] mb-3"></i>
            <span class="text-lg font-medium">Instagram ({{ $t('home.platforms.comingSoon') }})</span>
          </div>
          <div class="flex flex-col items-center opacity-50">
            <i class="pi pi-facebook text-5xl text-[#4267B2] mb-3"></i>
            <span class="text-lg font-medium">Facebook ({{ $t('home.platforms.comingSoon') }})</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section ref="featuresSection" class="py-16 bg-neutral-50 dark:bg-neutral-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">{{ $t('home.features.title') }}</h2>
          <p class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {{ $t('home.features.subtitle') }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" 
               class="bg-white dark:bg-neutral-700 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <i :class="['text-primary-600 dark:text-primary-400 text-xl', feature.icon]"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ $t(feature.title) }}</h3>
            <p class="text-neutral-600 dark:text-neutral-300">{{ $t(feature.description) }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Subscription Plans -->
    <section class="py-16 bg-white dark:bg-neutral-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">{{ $t('home.plans.title') }}</h2>
          <p class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {{ $t('home.plans.subtitle') }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Free Plan -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
            <div class="p-6 bg-neutral-50 dark:bg-neutral-700">
              <h3 class="text-xl font-bold">{{ $t('subscription.free') }}</h3>
              <div class="mt-4 mb-1">
                <span class="text-3xl font-bold">$0</span>
                <span class="text-neutral-600 dark:text-neutral-400">/{{ $t('subscription.month') }}</span>
              </div>
              <p class="text-neutral-600 dark:text-neutral-400">{{ $t('home.plans.freeDescription') }}</p>
            </div>
            <div class="p-6 flex-grow">
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.oneAccount') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.limitedData') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.updates24h') }}</span>
                </li>
                <li class="flex items-start text-neutral-400">
                  <i class="pi pi-times-circle text-neutral-400 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.noTokens') }}</span>
                </li>
              </ul>
            </div>
            <div class="p-6 mt-auto">
              <Button :label="$t('home.plans.getStarted')" class="p-button-outlined w-full" @click="navigateTo('/auth/register')" />
            </div>
          </div>
          
          <!-- Pro Plan -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
            <div class="p-6 bg-primary-50 dark:bg-primary-900">
              <h3 class="text-xl font-bold">{{ $t('subscription.pro') }}</h3>
              <div class="mt-4 mb-1">
                <span class="text-3xl font-bold">€6.99</span>
                <span class="text-neutral-600 dark:text-neutral-400">/{{ $t('subscription.month') }}</span>
              </div>
              <p class="text-neutral-600 dark:text-neutral-400">{{ $t('home.plans.proDescription') }}</p>
            </div>
            <div class="p-6 flex-grow">
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.twoAccounts') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.fullData') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.updates6h') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.limitedTokens') }}</span>
                </li>
              </ul>
            </div>
            <div class="p-6 mt-auto">
              <Button :label="$t('home.plans.getStarted')" class="w-full" @click="navigateTo('/auth/register')" />
            </div>
          </div>
          
          <!-- Influencer Plan -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col relative">
            <div class="absolute top-0 right-0 bg-accent-500 text-white px-4 py-1 rounded-bl-lg font-medium">
              {{ $t('home.plans.popular') }}
            </div>
            <div class="p-6 bg-secondary-50 dark:bg-secondary-900">
              <h3 class="text-xl font-bold">{{ $t('subscription.influencer') }}</h3>
              <div class="mt-4 mb-1">
                <span class="text-3xl font-bold">€19</span>
                <span class="text-neutral-600 dark:text-neutral-400">/{{ $t('subscription.month') }}</span>
              </div>
              <p class="text-neutral-600 dark:text-neutral-400">{{ $t('home.plans.influencerDescription') }}</p>
            </div>
            <div class="p-6 flex-grow">
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.fiveAccounts') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.fullData') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.updates2h') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.standardTokens') }}</span>
                </li>
              </ul>
            </div>
            <div class="p-6 mt-auto">
              <Button :label="$t('home.plans.getStarted')" class="p-button-success w-full" @click="navigateTo('/auth/register')" />
            </div>
          </div>
          
          <!-- Business Plan -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
            <div class="p-6 bg-accent-50 dark:bg-accent-900/30">
              <h3 class="text-xl font-bold">{{ $t('subscription.business') }}</h3>
              <div class="mt-4 mb-1">
                <span class="text-3xl font-bold">€99</span>
                <span class="text-neutral-600 dark:text-neutral-400">/{{ $t('subscription.month') }}</span>
              </div>
              <p class="text-neutral-600 dark:text-neutral-400">{{ $t('home.plans.businessDescription') }}</p>
            </div>
            <div class="p-6 flex-grow">
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.unlimitedAccounts') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.fullData') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.realTime') }}</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-success-500 mr-2 mt-1"></i>
                  <span>{{ $t('home.plans.unlimitedTokens') }}</span>
                </li>
              </ul>
            </div>
            <div class="p-6 mt-auto">
              <Button :label="$t('home.plans.contactSales')" class="p-button-outlined p-button-warning w-full" @click="navigateTo('/auth/register')" />
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-secondary-500 to-primary-500 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ $t('home.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {{ $t('home.cta.subtitle') }}
        </p>
        <Button :label="$t('home.cta.getStarted')" class="p-button-lg" @click="navigateTo('/auth/register')" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const featuresSection = ref<HTMLElement | null>(null)

const features = [
  { 
    icon: 'pi pi-users',
    title: 'home.features.followerTracking.title',
    description: 'home.features.followerTracking.description'
  },
  { 
    icon: 'pi pi-chart-line',
    title: 'home.features.analytics.title',
    description: 'home.features.analytics.description'
  },
  { 
    icon: 'pi pi-comment',
    title: 'home.features.engagement.title',
    description: 'home.features.engagement.description'
  },
  { 
    icon: 'pi pi-hashtag',
    title: 'home.features.contentAnalysis.title',
    description: 'home.features.contentAnalysis.description'
  },
  { 
    icon: 'pi pi-gift',
    title: 'home.features.giveaways.title',
    description: 'home.features.giveaways.description'
  },
  { 
    icon: 'pi pi-lock',
    title: 'home.features.lists.title',
    description: 'home.features.lists.description'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>