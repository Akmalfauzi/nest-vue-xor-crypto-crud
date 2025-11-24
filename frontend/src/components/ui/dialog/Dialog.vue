<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

    <!-- Modal -->
    <div class="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-xl border border-gray-200">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          :disabled="isLoading"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <slot name="footer">
          <Button
            variant="outline"
            @click="closeModal"
            :disabled="isLoading"
          >
            Batal
          </Button>
          <Button
            @click="$emit('submit')"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </span>
            <span v-else>{{ submitText }}</span>
          </Button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '../button/Button.vue'

interface Props {
  isOpen: boolean
  title: string
  submitText?: string
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  submitText: 'Simpan',
  isLoading: false,
})

const emit = defineEmits<{
  close: []
  submit: []
}>()

const closeModal = () => {
  emit('close')
}
</script>