/**
 * File ini berisi DTO (Data Transfer Object) untuk mengupdate catatan
 * Menggunakan PartialType agar semua field pada CreateNoteDto menjadi opsional
 */

// Mengimpor PartialType dari NestJS untuk membuat DTO turunan
import { PartialType } from '@nestjs/mapped-types';
// Mengimpor DTO pembuatan catatan
import { CreateNoteDto } from './create-note.dto';

// Kelas DTO untuk data update catatan, semua field opsional
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
