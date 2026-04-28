'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { FormationModal } from '@/components/formation-modal'
import { BackToTop } from '@/components/back-to-top'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { GraduationCap, Loader2 } from 'lucide-react'

const LEVELS = ['Tous', 'Tous niveaux', 'Débutant', 'Intermédiaire', 'Avancé']

export default function FormationsPage() {
  const [formations, setFormations] = useState<any[]>([])
  const [selectedLevel, setSelectedLevel] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const { setFormationModalOpen } = useAppStore()

  useEffect(() => {
    fetch('/api/formations')
      .then(r => r.json())
      .then(data => setFormations(Array.isArray(data) ? data : []))
      .catch(() => setFormations([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = selectedLevel === 'Tous'
    ? formations
    : formations.filter(f => f.level === selectedLevel)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero avec image */}
      <section className="relative bg-gradient-to-br from-[#001a33] via-[#4c1d95] to-[#7c3aed] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80"
            alt="Formations professionnelles"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/90 via-[#4c1d95]/75 to-[#7c3aed]/60" />
        <div className="container mx-auto px-6 relative text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            🎓 Se former
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-3">Formations professionnelles</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Développez vos compétences avec nos programmes certifiants adaptés au marché congolais.
          </p>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          {/* Filtres niveau */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {LEVELS.map(level => (
              <button key={level} onClick={() => setSelectedLevel(level)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all border-2 ${
                  selectedLevel === level
                    ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#7c3aed] hover:text-[#7c3aed]'
                }`}>
                {level}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">
                {formations.length === 0 ? 'Aucune formation disponible pour le moment.' : 'Aucune formation dans ce niveau.'}
              </p>
              {formations.length > 0 && (
                <button onClick={() => setSelectedLevel('Tous')} className="mt-3 text-[#7c3aed] underline text-sm">
                  Voir toutes les formations
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(formation => (
                <div key={formation.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="h-32 flex items-center justify-center text-5xl" style={{ background: formation.bg }}>
                    <span className="drop-shadow-lg">{formation.emoji}</span>
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-2.5 py-0.5 bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-semibold rounded-full mb-3">
                      {formation.level}
                    </span>
                    <h3 className="font-serif text-lg text-[#001a33] mb-2 group-hover:text-[#7c3aed] transition-colors">
                      {formation.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{formation.desc}</p>
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                      <span>⏱ {formation.duration}</span>
                      <span className="font-bold text-[#7c3aed] text-base">{formation.price}</span>
                    </div>
                    <Button className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                      onClick={() => setFormationModalOpen(true, formation.id)}>
                      S&apos;inscrire
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer /><BackToTop /><AuthModal /><FormationModal />
    </div>
  )
}
