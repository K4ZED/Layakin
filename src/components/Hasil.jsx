import { useMemo, useState } from 'react'
import Meter from './Meter.jsx'
import { susunLaporan } from '../lib/laporan.js'
import { hitungSkor } from '../lib/skor.js'
import { pilihanKategori } from '../lib/kategori.js'
import { rupiah, angka, labelBulan, tanggalPendek } from '../lib/format.js'

const PER_HALAMAN = 25

function GrafikBulan({ bulan }) {
  const maks = Math.max(1, ...bulan.flatMap((b) => [b.kasMasuk, b.kasKeluar]))
  return (
    <div className="grafik" role="img" aria-label="Grafik kas masuk dan kas keluar per bulan">
      {bulan.map((b) => (
        <div className="grafik-kol" key={b.bulan}>
          <div className="grafik-batang">
            <i className="b-masuk" style={{ height: `${(b.kasMasuk / maks) * 100}%` }} title={`Masuk ${rupiah(b.kasMasuk)}`} />
            <i className="b-keluar" style={{ height: `${(b.kasKeluar / maks) * 100}%` }} title={`Keluar ${rupiah(b.kasKeluar)}`} />
          </div>
          <span>{labelBulan(b.bulan)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Hasil({ data, setData }) {
  const [usaha, setUsaha] = useState('')
  const [halaman, setHalaman] = useState(0)
  const lap = useMemo(() => susunLaporan(data.transaksi), [data.transaksi])
  const skor = useMemo(() => hitungSkor(lap), [lap])

  const ubahKategori = (id, kategori) =>
    setData({ ...data, transaksi: data.transaksi.map((t) => (t.id === id ? { ...t, kategori } : t)) })

  const jumlahHalaman = Math.ceil(data.transaksi.length / PER_HALAMAN)
  const tampil = data.transaksi.slice(halaman * PER_HALAMAN, (halaman + 1) * PER_HALAMAN)
  const kelasStatus = skor.total >= 75 ? 'siap' : skor.total >= 50 ? 'hampir' : 'belum'

  return (
    <main className="wadah hasil">
      <div className="hasil-kepala">
        <div>
          <p className="label-kecil">Berkas kesiapan kredit</p>
          <label className="sr" htmlFor="usaha">Nama usaha</label>
          <input id="usaha" className="input-usaha" placeholder="Tulis nama usahamu" value={usaha} onChange={(e) => setUsaha(e.target.value)} />
          <p className="redup">
            Periode {tanggalPendek(lap.awal)} sampai {tanggalPendek(lap.akhir)}. {angka(lap.jumlah)} transaksi dari {data.nama}.
            {data.dilewati > 0 && ` ${data.dilewati} baris dilewati karena tidak terbaca.`}
          </p>
        </div>
        <div className="baris-tombol tanpa-cetak">
          <button className="tombol tombol-biru" onClick={() => window.print()}>Cetak atau simpan PDF</button>
          <button className="tombol tombol-garis" onClick={() => setData(null)}>Unggah file lain</button>
        </div>
      </div>

      <section className="ringkas">
        <div className="kotak"><span>Pendapatan usaha</span><b>{rupiah(lap.totalPendapatan)}</b></div>
        <div className="kotak"><span>Beban usaha</span><b>{rupiah(lap.totalBeban)}</b></div>
        <div className="kotak kotak-navy"><span>Laba bersih</span><b>{rupiah(lap.laba)}</b></div>
        <div className="kotak"><span>Margin laba</span><b>{Math.round(lap.margin * 100)}%</b></div>
      </section>

      <section className="panel skor-panel">
        <div className="skor-kiri">
          <Meter nilai={skor.total} />
          <span className={'lencana lencana-' + kelasStatus}>{skor.status}</span>
          <p className="catatan">Skor ini perkiraan dari aturan sederhana versi prototype. Bukan skor kredit resmi bank, OJK, atau SLIK.</p>
        </div>
        <div className="skor-kanan">
          <h2>Skor kesiapan kredit</h2>
          {skor.komponen.map((k) => (
            <div className="komponen" key={k.nama}>
              <div className="komponen-atas"><span>{k.nama}</span><b>{k.nilai} / {k.maks}</b></div>
              <div className="jalur"><i style={{ width: `${(k.nilai / k.maks) * 100}%` }} /></div>
              <small>{k.catatan}</small>
            </div>
          ))}
          {skor.saran.length > 0 && (
            <div className="saran">
              <h3>Yang bisa diperbaiki</h3>
              <ul>{skor.saran.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
        </div>
      </section>

      <div className="dua-kolom">
        <section className="panel">
          <h2>Laporan laba rugi</h2>
          <table className="tabel">
            <tbody>
              <tr className="judul-grup"><td colSpan="2">Pendapatan</td></tr>
              {Object.entries(lap.pendapatan).map(([k, v]) => <tr key={k}><td>{k}</td><td className="kanan">{rupiah(v)}</td></tr>)}
              <tr className="subtotal"><td>Total pendapatan</td><td className="kanan">{rupiah(lap.totalPendapatan)}</td></tr>
              <tr className="judul-grup"><td colSpan="2">Beban</td></tr>
              {Object.entries(lap.beban).map(([k, v]) => <tr key={k}><td>{k}</td><td className="kanan">{rupiah(v)}</td></tr>)}
              <tr className="subtotal"><td>Total beban</td><td className="kanan">{rupiah(lap.totalBeban)}</td></tr>
              <tr className="total"><td>Laba bersih</td><td className="kanan">{rupiah(lap.laba)}</td></tr>
            </tbody>
          </table>
          <p className="catatan">Modal, pinjaman, tarik tunai, dan pengeluaran pribadi tidak dihitung sebagai pendapatan atau beban usaha.</p>
        </section>

        <section className="panel">
          <h2>Arus kas per bulan</h2>
          <GrafikBulan bulan={lap.bulan} />
          <div className="legenda"><span><i className="b-masuk" />Kas masuk</span><span><i className="b-keluar" />Kas keluar</span></div>
          <div className="gulir">
            <table className="tabel">
              <thead><tr><th>Bulan</th><th className="kanan">Masuk</th><th className="kanan">Keluar</th><th className="kanan">Bersih</th></tr></thead>
              <tbody>
                {lap.bulan.map((b) => (
                  <tr key={b.bulan}><td>{labelBulan(b.bulan)}</td><td className="kanan">{rupiah(b.kasMasuk)}</td><td className="kanan">{rupiah(b.kasKeluar)}</td><td className="kanan">{rupiah(b.kasBersih)}</td></tr>
                ))}
                <tr className="total"><td>Total</td><td className="kanan">{rupiah(lap.kasMasuk)}</td><td className="kanan">{rupiah(lap.kasKeluar)}</td><td className="kanan">{rupiah(lap.kasBersih)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel tanpa-cetak">
        <h2>Transaksi</h2>
        <p className="redup">Kategori ditebak otomatis dari keterangan. Kalau ada yang salah, ganti di sini dan laporan langsung menyesuaikan.</p>
        <div className="gulir">
          <table className="tabel">
            <thead><tr><th>Tanggal</th><th>Keterangan</th><th className="kanan">Nominal</th><th>Kategori</th></tr></thead>
            <tbody>
              {tampil.map((t) => (
                <tr key={t.id}>
                  <td>{tanggalPendek(t.tanggal)}</td>
                  <td>{t.keterangan || '-'}</td>
                  <td className={'kanan ' + t.arah}>{t.arah === 'masuk' ? '+' : '-'} {rupiah(t.nominal)}</td>
                  <td>
                    <select aria-label={`Kategori transaksi ${t.keterangan}`} value={t.kategori} onChange={(e) => ubahKategori(t.id, e.target.value)}>
                      {pilihanKategori(t.arah).map((k) => <option key={k}>{k}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {jumlahHalaman > 1 && (
          <div className="halaman">
            <button className="tombol tombol-garis kecil" disabled={halaman === 0} onClick={() => setHalaman(halaman - 1)}>Sebelumnya</button>
            <span>Halaman {halaman + 1} dari {jumlahHalaman}</span>
            <button className="tombol tombol-garis kecil" disabled={halaman >= jumlahHalaman - 1} onClick={() => setHalaman(halaman + 1)}>Berikutnya</button>
          </div>
        )}
      </section>
    </main>
  )
}
