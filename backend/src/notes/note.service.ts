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
// Import pagination DTO
import { PaginationDto } from '../common/dto/pagination.dto';
// Import drizzle ORM functions
import { count } from 'drizzle-orm';

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

  // Mengambil semua catatan dari database dengan pagination
  // Mengembalikan array catatan yang sudah didekripsi
  async findAll(pagination: PaginationDto, search?: string) {
    const searchTerm = search?.trim();

    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      const allRows = await this.db
        .select()
        .from(notes)
        .orderBy(notes.createdAt);

      const filteredRows = allRows
        .map((row) => {
          const decryptedContent = xorDecrypt(row.contentEncrypted);
          return {
            row,
            decryptedContent,
          };
        })
        .filter(({ row, decryptedContent }) => {
          const titleMatch = row.title.toLowerCase().includes(normalizedSearch);
          const contentMatch = decryptedContent
            .toLowerCase()
            .includes(normalizedSearch);
          return titleMatch || contentMatch;
        });

      const total = filteredRows.length;
      const start = pagination.offset;
      const end = start + pagination.limit;
      const paginated = filteredRows.slice(start, end);

      const data = paginated.map(({ row, decryptedContent }) =>
        this.toResponse(row, decryptedContent),
      );

      const totalPages = total > 0 ? Math.ceil(total / pagination.limit) : 0;

      return {
        data,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    }

    // Hitung total data
    const [{ total }] = await this.db.select({ total: count() }).from(notes);

    // Ambil data dengan pagination
    const rows = await this.db
      .select()
      .from(notes)
      .orderBy(notes.createdAt)
      .limit(pagination.limit)
      .offset(pagination.offset); // Urutkan berdasarkan createdAt terbaru

    const data = rows.map((row) => this.toResponse(row));

    // Return dengan format pagination
    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
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
  private toResponse(
    row: typeof notes.$inferSelect,
    decryptedContent?: string,
  ) {
    return {
      id: row.id,
      title: row.title,
      content: decryptedContent ?? xorDecrypt(row.contentEncrypted),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
