<template>
  <div class="w-full">
    <!-- Header Skeleton -->
    <div class="flex space-x-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
      <Skeleton class="w-8 h-4" />
      <Skeleton class="w-24 h-4" />
      <Skeleton class="w-32 h-4" />
      <Skeleton class="w-20 h-4" />
      <Skeleton class="w-16 h-4 ml-auto" />
    </div>

    <!-- Row Skeletons -->
    <div
      v-for="n in rows"
      :key="n"
      class="flex space-x-4 px-6 py-4 border-b border-gray-100"
      :class="n % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'"
    >
      <!-- ID Skeleton -->
      <div class="flex-shrink-0">
        <Skeleton class="w-8 h-8 rounded-full" />
      </div>

      <!-- Title Skeleton -->
      <div class="flex-1 min-w-0">
        <Skeleton class="h-5 w-32" />
      </div>

      <!-- Content Skeleton -->
      <div class="flex-1 min-w-0 max-w-xs space-y-1">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>

      <!-- Date Skeleton -->
      <div class="flex-shrink-0">
        <Skeleton class="h-4 w-20" />
      </div>

      <!-- Actions Skeleton -->
      <div class="flex-shrink-0 flex space-x-2 opacity-0">
        <Skeleton class="w-16 h-8" />
        <Skeleton class="w-16 h-8" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  rows?: number
}

withDefaults(defineProps<Props>(), {
  rows: 10
})
</script>