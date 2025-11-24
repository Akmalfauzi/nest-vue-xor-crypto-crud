<template>
  <div class="flex gap-4 items-center">
    <div class="flex-1 relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        :value="modelValue"
        type="text"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        :placeholder="placeholder"
        @input="onInput"
        @keyup.enter.prevent="$emit('search')"
      />
    </div>
    <Button variant="outline" class="border-gray-300 gap-1.5" @click="$emit('search')">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"></path>
      </svg>
      {{ buttonLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { Button } from '@/components/ui/button';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    buttonLabel?: string;
  }>(),
  {
    placeholder: 'Cari catatan...',
    buttonLabel: 'Cari',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
  (e: 'input'): void;
}>();

const { modelValue, placeholder, buttonLabel } = toRefs(props);

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  emit('input');
}
</script>
