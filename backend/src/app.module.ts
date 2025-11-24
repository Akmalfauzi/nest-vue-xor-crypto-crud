/**
 * File ini adalah module utama aplikasi NestJS
 * Menggabungkan semua module fitur seperti konfigurasi, database, dan catatan (notes)
 * Semua module yang dibutuhkan aplikasi diimport dan didaftarkan di sini
 */

// Import decorator Module dari NestJS
import { Module } from '@nestjs/common';
// Import module untuk konfigurasi environment
import { ConfigModule } from '@nestjs/config';
// Import module database
import { DatabaseModule } from './db/database.module';
// Import module fitur catatan
import { NotesModule } from './notes/note.module';

// Deklarasi module utama aplikasi
@Module({
  // Daftar module yang diimport ke aplikasi
  imports: [
    // Module konfigurasi environment agar bisa akses .env
    ConfigModule.forRoot({ isGlobal: true }),
    // Module database untuk koneksi dan ORM
    DatabaseModule,
    // Module fitur catatan
    NotesModule,
  ],
})
export class AppModule {}
