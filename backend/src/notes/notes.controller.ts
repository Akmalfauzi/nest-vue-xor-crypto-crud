/**
 * File ini adalah controller untuk endpoint catatan (notes) di aplikasi NestJS
 * Berisi handler HTTP untuk operasi CRUD (Create, Read, Update, Delete) catatan
 * Semua request ke /notes akan diproses di sini dan diteruskan ke NotesService
 */

// Import decorator dan tipe dari NestJS untuk membuat controller dan routing
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
// Import service untuk logika bisnis catatan
import { NotesService } from './note.service';

// Import DTO untuk pembuatan catatan
import { CreateNoteDto } from './dto/create-note.dto';
// Import DTO untuk update catatan
import { UpdateNoteDto } from './dto/update-note.dto';

// Controller untuk endpoint /notes
@Controller('notes')
export class NotesController {
  // Konstruktor untuk menginject NotesService
  constructor(private readonly notesService: NotesService) {}

  // Handler untuk membuat catatan baru
  @Post()
  create(@Body() dto: CreateNoteDto) {
    return this.notesService.create(dto);
  }

  // Handler untuk mengambil semua catatan
  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  // Handler untuk mengambil satu catatan berdasarkan id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  // Handler untuk mengupdate catatan berdasarkan id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(+id, dto);
  }

  // Handler untuk menghapus catatan berdasarkan id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
