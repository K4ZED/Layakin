import { NON_USAHA } from './kategori.js'
import { kunciBulan } from './format.js'

// Menyusun laporan laba rugi dan arus kas dari transaksi yang sudah berkategori
export function susunLaporan(transaksi) {
  const pendapatan = {}
  const beban = {}
  const perBulan = {}
  const hariAktif = new Set()
  let kasMasuk = 0
  let kasKeluar = 0

  for (const t of transaksi) {
    const k = kunciBulan(t.tanggal)
    const b = (perBulan[k] ||= { bulan: k, pendapatan: 0, beban: 0, kasMasuk: 0, kasKeluar: 0, jumlah: 0 })
    b.jumlah++
    const usaha = !NON_USAHA.includes(t.kategori)
    if (t.arah === 'masuk') {
      kasMasuk += t.nominal
      b.kasMasuk += t.nominal
      if (usaha) {
        pendapatan[t.kategori] = (pendapatan[t.kategori] || 0) + t.nominal
        b.pendapatan += t.nominal
        hariAktif.add(t.tanggal.toDateString())
      }
    } else {
      kasKeluar += t.nominal
      b.kasKeluar += t.nominal
      if (usaha) {
        beban[t.kategori] = (beban[t.kategori] || 0) + t.nominal
        b.beban += t.nominal
      }
    }
  }

  const bulan = Object.values(perBulan).sort((a, b) => a.bulan.localeCompare(b.bulan))
  let saldo = 0
  for (const b of bulan) {
    b.laba = b.pendapatan - b.beban
    b.kasBersih = b.kasMasuk - b.kasKeluar
    saldo += b.kasBersih
    b.kasKumulatif = saldo
  }
  const totalPendapatan = Object.values(pendapatan).reduce((a, b) => a + b, 0)
  const totalBeban = Object.values(beban).reduce((a, b) => a + b, 0)
  const awal = transaksi[0].tanggal
  const akhir = transaksi[transaksi.length - 1].tanggal
  const rentangHari = Math.round((akhir - awal) / 86400000) + 1

  return {
    pendapatan, beban, bulan, totalPendapatan, totalBeban,
    laba: totalPendapatan - totalBeban,
    margin: totalPendapatan > 0 ? (totalPendapatan - totalBeban) / totalPendapatan : 0,
    kasMasuk, kasKeluar, kasBersih: kasMasuk - kasKeluar,
    awal, akhir, rentangHari, hariAktif: hariAktif.size, jumlah: transaksi.length,
  }
}
