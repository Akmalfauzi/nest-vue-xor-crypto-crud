// Import library 'dotenv' untuk membaca variabel environment (.env)
import 'dotenv/config';
// Import object 'db' yang sudah kamu konfigurasi di Drizzle
import { db } from './db';
// Import skema tabel 'notes' yang sudah didefinisikan
import { notes } from './schema';

/**
 * Fungsi Helper untuk Enkripsi XOR
 * Ini diperlukan agar data dummy bisa dibaca/didekripsi oleh aplikasi nanti.
 */
function encryptContent(text: string): string {
  // Mengambil kunci dari environment variable, atau default jika tidak ada
  const key = process.env.XOR_KEY || 'default-secret-key';
  // Variabel penampung hasil
  let result = '';

  // Looping setiap karakter dalam teks
  for (let i = 0; i < text.length; i++) {
    // Operasi XOR: karakter teks ^ karakter kunci
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    // Gabungkan hasil karakter yang sudah di-XOR
    result += String.fromCharCode(charCode);
  }

  // Konversi hasil string aneh tadi ke Hexadecimal agar aman disimpan di DB
  return Buffer.from(result, 'binary').toString('hex');
}

// Fungsi utama untuk menjalankan seeding
async function main() {
  // Menampilkan pesan log bahwa proses dimulai
  console.log('🌱 Memulai proses seeding data...');

  // Mendefinisikan array berisi 20 data mentah (Plaintext)
  const rawData = [
    {
      title: 'Definisi Class',
      content:
        'Class adalah blueprint atau cetakan untuk menciptakan objek (instance).',
    },
    {
      title: 'Definisi Object',
      content:
        'Object adalah hasil instansiasi dari class yang memiliki state dan behavior nyata.',
    },
    {
      title: 'Konsep Enkapsulasi',
      content:
        'Membungkus data (private) dan method menjadi satu unit, akses pakai getter/setter.',
    },
    {
      title: 'Inheritance (Pewarisan)',
      content:
        'Mewariskan atribut dan method dari Parent Class ke Child Class pakai keyword extends.',
    },
    {
      title: 'Polimorfisme',
      content:
        'Kemampuan objek untuk memiliki banyak bentuk, contohnya overriding dan overloading.',
    },
    {
      title: 'Method Overloading',
      content:
        'Membuat beberapa method dengan nama sama tapi beda parameter dalam satu class.',
    },
    {
      title: 'Method Overriding',
      content:
        'Menimpa ulang method milik parent class di child class agar perilakunya spesifik.',
    },
    {
      title: 'Constructor',
      content:
        'Method khusus yang otomatis dijalankan saat objek pertama kali dibuat (new).',
    },
    {
      title: 'Access Modifier Private',
      content:
        'Hanya bisa diakses di dalam class itu sendiri, tidak bisa dari luar.',
    },
    {
      title: 'Access Modifier Protected',
      content:
        'Bisa diakses oleh class itu sendiri dan class turunannya (subclass).',
    },
    {
      title: 'Keyword Super',
      content:
        'Digunakan untuk memanggil constructor atau method milik parent class.',
    },
    {
      title: 'Keyword This',
      content: 'Merujuk pada instance objek yang sedang aktif saat ini.',
    },
    {
      title: 'Abstract Class',
      content:
        'Class setengah jadi yang tidak bisa diinstansiasi, harus diturunkan dulu.',
    },
    {
      title: 'Interface',
      content:
        'Kontrak yang berisi method kosong, class yang implement wajib isi semua methodnya.',
    },
    {
      title: 'Static Keyword',
      content:
        'Milik class bukan milik objek. Bisa dipanggil tanpa bikin object baru.',
    },
    {
      title: 'Final Keyword',
      content:
        'Membuat variabel jadi konstanta atau mencegah class untuk diwariskan.',
    },
    {
      title: 'UML Class Diagram',
      content:
        'Diagram visual buat gambarin struktur class dan relasi antar class.',
    },
    {
      title: 'Relasi Aggregation',
      content:
        'Hubungan "has-a" yang lemah, kalau container hancur, part-nya masih bisa hidup.',
    },
    {
      title: 'Relasi Composition',
      content:
        'Hubungan "has-a" yang kuat, kalau container hancur, part-nya ikut hancur.',
    },
    {
      title: 'Prinsip SOLID',
      content:
        'Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion.',
    },
  ];

  // Memetakan data mentah menjadi data siap simpan (dengan enkripsi)
  const dataToInsert = rawData.map((note) => {
    // Mengembalikan object baru
    return {
      // Judul dibiarkan tetap teks biasa (agar bisa disearch kalau mau)
      title: note.title,
      // Isi (content) DIENKRIPSI dulu sebelum masuk variabel
      contentEncrypted: encryptContent(note.content),
    };
  });

  // Menjalankan perintah insert ke database menggunakan Drizzle
  // 'notes' adalah nama tabel/schema import diatas
  await db.insert(notes).values(dataToInsert);

  // Menampilkan pesan sukses jika tidak ada error
  console.log('✅ Seeding selesai! 20 Data berhasil ditambahkan.');

  // Keluar dari proses Node.js
  process.exit(0);
}

// Menjalankan fungsi main dan menangkap jika ada error
main().catch((err) => {
  // Menampilkan error di console
  console.error('❌ Gagal melakukan seeding:', err);
  // Keluar dengan kode error (1)
  process.exit(1);
});
