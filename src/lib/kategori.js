export const KATEGORI_MASUK = ['Penjualan QRIS', 'Penjualan transfer', 'Pemasukan lain']
export const KATEGORI_KELUAR = ['Bahan baku', 'Sewa', 'Listrik, air, internet', 'Gaji', 'Biaya bank', 'Pengeluaran lain']
// Tidak dihitung sebagai pendapatan atau beban usaha
export const NON_USAHA = ['Modal dan pinjaman', 'Tarik tunai dan pribadi']

const ATURAN_KELUAR = [
  ['Tarik tunai dan pribadi', /(tarik tunai|tarikan|atm|prive|pribadi)/i],
  ['Sewa', /(sewa|kontrak|kios|ruko)/i],
  ['Listrik, air, internet', /(pln|listrik|token|pdam|air|internet|wifi|indihome|pulsa|telkom|paket data)/i],
  ['Gaji', /(gaji|upah|honor|karyawan|pegawai)/i],
  ['Biaya bank', /(admin|adm|biaya|pajak|bunga|fee|mdr)/i],
  ['Bahan baku', /(bahan|belanja|supplier|suplier|grosir|toko|pasar|sembako|agen|stok|beli|kulak)/i],
]

const ATURAN_MASUK = [
  ['Modal dan pinjaman', /(modal|pinjaman|pencairan|kredit|kur|setoran modal)/i],
  ['Penjualan QRIS', /(qris|qr|merchant|settlement|gopay|ovo|dana|shopeepay|linkaja)/i],
  ['Penjualan transfer', /(trf|transfer|trsf|bi-?fast|setor|pembayaran|bayar)/i],
]

export function tebakKategori(t) {
  const aturan = t.arah === 'masuk' ? ATURAN_MASUK : ATURAN_KELUAR
  for (const [nama, pola] of aturan) if (pola.test(t.keterangan)) return nama
  if (t.arah === 'masuk') return t.keterangan ? 'Pemasukan lain' : 'Penjualan QRIS'
  return 'Pengeluaran lain'
}

export const pilihanKategori = (arah) =>
  arah === 'masuk' ? [...KATEGORI_MASUK, 'Modal dan pinjaman'] : [...KATEGORI_KELUAR, 'Tarik tunai dan pribadi']
