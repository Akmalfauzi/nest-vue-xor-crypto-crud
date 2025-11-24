<template>
  <div
    class="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer relative"
    @click="$emit('view', note)"
  >
    <div class="absolute top-4 left-4 z-10">
      <div class="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
        {{ index + 1 }}
      </div>
    </div>

    <div class="absolute top-4 right-4 z-10 flex space-x-2">
      <button
        @click.stop="$emit('edit', note)"
        class="size-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-primary text-xs shadow-sm transition"
        title="Edit catatan"
      >
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            @click.stop
            class="size-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-600 text-xs shadow-sm transition"
            title="Hapus catatan"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Catatan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="$emit('delete', note.id)">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <div class="p-4 pt-12">
      <div class="mb-3">
        <h3 class="font-semibold text-gray-900 text-lg mb-1 pr-20">{{ note.title }}</h3>
        <p class="text-xs text-gray-500">{{ formattedDate }}</p>
      </div>

      <div class="text-gray-600 text-sm line-clamp-3 mb-3">
        {{ note.content }}
      </div>

      <div class="flex justify-between items-center pt-3 border-t border-gray-100">
        <div class="flex items-center space-x-2 text-xs text-gray-400">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
          <span>Terenkripsi</span>
        </div>
        <div class="text-xs text-gray-400">
          {{ note.content.length }} karakter
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { Note } from '@/stores/notes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const props = defineProps<{
  note: Note;
  index: number;
}>();

defineEmits<{
  (e: 'view', note: Note): void;
  (e: 'edit', note: Note): void;
  (e: 'delete', id: number): void;
}>();

const { note, index } = toRefs(props);

const formattedDate = computed(() => {
  if (!note.value?.createdAt) return '-';
  return new Date(note.value.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});
</script>
