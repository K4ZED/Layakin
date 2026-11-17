import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { bacaCsv, bacaAngka, bacaTanggal } from '../src/lib/parse.js'
import { tebakKategori } from '../src/lib/kategori.js'
import { susunLaporan } from '../src/lib/laporan.js'
import { hitungSkor } from '../src/lib/skor.js'

assert.equal(bacaAngka('1.234.567,89'), 1234567.89)
assert.equal(bacaAngka('1,234,567.89'), 1234567.89)
assert.equal(bacaAngka('Rp 25.000'), 25000)
assert.equal(bacaAngka('25,000.00 CR'), 25000)
assert.equal(bacaAngka('25000'), 25000)
assert.equal(bacaAngka('-350.000'), -350000)
assert.equal(bacaAngka('12,5'), 12.5)
assert.equal(bacaAngka(''), null)
assert.equal(bacaTanggal('03/10/2026').getMonth(), 9)
assert.equal(bacaTanggal('2026-10-03 14:22:01').getDate(), 3)
assert.equal(bacaTanggal('3 Okt 2026').getMonth(), 9)
assert.equal(bacaTanggal('abc'), null)

const olah = (teks) => {
  const { transaksi, dilewati } = bacaCsv(teks)
  const t = transaksi.map((x) => ({ ...x, kategori: tebakKategori(x) }))
  const lap = susunLaporan(t)
  return { t, lap, skor: hitungSkor(lap), dilewati }
}

// 1. contoh bawaan (kolom debit dan kredit)
const a = olah(readFileSync(new URL('../public/contoh-mutasi.csv', import.meta.url), 'utf8'))
assert.equal(a.lap.bulan.length, 6)
assert.ok(a.lap.totalPendapatan > a.lap.totalBeban)
const cek = a.t.reduce((s, x) => s + (x.arah === 'masuk' ? x.nominal : -x.nominal), 0)
assert.equal(cek, a.lap.kasBersih)
console.log('contoh:', a.t.length, 'transaksi | pendapatan', a.lap.totalPendapatan, '| beban', a.lap.totalBeban, '| laba', a.lap.laba, '| skor', a.skor.total, a.skor.status)
console.log(a.skor.komponen.map((k) => `${k.nama} ${k.nilai}/${k.maks}`).join(' | '))

// 2. nominal + tipe, pemisah titik koma, ada baris judul di atas header
const b = olah('Mutasi Rekening;;;\nPeriode;Okt 2026;;\nTgl;Uraian;Jumlah;Jenis\n01-10-2026;QRIS MASUK;25.000,00;CR\n02-10-2026;BELANJA BAHAN;350.000,00;DB\nSaldo akhir;;;\n')
assert.equal(b.t.length, 2)
assert.equal(b.lap.totalPendapatan, 25000)
assert.equal(b.lap.totalBeban, 350000)
assert.equal(b.dilewati, 1)

// 3. riwayat QRIS: hanya nominal, semua masuk
const c = olah('Waktu Transaksi,Nama Merchant,Nominal\n2026-10-01 09:12:00,Warung,15000\n2026-10-01 10:40:00,Warung,22000\n')
assert.equal(c.lap.totalPendapatan, 37000)
assert.equal(c.t[0].arah, 'masuk')

// 4. nominal bertanda dengan akhiran CR/DB
const d = olah('Date,Description,Amount\n01/10/2026,TRSF E-BANKING,"1,500,000.00 DB"\n02/10/2026,QR PAYMENT,"45,000.00 CR"\n')
assert.equal(d.t.find((x) => x.arah === 'keluar').nominal, 1500000)

assert.throws(() => bacaCsv('a,b\n1,2\n'))
console.log('semua tes lolos')
