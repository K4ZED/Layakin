import { useRef, useState } from 'react'
import Logo from './Logo.jsx'
import Hasil from './Hasil.jsx'
import { bacaCsv } from '../lib/parse.js'
import { tebakKategori } from '../lib/kategori.js'

export default function Aplikasi() {
  const [data, setData] = useState(null)
  const [galat, setGalat] = useState('')
  const [sibuk, setSibuk] = useState(false)
  const [seret, setSeret] = useState(false)
  const input = useRef(null)

  const olah = (teks, nama) => {
    try {
      const { transaksi, dilewati } = bacaCsv(teks)
      setData({ nama, dilewati, transaksi: transaksi.map((t) => ({ ...t, kategori: tebakKategori(t) })) })
      setGalat('')
      window.scrollTo(0, 0)
    } catch (e) {
      setGalat(e.message || 'File tidak bisa dibaca.')
    }
  }

  const bacaFile = async (file) => {
    if (!file) return
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setGalat('Untuk saat ini hanya file CSV yang didukung. Unduh mutasi dari internet banking dalam format CSV, atau simpan Excel sebagai CSV.')
      return
    }
    setSibuk(true)
    olah(await file.text(), file.name)
    setSibuk(false)
  }

  const pakaiContoh = async () => {
    setSibuk(true)
    try {
      const r = await fetch('./contoh-mutasi.csv')
      olah(await r.text(), 'contoh-mutasi.csv')
    } catch {
      setGalat('Data contoh gagal dimuat.')
    }
    setSibuk(false)
  }

  return (
    <div className="app">
      <header className="app-nav tanpa-cetak">
        <div className="wadah nav">
          <Logo href="#top" />
          <nav aria-label="Navigasi aplikasi">
            <a href="#top">Kembali ke beranda</a>
          </nav>
        </div>
      </header>

      {data ? (
        <Hasil data={data} setData={setData} />
      ) : (
        <main className="wadah unggah">
          <h1>Unggah riwayat QRIS atau mutasi rekening</h1>
          <p className="sub">Layakin membaca transaksinya, lalu menyusun laporan laba rugi, arus kas, dan skor kesiapan kredit.</p>

          <div
            className={'zona' + (seret ? ' zona-aktif' : '')}
            onDragOver={(e) => { e.preventDefault(); setSeret(true) }}
            onDragLeave={() => setSeret(false)}
            onDrop={(e) => { e.preventDefault(); setSeret(false); bacaFile(e.dataTransfer.files[0]) }}
          >
            <svg aria-hidden="true" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            <p className="zona-judul">Seret file CSV ke sini</p>
            <p className="redup">atau</p>
            <input ref={input} id="file" type="file" accept=".csv,.txt,text/csv" hidden onChange={(e) => { bacaFile(e.target.files[0]); e.target.value = '' }} />
            <div className="baris-tombol tengah">
              <button className="tombol tombol-biru" onClick={() => input.current.click()} disabled={sibuk}>Pilih file</button>
              <button className="tombol tombol-garis" onClick={pakaiContoh} disabled={sibuk}>Coba dengan data contoh</button>
            </div>
            {sibuk && <p className="redup">Membaca file...</p>}
          </div>

          {galat && <p className="galat" role="alert">{galat}</p>}

          <div className="info-baris">
            <div>
              <h3>Format yang didukung</h3>
              <p>File CSV dengan kolom tanggal, keterangan, dan nominal. Bisa satu kolom nominal, atau kolom debit dan kredit terpisah.</p>
              <a href="./contoh-mutasi.csv" download>Unduh contoh file CSV</a>
            </div>
            <div>
              <h3>Datamu tetap di perangkatmu</h3>
              <p>File dibaca langsung di browser ini. Tidak ada data yang dikirim ke server.</p>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
