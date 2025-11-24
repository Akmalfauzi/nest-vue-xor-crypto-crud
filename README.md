# Aplikasi Catatan Terenkripsi XOR

Aplikasi full-stack untuk manajemen catatan dengan implementasi enkripsi simetris menggunakan algoritma XOR stream cipher. Terdiri dari backend NestJS dan frontend Vue.js dengan fokus pada keamanan data catatan.

## 🏗️ Arsitektur

### Backend (NestJS)
- **Framework**: NestJS dengan TypeScript
- **Database**: MySQL dengan Drizzle ORM
- **Enkripsi**: Implementasi custom XOR stream cipher
- **Struktur**: Arsitektur modular dengan modul terpisah untuk setiap fitur

Modul utama:
- `AppModule`: Modul root yang mengimpor semua modul lain
- `DatabaseModule`: Konfigurasi koneksi database dan ORM menggunakan Drizzle
- `NotesModule`: Operasi CRUD untuk catatan terenkripsi
- `ConfigModule`: Konfigurasi variabel lingkungan

### Frontend (Vue 3)
- **Framework**: Vue 3 dengan Composition API dan TypeScript
- **UI**: Tailwind CSS dengan komponen UI custom berbasis Reka UI
- **State Management**: Pinia untuk state reaktif
- **Routing**: Vue Router untuk navigasi
- **HTTP Client**: Axios untuk komunikasi API
- **UI Components**: Komponen custom di `src/components/ui/` (Button, Input, Card, Table, dll.)

## 🚀 Cara Setup Project

### Prasyarat
- Node.js (v22 atau lebih tinggi)
- MySQL (v5.7 atau lebih tinggi)
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/Akmalfauzi/nest-vue-xor-crypto-crud.git
cd nest-vue-xor-crypto-crud
```

### 2. Instalasi Dependencies
```bash
# Install semua dependencies dari root
npm install
```

### 3. Setup Database

#### Opsi A: Eksekusi Dump SQL
Jika tersedia file dump di `db_dump/`, jalankan melalui MySQL CLI atau GUI agar struktur tabel otomatis terbentuk.

#### Opsi B: Manual
1. Masuk ke MySQL:
   ```bash
   mysql -u root -p
   ```
2. Buat database:
   ```sql
   CREATE DATABASE xor_notes_db;
   ```
3. Pilih database:
   ```sql
   USE xor_notes_db;
   ```
4. Buat tabel dasar:
   ```sql
   CREATE TABLE notes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content_encrypted TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```
5. (Opsional) Tambahkan data contoh untuk pengujian.

### 4. Konfigurasi Environment

#### Backend (`backend/.env`)
```env
DATABASE_URL=mysql://username:password@localhost:3306/xor_notes_db
XOR_KEY=kunci-enkripsi-rahasia-anda
FRONTEND_ORIGIN=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```env
VITE_API_BASE=http://localhost:3000/api
```

**Catatan**:
- Prefix `/api` diterapkan secara global pada backend, jadi semua route otomatis tersedia di `/api/...`.
- Sesuaikan `VITE_API_BASE` dengan domain backend di masing-masing environment.
- Simpan `XOR_KEY` secara aman dan gunakan nilai yang sama di semua deployment.

### 5. Database Migration
```bash
cd backend
npm run drizzle:migrate
```

### 6. Menjalankan Aplikasi
```bash
# Dari root directory
npm run dev:backend    # Start NestJS backend di port 3000
npm run dev:frontend   # Start Vue.js frontend di port 5173
```

Atau jalankan secara terpisah:

```bash
# Backend (di direktori /backend)
cd backend
npm run start:dev      # Start dengan hot reload

# Frontend (di direktori /frontend)
cd frontend
npm run dev            # Start Vite dev server
```

## 📝 Perintah Development

### Backend Commands (di `/backend`)
```bash
# Development
npm run start:dev      # Start dengan hot reload
npm run start:debug    # Start dengan debugging

# Production
npm run build          # Build untuk production
npm run start:prod     # Start build production

# Code Quality
npm run lint           # Jalankan ESLint dengan auto-fix
npm run format         # Format kode dengan Prettier

# Testing
npm run test           # Jalankan unit tests
npm run test:watch     # Jalankan tests dalam watch mode
npm run test:cov       # Jalankan tests dengan coverage
npm run test:e2e       # Jalankan end-to-end tests

# Database
npm run drizzle:generate  # Generate database migrations
npm run drizzle:migrate   # Jalankan database migrations
```

### Frontend Commands (di `/frontend`)
```bash
# Development
npm run dev            # Start Vite dev server

# Production
npm run build          # Build untuk production (dengan TypeScript check)
npm run preview        # Preview build production
```

## 🔐 Fitur Keamanan

### Enkripsi XOR
- Implementasi custom XOR stream cipher di `backend/src/crypto/xor-stream.ts`
- Menggunakan kunci yang dapat dikonfigurasi via `XOR_KEY` environment variable
- Mengkonversi data terenkripsi ke string hex untuk penyimpanan database
- Dekripsi otomatis saat mengambil catatan

### Schema Database
- Menggunakan Drizzle ORM dengan MySQL
- Schema didefinisikan di `backend/src/db/schema.ts`
- Koneksi database dikonfigurasi di `backend/src/db/db.ts`

## 🌐 API Endpoints

Semua endpoint berada di bawah prefix `/api`.

- **GET /api/notes** - Mengambil semua catatan (mendukung pagination & pencarian)
- **POST /api/notes** - Membuat catatan baru
- **GET /api/notes/:id** - Mengambil catatan spesifik
- **PUT /api/notes/:id** - Mengupdate catatan
- **DELETE /api/notes/:id** - Menghapus catatan

Semua data catatan secara otomatis dienkripsi sebelum disimpan ke database dan didekripsi saat diambil.

## 💻 Fitur Frontend

- Single-page application dengan Vue Router
- Interface manajemen catatan dengan tabel dan form
- Toast notifications menggunakan vue-sonner
- Responsive design dengan Tailwind CSS
- Library komponen dengan styling konsisten

## 🛠️ Struktur Project

```
nest-vue-xor-crypto-crud/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── crypto/
│   │   │   └── xor-stream.ts
│   │   ├── db/
│   │   │   ├── db.ts
│   │   │   └── schema.ts
│   │   ├── modules/
│   │   │   ├── notes/
│   │   │   └── database/
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   └── main.ts
│   ├── public/
│   └── package.json
├── README.md
└── package.json
```

## 🔥 Cara Penggunaan

1. Buka browser dan navigasi ke `http://localhost:5173`
2. Buat catatan baru melalui form yang tersedia
3. Data akan otomatis dienkripsi sebelum disimpan
4. Lihat daftar catatan yang sudah didekripsi
5. Edit atau hapus catatan sesuai kebutuhan

## 📌 Catatan Penting

- Backend berjalan di port 3000, frontend di port 5173
- CORS sudah dikonfigurasi untuk komunikasi frontend-backend (sesuaikan `FRONTEND_ORIGIN`)
- Prefix API `/api` wajib disertakan di semua request (atur melalui `VITE_API_BASE`)
- Semua konten catatan otomatis dienkripsi sebelum penyimpanan database
- Kunci XOR harus disimpan dengan aman dan konsisten di semua deployment
- Database migrations dikelola melalui Drizzle Kit
