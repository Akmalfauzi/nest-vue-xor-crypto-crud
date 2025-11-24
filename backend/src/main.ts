/**
 * File ini adalah entry point aplikasi NestJS
 * Bertugas untuk bootstrap dan menjalankan server backend
 * Konfigurasi CORS diatur agar frontend bisa mengakses API
 */

// Import fungsi untuk membuat aplikasi NestJS
import { NestFactory } from '@nestjs/core';
// Import module utama aplikasi
import { AppModule } from './app.module';
// Import response interceptor untuk format response standar
import { ResponseInterceptor } from './common/decorators/api-response.decorator';

// Fungsi utama untuk menjalankan aplikasi
async function bootstrap() {
  // Membuat instance aplikasi NestJS
  const app = await NestFactory.create(AppModule);
  // Mengambil origin dari environment variable FRONTEND_ORIGIN, default ke 'http://localhost:5173'
  const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  // Mengaktifkan CORS agar frontend bisa akses API
  app.enableCors({
    origin, // alamat frontend
  });
  // Menggunakan global response interceptor untuk format response standar
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Menjalankan server pada port 3000
  await app.listen(3000);
}
// Menjalankan fungsi bootstrap
void bootstrap();
