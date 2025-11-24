/**
 * File ini adalah konfigurasi utama untuk drizzle-kit.
 *
 * Digunakan untuk generate migration dan mengatur koneksi ke database MySQL.
 * Semua pengaturan database diambil dari environment variable (.env), khususnya DATABASE_URL.
 *
 * dialect: 'mysql' digunakan untuk koneksi MySQL.
 * dbCredentials.url: berisi connection string MySQL dari environment variable DATABASE_URL.
 */

// Import fungsi defineConfig dari drizzle-kit
import { defineConfig } from 'drizzle-kit';

// Export konfigurasi utama drizzle-kit
export default defineConfig({
  // Path ke file skema database
  schema: './src/db/schema.ts',
  // Folder output untuk file migration
  out: './drizzle',
  // Dialect yang digunakan untuk koneksi database MySQL
  dialect: 'mysql',
  // Kredensial database: connection string diambil dari environment variable DATABASE_URL
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Connection string MySQL
  },
});
