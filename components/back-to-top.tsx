'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 left-8 w-12 h-12 rounded-full bg-[#0099ff] text-white flex items-center justify-center shadow-lg transition-all z-50 hover:bg-[#001a33] hover:-translate-y-1 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Retour en haut"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  )
}
