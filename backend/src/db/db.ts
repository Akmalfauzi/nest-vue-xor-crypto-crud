/**
 * File ini berfungsi untuk mengatur koneksi dan konfigurasi database MySQL
 * serta membuat instance ORM Drizzle yang digunakan di seluruh aplikasi
 */

// Mengimpor konfigurasi environment dari file .env
import 'dotenv/config';
// Mengimpor library mysql2 untuk koneksi database MySQL
import mysql from 'mysql2/promise';
// Mengimpor fungsi drizzle untuk ORM
import { drizzle } from 'drizzle-orm/mysql2';
// Mengimpor skema database dari file schema.ts
import * as schema from './schema';

// Membuat pool koneksi ke database MySQL hanya menggunakan DATABASE_URL dari environment
const pool = mysql.createPool(process.env.DATABASE_URL!);

// Mode konfigurasi untuk drizzle ORM
const mode = 'default';

// Membuat instance ORM drizzle dengan pool dan skema
export const db = drizzle(pool, { schema, mode });
// Tipe untuk instance database
export type Db = typeof db;
