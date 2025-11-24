<template>
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
      <p class="text-gray-500 text-sm mt-1">
        {{ description }}
      </p>
    </div>
    <Button class="px-4" @click="$emit('add')">
      {{ buttonLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  title: string;
  description: string;
  buttonLabel: string;
}>();

defineEmits<{
  (e: 'add'): void;
}>();

const { title, description, buttonLabel } = toRefs(props);
</script>
