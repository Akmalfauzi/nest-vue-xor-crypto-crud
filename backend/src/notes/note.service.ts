/**
 * File ini adalah service utama untuk fitur catatan (notes) di aplikasi NestJS.
 * Berisi logika bisnis CRUD (Create, Read, Update, Delete) dan proses enkripsi/dekripsi konten catatan.
 * Semua operasi database dan transformasi data catatan dilakukan di sini.
 */

// Import decorator dan exception dari NestJS
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// Import fungsi eq untuk query dari drizzle-orm
import { eq } from 'drizzle-orm';
// Import tipe database dari file db
import type { Db } from '../db/db';
// Import skema tabel notes
import { notes } from '../db/schema';
// Import DTO untuk pembuatan catatan
import { CreateNoteDto } from './dto/create-note.dto';
// Import DTO untuk update catatan
import { UpdateNoteDto } from './dto/update-note.dto';
// Import fungsi enkripsi dan dekripsi XOR
import { xorEncrypt, xorDecrypt } from '../crypto/xor-stream';

// Service untuk mengelola catatan
@Injectable()
export class NotesService {
  // Konstruktor untuk menginject instance database
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: Db,
  ) {}

  // Membuat catatan baru dengan konten terenkripsi
  // Menyimpan judul dan konten yang sudah dienkripsi ke database
  async create(dto: CreateNoteDto) {
    // Insert data ke tabel notes
    await this.db.insert(notes).values({
      title: dto.title,
      contentEncrypted: xorEncrypt(dto.content),
    });

    // Ambil data terakhir yang baru saja diinsert (berdasarkan title dan contentEncrypted)
    const [inserted] = await this.db
      .select()
      .from(notes)
      .where(eq(notes.title, dto.title))
      .orderBy(notes.id)
      .limit(1);

    return this.toResponse(inserted);
  }

  // Mengambil semua catatan dari database
  // Mengembalikan array catatan yang sudah didekripsi
  async findAll() {
    const rows = await this.db.select().from(notes);
    return rows.map((row) => this.toResponse(row));
  }

  // Mengambil satu catatan berdasarkan id
  // Jika tidak ditemukan, melempar error NotFoundException
  async findOne(id: number) {
    const [row] = await this.db
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundException('Note not found');
    }

    return this.toResponse(row);
  }

  // Mengupdate data catatan berdasarkan id
  // Jika ada title atau content baru, akan diupdate dan content dienkripsi
  async update(id: number, dto: UpdateNoteDto) {
    const [existing] = await this.db
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Note not found');

    // Jika ada title baru, gunakan, jika tidak pakai yang lama
    const newTitle = dto.title ?? existing.title;
    // Jika ada content baru, enkripsi, jika tidak pakai yang lama
    const newContentEncrypted =
      dto.content !== undefined
        ? xorEncrypt(dto.content)
        : existing.contentEncrypted;

    // Update data catatan
    await this.db
      .update(notes)
      .set({
        title: newTitle,
        contentEncrypted: newContentEncrypted,
      })
      .where(eq(notes.id, id));

    // Ambil data yang sudah diupdate
    const [updated] = await this.db
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);

    return this.toResponse(updated);
  }

  // Menghapus catatan berdasarkan id
  // Jika catatan tidak ditemukan, melempar error NotFoundException
  async remove(id: number) {
    const [existing] = await this.db
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Note not found');

    await this.db.delete(notes).where(eq(notes.id, id));

    return { message: 'Deleted' };
  }

  // Mengubah data dari database menjadi response yang bisa dikirim ke client
  // Konten catatan akan didekripsi sebelum dikirim ke client
  private toResponse(row: typeof notes.$inferSelect) {
    return {
      id: row.id,
      title: row.title,
      content: xorDecrypt(row.contentEncrypted),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
