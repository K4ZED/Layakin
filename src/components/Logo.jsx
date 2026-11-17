export default function Logo({ terang = false, href = '#top' }) {
  return (
    <a className={'logo' + (terang ? ' logo-terang' : '')} href={href}>
      <svg aria-hidden="true" width="38" height="38" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#f97316" />
        <path d="M11.5 20.5l6 6L29 14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Layakin</span>
    </a>
  )
}
