<template>
  <Dialog
    :is-open="isOpen"
    title="Detail Catatan"
    @close="closeModal"
  >
    <div v-if="note" class="space-y-4 max-h-96 overflow-y-auto">
      <!-- Note Header -->
      <div class="border-b border-gray-200 pb-4">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ note.title }}</h3>
        <div class="flex items-center text-sm text-gray-500">
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {{ formatDate(note.updatedAt || note.createdAt) }}
        </div>
      </div>

      <!-- Note Content -->
      <div class="max-h-96 overflow-y-auto">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {{ note.content }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        class="ml-auto"
        variant="outline"
        @click="closeModal"
      >
        Tutup
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/ui/dialog/Dialog.vue'
import { Button } from '@/components/ui/button'
import type { Note } from '@/stores/notes'

interface Props {
  isOpen: boolean
  note?: Note | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()


function closeModal() {
  emit('close')
}


function formatDate(dateString?: string) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
