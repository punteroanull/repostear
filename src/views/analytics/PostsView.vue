<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold mb-6">{{ $t('dashboard.posts') }}</h1>
      
      <!-- Posts Analysis -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Total Posts</h3>
          <p class="text-3xl font-bold text-primary-500">0</p>
        </div>
        
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Average Engagement</h3>
          <p class="text-3xl font-bold text-secondary-500">0%</p>
        </div>
        
        <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Best Performing Post</h3>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">No posts yet</p>
        </div>
      </div>
      
      <!-- Posts List -->
      <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Recent Posts</h2>
          <div class="flex gap-2">
            <Button icon="pi pi-filter" label="Filter" class="p-button-outlined" />
            <Button icon="pi pi-download" label="Export" class="p-button-outlined" />
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="text-center py-12">
          <i class="pi pi-inbox text-4xl text-neutral-400 mb-4"></i>
          <h3 class="text-lg font-medium mb-2">No Posts Yet</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">
            Start posting to see your content analytics here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
</script>