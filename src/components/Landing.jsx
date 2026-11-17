import Logo from './Logo.jsx'
import Meter from './Meter.jsx'

const MUTASI = [
  ['01/10', 'Bayar QRIS', '25.000', true],
  ['01/10', 'Bayar QRIS', '18.000', true],
  ['02/10', 'Toko bahan', '350.000', false],
  ['02/10', 'Bayar QRIS', '42.000', true],
  ['03/10', 'Sewa kios', '500.000', false],
]

const LABA = [
  ['Pendapatan', '12.400.000'],
  ['Beban bahan', '6.150.000'],
  ['Beban sewa', '1.500.000'],
]

const Centang = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#1a56db" />
    <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Langkah({ no, judul, teks, children }) {
  return (
    <div className="langkah">
      <div className="langkah-ilus">{children}</div>
      <div className="langkah-isi">
        <div className="langkah-no">{no}</div>
        <div>
          <h3>{judul}</h3>
          <p>{teks}</p>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div id="top">
      <section className="hero">
        <div className="wadah">
          <header className="nav">
            <Logo terang />
            <nav aria-label="Navigasi utama">
              <a href="#cara-kerja">Cara kerja</a>
              <a href="#fitur">Fitur</a>
              <a href="#harga">Harga</a>
              <a href="#mitra">Untuk mitra</a>
              <a className="tombol tombol-putih" href="#/app">Mulai sekarang</a>
            </nav>
          </header>

          <div className="hero-teks">
            <h1>Ubah riwayat QRIS jadi laporan keuangan <span>siap ajukan kredit.</span></h1>
            <p>Berkas siap kredit dalam hitungan menit, tanpa mencatat, dari bank mana pun.</p>
            <div className="baris-tombol">
              <a className="tombol tombol-oranye" href="#/app">Unggah riwayat QRIS</a>
              <a className="tombol tombol-garis-putih" href="#cara-kerja">Lihat cara kerja</a>
            </div>
          </div>

          <div className="hero-kartu">
            <div className="kartu-dok miring-kiri">
              <div className="dok-kepala"><strong>Mutasi rekening</strong><span>Yang kamu punya</span></div>
              {MUTASI.map(([tgl, ket, nom, masuk], i) => (
                <div className="dok-baris" key={i}>
                  <span className="dok-tgl">{tgl}</span>
                  <span className="dok-ket">{ket}</span>
                  <span className={masuk ? 'masuk' : 'keluar'}>{masuk ? '+' : '-'} {nom}</span>
                </div>
              ))}
              <p className="dok-kecil">dan ratusan baris lainnya</p>
            </div>

            <div className="panah" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b1f3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15" /><path d="M13 6l6 6-6 6" />
              </svg>
            </div>

            <div className="kartu-dok miring-kanan">
              <div className="dok-kepala"><strong>Laporan laba rugi</strong><span>Yang diminta bank</span></div>
              {LABA.map(([k, v]) => (
                <div className="dok-baris antara" key={k}><span>{k}</span><span>Rp{v}</span></div>
              ))}
              <div className="dok-baris antara total"><span>Laba bersih</span><span>Rp4.750.000</span></div>
              <div className="dok-skor">
                <div><b>82</b><span>skor kesiapan kredit</span></div>
                <span className="lencana">Siap Kredit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="masalah" id="masalah">
        <div className="wadah">
          <p className="catatan tengah">Contoh tampilan. Nama usaha dan semua angka di kedua kartu hanya ilustrasi.</p>
          <h2>Usahanya ramai. Kreditnya mentok di laporan keuangan.</h2>
          <div className="fakta">
            <div className="fakta-besar">
              <div className="angka-raksasa">3,51%</div>
              <div>
                <p>UMKM yang punya laporan keuangan.</p>
                <small>Sumber: OJK, Agustus 2026</small>
              </div>
            </div>
            <div className="fakta-kanan">
              <div className="fakta-kecil">
                <div className="angka-besar">77%</div>
                <p>UMKM masih mencatat keuangan secara manual.</p>
                <small>Sumber: OCBC dan NielsenIQ, 2024</small>
              </div>
              <div className="fakta-kecil">
                <div className="angka-besar">49,4 juta</div>
                <p>merchant memakai QRIS, 97% di antaranya UMKM. Datanya sudah ada.</p>
                <small>Sumber: Bank Indonesia, Oktober 2026</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bagian" id="cara-kerja">
        <div className="wadah">
          <h2>Cara kerja Layakin</h2>
          <p className="sub">Tiga langkah, tanpa mencatat satu transaksi pun.</p>
          <div className="langkah-baris">
            <Langkah no="1" judul="Unggah riwayat" teks="Riwayat QRIS atau mutasi rekening, dari bank mana pun.">
              <div className="chip-file"><i />riwayat-qris.csv</div>
              <div className="batang-penuh" />
              <b className="biru">Terunggah</b>
            </Langkah>
            <Langkah no="2" judul="Laporan otomatis" teks="Transaksi dikelompokkan, lalu disusun jadi laporan laba rugi dan arus kas.">
              <div className="baris-mini"><span>Bayar QRIS</span><em className="pil masuk-pil">Masuk</em></div>
              <div className="baris-mini"><span>Belanja bahan</span><em className="pil keluar-pil">Keluar</em></div>
              <div className="baris-mini"><span>Sewa tempat</span><em className="pil keluar-pil">Keluar</em></div>
            </Langkah>
            <Langkah no="3" judul="Skor dan berkas" teks="Skor kesiapan kredit dan berkas yang siap dibawa ke bank, BPR, atau koperasi.">
              <div className="mini-skor"><Meter nilai={82} lebar={170} /><span className="lencana">Siap Kredit</span></div>
            </Langkah>
          </div>
        </div>
      </section>

      <section className="bagian tanpa-atas" id="fitur">
        <div className="wadah">
          <h2>Semua yang diminta bank, dari data yang sudah kamu punya.</h2>
          <div className="ubin-baris">
            <div className="ubin ubin-lebar biru-bg"><h3>Laporan keuangan otomatis</h3><p>Laba rugi dan arus kas tersusun sendiri dari transaksi yang sudah terjadi.</p></div>
            <div className="ubin oranye-bg"><h3>Skor kesiapan kredit</h3><p>Tahu posisi usahamu sebelum mengajukan.</p></div>
            <div className="ubin navy-bg"><h3>Berkas siap kredit</h3><p>Satu berkas rapi untuk bank, BPR, atau koperasi.</p></div>
            <div className="ubin ubin-lebar muda-bg"><h3>Dari bank mana pun</h3><p>Riwayat QRIS dan mutasi rekening bisa diunggah, apa pun banknya.</p></div>
          </div>
        </div>
      </section>

      <section className="bagian abu" id="harga">
        <div className="wadah">
          <h2>Harga</h2>
          <div className="harga-baris">
            <div className="harga-kartu">
              <div><h3>Pro</h3><p className="redup">Untuk pemilik UMKM</p></div>
              <div className="harga-angka"><b>Rp49.000</b><span>per bulan</span></div>
              <ul>
                <li><Centang />Laporan laba rugi dan arus kas otomatis</li>
                <li><Centang />Skor kesiapan kredit</li>
                <li><Centang />Berkas siap kredit</li>
              </ul>
              <a className="tombol tombol-biru penuh" href="#/app">Mulai sekarang</a>
            </div>
            <div className="harga-kartu gelap">
              <div><h3>Mitra</h3><p className="redup">Untuk BPR dan koperasi</p></div>
              <div className="harga-angka"><b>Rp1,5 juta</b><span>per bulan</span></div>
              <p className="redup">Untuk lembaga yang ingin menerima berkas calon debitur UMKM yang sudah rapi dan siap dinilai.</p>
              <a className="tombol tombol-oranye penuh" href="#mitra">Hubungi kami</a>
            </div>
          </div>
        </div>
      </section>

      <section className="ajakan" id="mitra">
        <div className="wadah ajakan-isi">
          <div>
            <h2>Bantu UMKM layak dan yakin.</h2>
            <p>BPR, koperasi, atau pengurus desa yang ingin mengadakan Klinik Siap Kredit bersama Layakin, hubungi kami.</p>
          </div>
          {/* TODO: ganti dengan email tim */}
          <a className="tombol tombol-oranye besar" href="mailto:EMAIL_TIM">Jadi mitra Layakin</a>
        </div>
      </section>

      <footer className="kaki">
        <div className="wadah kaki-isi">
          <Logo terang />
          <p>Proyek startup SaaS mahasiswa Sains Data, Universitas Sebelas Maret, 2026</p>
        </div>
      </footer>
    </div>
  )
}
