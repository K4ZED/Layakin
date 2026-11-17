// Skor kesiapan kredit versi prototype.
// Ini aturan sederhana buatan tim Layakin, BUKAN skor kredit resmi bank, OJK, atau SLIK.
const batas = (x) => Math.max(0, Math.min(1, x))

export function hitungSkor(lap) {
  const n = lap.bulan.length
  const pendapatanBulanan = lap.bulan.map((b) => b.pendapatan)
  const rata = pendapatanBulanan.reduce((a, b) => a + b, 0) / (n || 1)
  const simpangan = Math.sqrt(pendapatanBulanan.reduce((a, b) => a + (b - rata) ** 2, 0) / (n || 1))
  const cv = rata > 0 ? simpangan / rata : 1
  const bulanPositif = lap.bulan.filter((b) => b.kasBersih > 0).length
  const rasioAktif = lap.rentangHari > 0 ? lap.hariAktif / lap.rentangHari : 0

  const komponen = [
    {
      nama: 'Panjang riwayat', maks: 20,
      nilai: 20 * batas(n / 6),
      catatan: `${n} bulan data. Nilai penuh mulai 6 bulan.`,
      saran: 'Unggah riwayat minimal 6 bulan terakhir.',
    },
    {
      nama: 'Kestabilan pendapatan', maks: 25,
      nilai: n >= 2 ? 25 * (1 - batas(cv / 0.6)) : 10,
      catatan: n >= 2 ? `Naik turun pendapatan antarbulan sekitar ${Math.round(cv * 100)}%.` : 'Perlu minimal 2 bulan data untuk dinilai penuh.',
      saran: 'Pendapatan bulanan masih naik turun cukup jauh. Jaga penjualan tetap rutin.',
    },
    {
      nama: 'Margin laba', maks: 25,
      nilai: 25 * batas(lap.margin / 0.3),
      catatan: `Margin laba ${Math.round(lap.margin * 100)}%. Nilai penuh mulai 30%.`,
      saran: 'Beban usaha masih besar dibanding pendapatan. Cek pos beban terbesar.',
    },
    {
      nama: 'Keaktifan transaksi', maks: 15,
      nilai: 15 * batas(rasioAktif / 0.7),
      catatan: `Ada pemasukan di ${lap.hariAktif} dari ${lap.rentangHari} hari.`,
      saran: 'Arahkan lebih banyak pembayaran lewat QRIS atau rekening usaha supaya tercatat.',
    },
    {
      nama: 'Arus kas positif', maks: 15,
      nilai: 15 * (n ? bulanPositif / n : 0),
      catatan: `${bulanPositif} dari ${n} bulan kas masuk lebih besar dari kas keluar.`,
      saran: 'Ada bulan dengan kas keluar lebih besar dari kas masuk. Pisahkan uang usaha dan pribadi.',
    },
  ].map((k) => ({ ...k, nilai: Math.round(k.nilai) }))

  const total = komponen.reduce((a, k) => a + k.nilai, 0)
  const status = total >= 75 ? 'Siap Kredit' : total >= 50 ? 'Hampir Siap' : 'Belum Siap'
  const saran = komponen.filter((k) => k.nilai < k.maks * 0.6).map((k) => k.saran)
  return { total, status, komponen, saran }
}
