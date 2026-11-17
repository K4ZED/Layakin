import Papa from 'papaparse'

const POLA = {
  tanggal: /(tanggal|tgl|date|waktu|time)/i,
  keterangan: /(keterangan|deskripsi|uraian|description|remark|berita|rincian|merchant|detail|nama)/i,
  debit: /(debit|debet|keluar|withdraw|pengeluaran)/i,
  kredit: /(kredit|credit|masuk|deposit|pemasukan)/i,
  nominal: /(nominal|jumlah|amount|mutasi|nilai|total)/i,
  tipe: /(tipe|jenis|type|d\/?k|db\/?cr|cr\/?db|posisi)/i,
  saldo: /(saldo|balance)/i,
}

const BULAN = {
  jan: 0, januari: 0, january: 0, feb: 1, februari: 1, february: 1, mar: 2, maret: 2, march: 2,
  apr: 3, april: 3, mei: 4, may: 4, jun: 5, juni: 5, june: 5, jul: 6, juli: 6, july: 6,
  agu: 7, agt: 7, ags: 7, aug: 7, agustus: 7, august: 7, sep: 8, sept: 8, september: 8,
  okt: 9, oct: 9, oktober: 9, october: 9, nov: 10, november: 10, nop: 10, des: 11, dec: 11, desember: 11, december: 11,
}

// "1.234.567,89", "1,234,567.89", "25000", "Rp 25.000", "25,000.00 CR", "(5.000)"
export function bacaAngka(teks) {
  if (teks == null) return null
  let s = String(teks).trim()
  if (!s) return null
  const negatif = /^\(.*\)$/.test(s) || /^-/.test(s) || /-$/.test(s)
  s = s.replace(/rp\.?/i, '').replace(/idr/i, '').replace(/\b(cr|db|dr|d|k)\b\.?/gi, '').replace(/[()\s+-]/g, '')
  if (!/^[\d.,]+$/.test(s)) return null
  const titik = s.lastIndexOf('.')
  const koma = s.lastIndexOf(',')
  if (titik >= 0 && koma >= 0) {
    s = titik > koma ? s.replace(/,/g, '') : s.replace(/\./g, '').replace(',', '.')
  } else if (koma >= 0) {
    s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.')
  } else if (titik >= 0) {
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '')
  }
  const n = Number(s)
  if (!Number.isFinite(n)) return null
  return negatif ? -n : n
}

export function bacaTanggal(teks, tahunBawaan = new Date().getFullYear()) {
  if (teks == null) return null
  const s = String(teks).trim()
  if (!s) return null
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (m) return buat(+m[1], +m[2] - 1, +m[3])
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/)
  if (m) return buat(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1])
  m = s.match(/^(\d{1,2})[-/\s]+([A-Za-z]{3,9})[-/\s,]*(\d{2,4})?/)
  if (m && BULAN[m[2].toLowerCase()] != null) {
    const th = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : tahunBawaan
    return buat(th, BULAN[m[2].toLowerCase()], +m[1])
  }
  m = s.match(/^(\d{1,2})[-/](\d{1,2})$/)
  if (m) return buat(tahunBawaan, +m[2] - 1, +m[1])
  return null
}

function buat(y, m, d) {
  if (m < 0 || m > 11 || d < 1 || d > 31 || y < 2000 || y > 2100) return null
  const t = new Date(y, m, d)
  return t.getMonth() === m ? t : null
}

function cariHeader(baris) {
  for (let i = 0; i < Math.min(baris.length, 25); i++) {
    const sel = baris[i].map((x) => String(x ?? '').trim())
    const adaTanggal = sel.some((x) => POLA.tanggal.test(x))
    const adaUang = sel.some((x) => POLA.debit.test(x) || POLA.kredit.test(x) || POLA.nominal.test(x))
    if (adaTanggal && adaUang) return i
  }
  return -1
}

function petakan(header) {
  const peta = {}
  header.forEach((h, i) => {
    const nama = String(h ?? '').trim()
    if (!nama) return
    if (peta.saldo == null && POLA.saldo.test(nama)) return void (peta.saldo = i)
    if (peta.tanggal == null && POLA.tanggal.test(nama)) return void (peta.tanggal = i)
    if (peta.tipe == null && POLA.tipe.test(nama)) return void (peta.tipe = i)
    if (peta.debit == null && POLA.debit.test(nama)) return void (peta.debit = i)
    if (peta.kredit == null && POLA.kredit.test(nama)) return void (peta.kredit = i)
    if (peta.nominal == null && POLA.nominal.test(nama)) return void (peta.nominal = i)
    if (peta.keterangan == null && POLA.keterangan.test(nama)) return void (peta.keterangan = i)
  })
  return peta
}

// Mengubah isi CSV menjadi daftar transaksi: { tanggal, keterangan, nominal, arah: 'masuk' | 'keluar' }
export function bacaCsv(teks) {
  const hasil = Papa.parse(teks.replace(/^﻿/, ''), { skipEmptyLines: 'greedy' })
  const baris = hasil.data
  if (!baris.length) throw new Error('File kosong.')
  const iHeader = cariHeader(baris)
  if (iHeader < 0) {
    throw new Error('Kolom tidak dikenali. File perlu punya kolom tanggal dan kolom nominal (atau debit dan kredit).')
  }
  const peta = petakan(baris[iHeader])
  if (peta.tanggal == null) throw new Error('Kolom tanggal tidak ditemukan.')
  if (peta.nominal == null && peta.debit == null && peta.kredit == null) {
    throw new Error('Kolom nominal tidak ditemukan.')
  }

  const transaksi = []
  let dilewati = 0
  for (let i = iHeader + 1; i < baris.length; i++) {
    const r = baris[i]
    const tanggal = bacaTanggal(r[peta.tanggal])
    if (!tanggal) { dilewati++; continue }
    const keterangan = peta.keterangan != null ? String(r[peta.keterangan] ?? '').trim() : ''
    let nominal = null
    let arah = null
    const debit = peta.debit != null ? bacaAngka(r[peta.debit]) : null
    const kredit = peta.kredit != null ? bacaAngka(r[peta.kredit]) : null
    if (kredit) { nominal = Math.abs(kredit); arah = 'masuk' }
    else if (debit) { nominal = Math.abs(debit); arah = 'keluar' }
    else if (peta.nominal != null) {
      const mentah = String(r[peta.nominal] ?? '')
      const n = bacaAngka(mentah)
      if (n) {
        nominal = Math.abs(n)
        const tipe = (peta.tipe != null ? String(r[peta.tipe] ?? '') : '') + ' ' + mentah
        if (/\b(db|dr|debit|debet|keluar|d)\b/i.test(tipe)) arah = 'keluar'
        else if (/\b(cr|kredit|credit|masuk|k)\b/i.test(tipe)) arah = 'masuk'
        else arah = n < 0 ? 'keluar' : 'masuk'
      }
    }
    if (!nominal || !arah) { dilewati++; continue }
    transaksi.push({ id: transaksi.length, tanggal, keterangan, nominal, arah })
  }
  if (!transaksi.length) throw new Error('Tidak ada baris transaksi yang bisa dibaca dari file ini.')
  transaksi.sort((a, b) => a.tanggal - b.tanggal)
  return { transaksi, dilewati }
}
