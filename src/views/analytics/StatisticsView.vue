<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold mb-6">{{ $t('dashboard.statistics') }}</h1>
      
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Total Followers</h3>
          <p class="text-3xl font-bold text-primary-500">0</p>
          <p class="text-sm text-success-500">+0% this week</p>
        </div>
        
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Engagement Rate</h3>
          <p class="text-3xl font-bold text-secondary-500">0%</p>
          <p class="text-sm text-neutral-500">Average last 30 days</p>
        </div>
        
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Post Frequency</h3>
          <p class="text-3xl font-bold text-accent-500">0</p>
          <p class="text-sm text-neutral-500">Posts per week</p>
        </div>
        
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Reach</h3>
          <p class="text-3xl font-bold text-success-500">0</p>
          <p class="text-sm text-neutral-500">Average per post</p>
        </div>
      </div>
      
      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Follower Growth</h3>
          <div class="h-64 flex items-center justify-center">
            <p class="text-neutral-500">No data available</p>
          </div>
        </div>
        
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Engagement Overview</h3>
          <div class="h-64 flex items-center justify-center">
            <p class="text-neutral-500">No data available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added as needed
</script>