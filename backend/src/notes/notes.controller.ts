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
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
// Import service untuk logika bisnis catatan
import { NotesService } from './note.service';

// Import DTO untuk pembuatan catatan
import { CreateNoteDto } from './dto/create-note.dto';
// Import DTO untuk update catatan
import { UpdateNoteDto } from './dto/update-note.dto';
// Import pagination DTO
import { PaginationDto } from '../common/dto/pagination.dto';
// Import response helpers
import {
  createPaginatedResponse,
  createSuccessResponse,
} from '../common/decorators/api-response.decorator';

// Controller untuk endpoint /notes
@Controller('notes')
export class NotesController {
  // Konstruktor untuk menginject NotesService
  constructor(private readonly notesService: NotesService) {}

  // Handler untuk membuat catatan baru
  @Post()
  async create(@Body() dto: CreateNoteDto) {
    try {
      const result = await this.notesService.create(dto);
      return createSuccessResponse(result, 'Note created successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Failed to create note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Handler untuk mengambil semua catatan dengan pagination (selalu pakai pagination)
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    try {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 12;
      const searchTerm = search?.trim() || undefined;

      // Selalu gunakan pagination dengan default page=1, limit=12
      const pagination = new PaginationDto(pageNum, limitNum);
      const result = await this.notesService.findAll(pagination, searchTerm);
      return createPaginatedResponse(
        result.data,
        result.meta,
        'Notes retrieved successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Handler untuk mengambil satu catatan berdasarkan id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.notesService.findOne(id);
      return createSuccessResponse(result, 'Note retrieved successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Failed to retrieve note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Handler untuk mengupdate catatan berdasarkan id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
  ) {
    try {
      const result = await this.notesService.update(id, dto);
      return createSuccessResponse(result, 'Note updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Failed to update note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Handler untuk menghapus catatan berdasarkan id
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.notesService.remove(id);
      return createSuccessResponse(null, 'Note deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Failed to delete note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
