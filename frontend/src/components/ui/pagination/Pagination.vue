<script setup lang="ts">
import { computed } from 'vue';
import type { PaginationMeta } from '@/stores/notes';

const props = defineProps<{
  meta: PaginationMeta;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const currentPage = computed(() => props.meta?.page ?? 1);
const totalPages = computed(() => Math.max(props.meta?.totalPages ?? 1, 1));

const startItem = computed(() => {
  const limit = props.meta?.limit ?? 0;
  if (!limit) return 0;
  return (currentPage.value - 1) * limit + 1;
});

const endItem = computed(() => {
  const limit = props.meta?.limit ?? 0;
  if (!limit) return 0;
  return Math.min(props.meta.total, currentPage.value * limit);
});

const pagesToShow = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }

  let start = Math.max(current - 2, 1);
  let end = Math.min(start + 4, total);

  if (end - start < 4) {
    start = Math.max(end - 4, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
});

function goToPage(page: number) {
  if (page === currentPage.value || page < 1 || page > totalPages.value) return;
  emit('page-change', page);
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
    <div class="text-sm text-gray-600">
      Menampilkan
      <span class="font-medium text-gray-900">{{ startItem }}</span>
      -
      <span class="font-medium text-gray-900">{{ endItem }}</span>
      dari
      <span class="font-medium text-gray-900">{{ props.meta.total }}</span>
      catatan
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.meta.hasPrev"
        @click="goToPage(currentPage - 1)"
      >
        Prev
      </button>

      <button
        v-for="page in pagesToShow"
        :key="page"
        type="button"
        class="rounded-md border px-3 py-1 text-sm transition"
        :class="[
          page === currentPage
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50',
        ]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!props.meta.hasNext"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
