import { useEffect, useState } from 'react'
import Landing from './components/Landing.jsx'
import Aplikasi from './components/Aplikasi.jsx'

const diAplikasi = () => window.location.hash.startsWith('#/app')

export default function App() {
  const [aplikasi, setAplikasi] = useState(diAplikasi())

  useEffect(() => {
    const ubah = () => {
      setAplikasi(diAplikasi())
      if (diAplikasi()) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', ubah)
    return () => window.removeEventListener('hashchange', ubah)
  }, [])

  return aplikasi ? <Aplikasi /> : <Landing />
}
