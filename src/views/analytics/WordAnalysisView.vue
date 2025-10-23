<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold mb-6">{{ $t('dashboard.wordAnalysis') }}</h1>
      
      <!-- Analysis Controls -->
      <div class="flex flex-wrap gap-4 mb-8">
        <Dropdown
          v-model="timeRange"
          :options="timeRangeOptions"
          optionLabel="label"
          placeholder="Select Time Range"
          class="w-48"
        />
        
        <Dropdown
          v-model="contentType"
          :options="contentTypeOptions"
          optionLabel="label"
          placeholder="Select Content Type"
          class="w-48"
        />
        
        <Button 
          icon="pi pi-refresh" 
          label="Update Analysis" 
          class="ml-auto"
          :loading="loading"
        />
      </div>
      
      <!-- Word Cloud -->
      <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Word Cloud</h2>
        <div class="h-64 flex items-center justify-center">
          <p class="text-neutral-500">No data available for word cloud visualization</p>
        </div>
      </div>
      
      <!-- Top Words Table -->
      <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Most Used Words</h2>
        <div class="text-center py-12">
          <i class="pi pi-file-edit text-4xl text-neutral-400 mb-4"></i>
          <h3 class="text-lg font-medium mb-2">No Words to Analyze</h3>
          <p class="text-neutral-600 dark:text-neutral-400">
            Start posting content to see word analysis and trends.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const loading = ref(false)

const timeRange = ref(null)
const timeRangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' }
]

const contentType = ref(null)
const contentTypeOptions = [
  { label: 'All content', value: 'all' },
  { label: 'Posts only', value: 'posts' },
  { label: 'Comments only', value: 'comments' },
  { label: 'Replies only', value: 'replies' }
]
</script>