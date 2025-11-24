/**
 * File ini berfungsi untuk mendefinisikan skema tabel database MySQL
 * menggunakan drizzle-orm, khususnya untuk tabel "notes" yang menyimpan data catatan terenkripsi
 */

// Import tipe dan fungsi dari drizzle-orm untuk membuat skema database MySQL
import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

// Definisi skema tabel "notes"
// Tabel ini digunakan untuk menyimpan catatan yang terenkripsi
export const notes = mysqlTable('notes', {
  // Kolom id sebagai primary key dan auto increment
  id: int('id').primaryKey().autoincrement(),
  // Kolom title untuk judul catatan, tidak boleh kosong
  title: varchar('title', { length: 255 }).notNull(),
  // Kolom contentEncrypted untuk isi catatan yang sudah dienkripsi, tidak boleh kosong
  contentEncrypted: text('content_encrypted').notNull(),
  // Kolom createdAt untuk tanggal pembuatan, default ke waktu sekarang
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  // Kolom updatedAt untuk tanggal update terakhir, default ke waktu sekarang
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Tipe data untuk hasil select dari tabel notes
export type Note = typeof notes.$inferSelect;
// Tipe data untuk insert data baru ke tabel notes
export type NewNote = typeof notes.$inferInsert;
