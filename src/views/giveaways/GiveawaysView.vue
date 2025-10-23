<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Giveaways</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Your Giveaways</h2>
        <router-link 
          :to="{ name: 'create-giveaway' }" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Giveaway
        </router-link>
      </div>
      
      <!-- Placeholder for giveaway list -->
      <div class="space-y-4">
        <p class="text-gray-600">No giveaways found. Create your first giveaway to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here as needed
</script>