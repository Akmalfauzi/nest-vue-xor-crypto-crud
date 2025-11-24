<template>
  <div class="p-6">
    <!-- Header dengan tombol tambah -->
    <div class="mb-6 space-y-6">
      <NotesHeader
        title="Catatan Saya"
        description="Kelola dan atur catatan Anda dengan enkripsi XOR"
        button-label="+ Tambah Catatan"
        @add="openCreateModal"
      />

      <!-- Search and Filter -->
      <NotesSearchBar
        v-model="searchTerm"
        @input="handleSearchInput"
        @search="performSearch"
      />
    </div>

    <!-- Notes Grid -->
    <div class="flex-1">
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat catatan...</p>
        </div>
      </div>

      <div
        v-else-if="showEmptyState"
        class="flex-1 flex items-center justify-center"
      >
        <NotesEmptyState />
      </div>

      <!-- Notes Grid Layout -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <NoteCard
          v-for="(note, index) in items"
          :key="note.id"
          :note="note"
          :index="index"
          @view="viewNoteDetail"
          @edit="editNote"
          @delete="deleteNote"
        />
      </div>

      <!-- Pagination -->
      <div v-if="pagination" class="mt-6">
        <Pagination
          :meta="pagination"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Modal untuk tambah/edit catatan -->
    <Dialog
      :is-open="isModalOpen"
      :title="modalTitle"
      :submit-text="submitText"
      :is-loading="isSubmitting"
      @close="closeModal"
      @submit="handleSubmit"
    >
      <NoteForm
        :note="currentNote"
        :is-loading="isSubmitting"
        @update:formData="handleFormDataUpdate"
      />
    </Dialog>

    <!-- Modal untuk detail catatan -->
    <NoteDetailModal
      :is-open="isDetailModalOpen"
      :note="selectedNote"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotesStore, type Note } from '@/stores/notes';

import { toast } from 'vue-sonner';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import NoteForm from '@/components/NoteForm.vue';
import NoteDetailModal from '@/components/NoteDetailModal.vue';
import Pagination from '@/components/ui/pagination/Pagination.vue';
import NotesHeader from '@/components/notes/NotesHeader.vue';
import NotesSearchBar from '@/components/notes/NotesSearchBar.vue';
import NotesEmptyState from '@/components/notes/NotesEmptyState.vue';
import NoteCard from '@/components/notes/NoteCard.vue';

const notesStore = useNotesStore();
const { items, pagination, loading } = storeToRefs(notesStore);
const searchTerm = ref(notesStore.searchQuery ?? '');
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

// Modal state
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const currentNote = ref<Note | null>(null);
// Detail modal state
const isDetailModalOpen = ref(false);
const selectedNote = ref<Note | null>(null);

// Form data state
const MAX_TITLE_LENGTH = 255;
const defaultFormData = () => ({
  title: '',
  content: '',
});

const formData = ref(defaultFormData());

// Computed properties
const modalTitle = computed(() => {
  return currentNote.value ? 'Edit Catatan' : 'Tambah Catatan Baru';
});

const submitText = computed(() => {
  return currentNote.value ? 'Perbarui' : 'Simpan';
});

const isLoading = computed(() => loading.value);
const hasNotes = computed(() => items.value.length > 0);
const showEmptyState = computed(() => !isLoading.value && !hasNotes.value);

function resetForm() {
  formData.value = defaultFormData();
}

function clearSearchTimeout() {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
    searchDebounce = null;
  }
}

// Modal functions
function openCreateModal() {
  currentNote.value = null;
  resetForm();
  isModalOpen.value = true;
}

function openEditModal(note: Note) {
  currentNote.value = note;
  formData.value = {
    title: note.title,
    content: note.content,
  };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentNote.value = null;
  resetForm();
}

// Form handlers
function handleFormDataUpdate(data: { title: string; content: string }) {
  formData.value = data;
}

async function handleSubmit() {
  if (!formData.value.title || !formData.value.content) {
    toast.error('Judul dan isi catatan wajib diisi.');
    return;
  }
  if (formData.value.title.length > MAX_TITLE_LENGTH) {
    toast.error(`Judul maksimal ${MAX_TITLE_LENGTH} karakter.`);
    return;
  }

  isSubmitting.value = true;

  try {
    if (currentNote.value) {
      await notesStore.updateNote(currentNote.value.id, {
        title: formData.value.title,
        content: formData.value.content,
      });
      toast.success('Catatan berhasil diperbarui!');
    } else {
      await notesStore.createNote({
        title: formData.value.title,
        content: formData.value.content,
      });
      toast.success('Catatan berhasil disimpan!');
    }

    closeModal();
  } catch (error) {
    toast.error(
      currentNote.value
        ? 'Gagal memperbarui catatan.'
        : 'Gagal menyimpan catatan.'
    );
  } finally {
    isSubmitting.value = false;
  }
}

// Table actions
function editNote(note: Note) {
  openEditModal(note);
}

function viewNoteDetail(note: Note) {
  selectedNote.value = note;
  isDetailModalOpen.value = true;
}

function closeDetailModal() {
  isDetailModalOpen.value = false;
  selectedNote.value = null;
}

async function deleteNote(id: number) {
  try {
    await notesStore.deleteNote(id);
    toast.success('Catatan berhasil dihapus!');
  } catch (error) {
    toast.error('Gagal menghapus catatan.');
  }
}

// Pagination & search handlers
function handlePageChange(page: number) {
  performSearch(page);
}

function handleSearchInput() {
  clearSearchTimeout();
  searchDebounce = setTimeout(() => {
    performSearch();
  }, 400);
}

function performSearch(page: number = 1) {
  clearSearchTimeout();
  const query = searchTerm.value.trim();
  searchTerm.value = query;
  notesStore.fetchNotes(page, notesStore.pageSize, query);
}

// Initialize
onMounted(() => {
  searchTerm.value = notesStore.searchQuery;
  performSearch(1);
});

onBeforeUnmount(() => {
  clearSearchTimeout();
});
</script>
