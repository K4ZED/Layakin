const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

export const rupiah = (n) => (n < 0 ? '-Rp' : 'Rp') + nf.format(Math.abs(Math.round(n)))
export const angka = (n) => nf.format(Math.round(n))

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export const labelBulan = (kunci) => {
  const [y, m] = kunci.split('-')
  return `${BULAN[Number(m) - 1]} ${y}`
}

export const tanggalPendek = (d) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

export const kunciBulan = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
