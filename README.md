# Layakin Web

Landing page dan prototype aplikasi Layakin: unggah riwayat QRIS atau mutasi rekening (CSV), lalu dapatkan laporan laba rugi, arus kas, dan skor kesiapan kredit.

## Menjalankan

Butuh Node.js 18 ke atas.

```
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

Perintah lain:

- `npm run build` membuat versi siap deploy di folder `dist`
- `npm test` menguji logika baca CSV, laporan, dan skor
- `npm run contoh` membuat ulang `public/contoh-mutasi.csv`

## Struktur

- `src/components/Landing.jsx` landing page
- `src/components/Aplikasi.jsx` halaman unggah file
- `src/components/Hasil.jsx` halaman hasil (ringkasan, skor, laba rugi, arus kas, transaksi)
- `src/lib/parse.js` membaca CSV (tanggal, nominal, debit dan kredit, berbagai format angka)
- `src/lib/kategori.js` menebak kategori transaksi dari keterangan
- `src/lib/laporan.js` menyusun laba rugi dan arus kas
- `src/lib/skor.js` menghitung skor kesiapan kredit
- `src/styles.css` semua gaya

## Catatan penting

- Semua file diproses di browser. Tidak ada backend dan tidak ada data yang dikirim ke server.
- Baru mendukung CSV. PDF dan Excel belum.
- Skor kesiapan kredit adalah aturan sederhana buatan tim (lihat `src/lib/skor.js`), bukan skor kredit resmi bank, OJK, atau SLIK.
- `public/contoh-mutasi.csv` adalah data rekaan untuk demo.
- Angka di kartu hero landing page hanya ilustrasi.
- Email mitra di `Landing.jsx` masih `EMAIL_TIM`, ganti dengan email tim.
