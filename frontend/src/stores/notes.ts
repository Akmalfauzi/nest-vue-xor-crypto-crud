import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  timestamp: string;
}

interface NotesState {
  items: Note[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}

export const useNotesStore = defineStore('notes', {
  state: (): NotesState => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    currentPage: 1,
    pageSize: 12,
    searchQuery: '',
  }),

  actions: {
    async fetchNotes(page: number = 1, limit?: number, search?: string) {
      this.loading = true;
      this.error = null;
      const resolvedLimit = limit ?? this.pageSize ?? 12;
      const normalizedSearch = typeof search === 'string' ? search.trim() : this.searchQuery;
      this.searchQuery = normalizedSearch ?? '';
      try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', resolvedLimit.toString());
        if (this.searchQuery) {
          params.append('search', this.searchQuery);
        }

        const url = `${API_BASE}/notes?${params.toString()}`;

        const res = await axios.get<ApiResponse>(url);
        const response = res.data;

        if (response.success) {
          if (response.meta) {
            // Paginated response
            this.items = response.data as Note[];
            this.pagination = response.meta;
            this.currentPage = page;
            this.pageSize = resolvedLimit;
          } else {
            // Fallback for non-paginated response
            this.items = response.data as Note[];
            this.pagination = null;
          }
        } else {
          throw new Error(response.message || 'Failed to fetch notes');
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch notes';
        console.error('Fetch notes error:', err);
      } finally {
        this.loading = false;
      }
    },

    async createNote(payload: { title: string; content: string }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post<ApiResponse<Note>>(`${API_BASE}/notes`, payload);
        const response = res.data;

        if (response.success && response.data) {
          // Add new note to the beginning of the array
          this.items.unshift(response.data);

          // Refresh current page to get updated data
          await this.fetchNotes(this.currentPage, this.pageSize);
        } else {
          throw new Error(response.message || 'Failed to create note');
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to create note';
        console.error('Create note error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateNote(id: number, payload: { title: string; content: string }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.put<ApiResponse<Note>>(`${API_BASE}/notes/${id}`, payload);
        const response = res.data;

        if (response.success && response.data) {
          // Replace item in the array
          const idx = this.items.findIndex((n) => n.id === id);
          if (idx !== -1) {
            this.items[idx] = response.data;
          }

          // Refresh current page to get updated data
          await this.fetchNotes(this.currentPage, this.pageSize);
        } else {
          throw new Error(response.message || 'Failed to update note');
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to update note';
        console.error('Update note error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteNote(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.delete<ApiResponse>(`${API_BASE}/notes/${id}`);
        const response = res.data;

        if (response.success) {
          // Remove item from the array
          this.items = this.items.filter((n) => n.id !== id);

          // Refresh current page to get updated data
          await this.fetchNotes(this.currentPage, this.pageSize);
        } else {
          throw new Error(response.message || 'Failed to delete note');
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to delete note';
        console.error('Delete note error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
