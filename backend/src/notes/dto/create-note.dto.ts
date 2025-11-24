/**
 * File ini berisi DTO (Data Transfer Object) untuk membuat catatan baru
 * Digunakan untuk validasi data input pada endpoint pembuatan catatan
 */

// Mengimpor decorator validasi dari class-validator
import { IsNotEmpty, IsString } from 'class-validator';

// Kelas DTO untuk data pembuatan catatan baru
export class CreateNoteDto {
  // Validasi agar title bertipe string dan tidak boleh kosong
  @IsString()
  @IsNotEmpty()
  title: string;

  // Validasi agar content bertipe string dan tidak boleh kosong
  @IsString()
  @IsNotEmpty()
  content: string;
}
