/**
 * File ini berisi fungsi untuk enkripsi dan dekripsi menggunakan algoritma XOR
 * Digunakan untuk mengamankan data catatan dengan kunci yang bisa diatur melalui environment
 */

// Mendapatkan kunci XOR dari environment, jika tidak ada pakai default
const DEFAULT_KEY = process.env.XOR_KEY || 'DEFAULT_XOR_KEY';

// Fungsi untuk mengenkripsi teks biasa menjadi string hex menggunakan XOR
export function xorEncrypt(
  plainText: string,
  key: string = DEFAULT_KEY,
): string {
  // Konversi plaintext dan key ke bentuk byte
  const textBytes = Buffer.from(plainText, 'utf8');
  const keyBytes = Buffer.from(key, 'utf8');

  // Buffer hasil enkripsi
  const result = Buffer.alloc(textBytes.length);

  // Proses XOR setiap byte dengan kunci
  for (let i = 0; i < textBytes.length; i++) {
    result[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // Hasil dikembalikan dalam bentuk hex string
  return result.toString('hex');
}

// Fungsi untuk mendekripsi string hex hasil XOR menjadi teks biasa
export function xorDecrypt(
  cipherHex: string,
  key: string = DEFAULT_KEY,
): string {
  // Konversi cipher dan key ke bentuk byte
  const cipherBytes = Buffer.from(cipherHex, 'hex');
  const keyBytes = Buffer.from(key, 'utf8');

  // Buffer hasil dekripsi
  const result = Buffer.alloc(cipherBytes.length);

  // Proses XOR setiap byte dengan kunci
  for (let i = 0; i < cipherBytes.length; i++) {
    result[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // Hasil dikembalikan dalam bentuk string utf8
  return result.toString('utf8');
}
