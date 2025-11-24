<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <main class="flex-1 px-6 py-6">
      <router-view />
    </main>

    <footer class="py-8 px-6 border-t border-gray-200">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-sm text-gray-600">
          Created by <span class="font-medium">Akmal Fauzi</span> · XOR Encryption Notes App
        </p>
        <p class="text-xs text-gray-400 mt-1">
          Tugas Kriptografi Simetris - Stream XOR
        </p>
      </div>
    </footer>

    <Toaster rich-colors position="top-right" />
  </div>
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
</script>
