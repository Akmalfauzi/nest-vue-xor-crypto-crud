/**
 * File ini adalah konfigurasi utama untuk Vite pada project frontend Vue
 * Berisi pengaturan plugin, alias path, dan integrasi TailwindCSS
 */

// Import modul path bawaan Node.js untuk mengatur alias
import path from 'node:path'
// Import fungsi defineConfig dari Vite
import { defineConfig } from 'vite'
// Import plugin TailwindCSS untuk Vite
import tailwindcss from '@tailwindcss/vite'
// Import plugin Vue untuk Vite
import vue from '@vitejs/plugin-vue'

// Export konfigurasi utama Vite
export default defineConfig({
  // Daftar plugin yang digunakan (Vue & TailwindCSS)
  plugins: [vue(), tailwindcss()],
  // Pengaturan alias path agar '@' mengarah ke folder src
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
