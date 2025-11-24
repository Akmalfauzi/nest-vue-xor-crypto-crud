/**
 * File ini berfungsi untuk mendefinisikan module database di NestJS
 * Module ini menyediakan instance database (Drizzle ORM) agar bisa digunakan di seluruh aplikasi
 */

// Mengimpor decorator Module dari NestJS
import { Module } from '@nestjs/common';
// Mengimpor instance database dari file db.ts
import { db } from './db';

@Module({
  // Provider untuk menginject instance database ke dalam aplikasi
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useValue: db,
    },
  ],
  // Mengekspor provider agar bisa digunakan di module lain
  exports: ['DRIZZLE_DB'],
})
// Deklarasi DatabaseModule agar bisa diimport di module lain
export class DatabaseModule {}
