// Meteran setengah lingkaran untuk skor 0 sampai 100
export default function Meter({ nilai, lebar = 220 }) {
  return (
    <svg role="img" aria-label={`Skor kesiapan kredit ${nilai} dari 100`} width={lebar} height={lebar * 0.56} viewBox="0 0 180 100">
      <path d="M14 92a76 76 0 0 1 152 0" fill="none" stroke="#dbe4f3" strokeWidth="16" strokeLinecap="round" />
      {nilai > 0 && (
        <path d="M14 92a76 76 0 0 1 152 0" fill="none" stroke="#f97316" strokeWidth="16" strokeLinecap="round" pathLength="100" strokeDasharray={`${nilai} 100`} />
      )}
      <text x="90" y="88" textAnchor="middle" fontSize="44" fontWeight="700" fill="#0b1f3f">{nilai}</text>
    </svg>
  )
}
