// Membuat public/contoh-mutasi.csv: data rekaan untuk demo, bukan data usaha nyata.
import { writeFileSync } from 'node:fs'

let benih = 20261116
const acak = () => ((benih = (benih * 1664525 + 1013904223) % 4294967296) / 4294967296)
const antara = (a, b) => Math.round((a + acak() * (b - a)) / 500) * 500
const p = (n) => String(n).padStart(2, '0')

const baris = [['Tanggal', 'Keterangan', 'Debit', 'Kredit']]
const awal = new Date(2026, 4, 1)
const akhir = new Date(2026, 9, 31)
for (let d = new Date(awal); d <= akhir; d.setDate(d.getDate() + 1)) {
  const tgl = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
  const libur = d.getDay() === 0 && acak() < 0.5
  if (!libur) {
    const jumlah = 4 + Math.floor(acak() * 7)
    for (let i = 0; i < jumlah; i++) baris.push([tgl, 'QRIS PEMBAYARAN MERCHANT', '', antara(8000, 60000)])
    if (acak() < 0.12) baris.push([tgl, 'TRF MASUK PESANAN KATERING', '', antara(150000, 450000)])
  }
  if (d.getDay() === 1 || d.getDay() === 4) baris.push([tgl, 'TRF KE TOKO GROSIR BAHAN', antara(300000, 600000), ''])
  if (d.getDate() === 3) baris.push([tgl, 'TRF SEWA KIOS', 500000, ''])
  if (d.getDate() === 10) baris.push([tgl, 'PEMBAYARAN PLN LISTRIK', antara(150000, 250000), ''])
  if (d.getDate() === 15) baris.push([tgl, 'TRF GAJI KARYAWAN', 900000, ''])
  if (d.getDate() === 20) baris.push([tgl, 'TARIK TUNAI ATM', antara(500000, 1200000), ''])
  if (d.getDate() === 28) baris.push([tgl, 'BIAYA ADM REKENING', 6500, ''])
}
writeFileSync(new URL('../public/contoh-mutasi.csv', import.meta.url), baris.map((r) => r.join(',')).join('\n') + '\n')
console.log('baris:', baris.length - 1)
