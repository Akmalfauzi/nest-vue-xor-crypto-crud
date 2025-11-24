/**
 * File ini adalah module untuk fitur catatan (notes) di aplikasi NestJS
 * Module ini menggabungkan controller, service, dan database module untuk fitur notes
 */

// Import decorator Module dari NestJS
import { Module } from '@nestjs/common';

// Import service untuk logika bisnis catatan
import { NotesService } from './note.service';
// Import controller untuk endpoint catatan
import { NotesController } from './notes.controller';
// Import module database
import { DatabaseModule } from '../db/database.module';

// Deklarasi module untuk fitur notes
@Module({
  // Module yang diimport agar bisa akses database
  imports: [DatabaseModule],
  // Controller yang menangani request HTTP
  controllers: [NotesController],
  // Provider service untuk logika bisnis
  providers: [NotesService],
})
export class NotesModule {}
