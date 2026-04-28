'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { JobCard } from '@/components/job-card'
import { AuthModal } from '@/components/auth-modal'
import { ApplyModal } from '@/components/apply-modal'
import { BackToTop } from '@/components/back-to-top'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SECTORS, CONTRACT_TYPES, CITIES } from '@/lib/data'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function OffresContent() {
  const searchParams = useSearchParams()
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('keyword') || '')
  const [sector, setSector] = useState('all')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [city, setCity] = useState(searchParams.get('city') || 'all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => setAllJobs(Array.isArray(data) ? data : []))
      .catch(() => setAllJobs([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = allJobs.filter(job => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.desc?.toLowerCase().includes(q)
    const matchSector = sector === 'all' || job.sector === SECTORS.find(s => s.key === sector)?.value
    const matchType = type === 'all' || job.type === type
    const matchCity = city === 'all' || job.city === city
    return matchSearch && matchSector && matchType && matchCity
  })

  const hasFilters = sector !== 'all' || type !== 'all' || city !== 'all' || search
  const clear = () => { setSector('all'); setType('all'); setCity('all'); setSearch('') }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#001a33] via-[#003d80] to-[#0077cc] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80"
            alt="Offres d'emploi au Congo"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/90 via-[#003d80]/80 to-[#0077cc]/70" />
        <div className="container mx-auto px-6 relative text-center">
          <span className="inline-flex items-center gap-2 bg-[#0099ff]/20 text-white/95 border border-[#00c3ff]/35 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            💼 Offres d&apos;emploi
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-3">
            Trouvez votre prochain emploi
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            {loading ? 'Chargement des offres...' : `${allJobs.length} offre${allJobs.length !== 1 ? 's' : ''} disponible${allJobs.length !== 1 ? 's' : ''} au Congo-Brazzaville`}
          </p>
        </div>
      </section>

      <main className="flex-1 py-10">
        <div className="container mx-auto px-6">
          {/* Barre de recherche */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Rechercher un poste, une entreprise..." value={search}
                onChange={e => setSearch(e.target.value)} className="pl-9 h-11" />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-11 gap-2 text-gray-600">
              <SlidersHorizontal className="w-4 h-4" />Filtres
              {hasFilters && <span className="w-2 h-2 rounded-full bg-[#0099ff]" />}
            </Button>
            {hasFilters && (
              <Button variant="ghost" onClick={clear} className="h-11 gap-1 text-gray-500">
                <X className="w-4 h-4" />Effacer
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <select value={sector} onChange={e => setSector(e.target.value)}
                  className="w-full h-11 border border-input rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent cursor-pointer">
                  {SECTORS.map(s => (
                    <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
                  ))}
                </select>
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Type de contrat" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {CONTRACT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder="Ville" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {CITIES.slice(0, 12).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#0099ff] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-[#001a33] mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-500 mb-4">
                {allJobs.length === 0
                  ? 'Aucune offre publiée pour le moment. Revenez bientôt !'
                  : 'Modifiez vos critères de recherche'}
              </p>
              {hasFilters && <Button onClick={clear} variant="outline">Réinitialiser les filtres</Button>}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{filtered.length} offre{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer /><BackToTop /><AuthModal /><ApplyModal />
    </div>
  )
}

export default function OffresPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#0099ff] animate-spin" /></div>}>
      <OffresContent />
    </Suspense>
  )
}
