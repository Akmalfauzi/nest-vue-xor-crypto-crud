<template>
  <div class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
        Judul Catatan
      </label>
      <Input
        id="title"
        v-model="formData.title"
        placeholder="Masukkan judul catatan"
        maxlength="255"
        :disabled="isLoading"
      />
      <p class="mt-1 text-xs text-gray-400">
        Maksimal 255 karakter
      </p>
    </div>

    <div>
      <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
        Isi Catatan
      </label>
      <Textarea
        id="content"
        v-model="formData.content"
        placeholder="Masukkan isi catatan"
        rows="6"
        :disabled="isLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import Input from './ui/input/Input.vue'
import Textarea from './ui/textarea/Textarea.vue'

interface Note {
  id?: number
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

interface Props {
  note?: Note | null
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  note: null,
  isLoading: false,
})

const emit = defineEmits<{
  'update:formData': [data: { title: string; content: string }]
}>()

const formData = reactive({
  title: '',
  content: '',
})

// Watch for note changes to update form data
watch(
  () => props.note,
  (newNote) => {
    if (newNote) {
      formData.title = newNote.title
      formData.content = newNote.content
    } else {
      formData.title = ''
      formData.content = ''
    }
  },
  { immediate: true }
)

// Watch for form data changes
watch(
  formData,
  (newFormData) => {
    emit('update:formData', { ...newFormData })
  },
  { deep: true }
)

// Expose form data for parent component
defineExpose({
  formData,
  reset: () => {
    formData.title = ''
    formData.content = ''
  },
})
</script>
