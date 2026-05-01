'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, Briefcase, ArrowRight, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { ApplyModal } from '@/components/apply-modal'
import { FormationModal } from '@/components/formation-modal'
import { JobCard } from '@/components/job-card'
import { FormationCard } from '@/components/formation-card'
import { BackToTop } from '@/components/back-to-top'
import { SECTORS, CONTRACT_TYPES, CITIES } from '@/lib/data'

export default function HomePage() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')
  const [contractType, setContractType] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  // DonnÃ©es dynamiques
  const [jobs, setJobs] = useState<any[]>([])
  const [formations, setFormations] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [siteStats, setSiteStats] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs').then(r => r.json()).catch(() => []),
      fetch('/api/formations').then(r => r.json()).catch(() => []),
      fetch('/api/partners').then(r => r.json()).catch(() => []),
      fetch('/api/testimonials').then(r => r.json()).catch(() => []),
      fetch('/api/site-stats').then(r => r.json()).catch(() => []),
    ]).then(([j, f, p, t, s]) => {
      setJobs(j); setFormations(f); setPartners(p); setTestimonials(t); setSiteStats(s)
    })
  }, [])

  const filteredJobs = activeCategory === 'all'
    ? jobs
    : jobs.filter(job => {
        const sectorDef = SECTORS.find(s => s.key === activeCategory)
        return sectorDef && job.sector === sectorDef.value
      })

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (city && city !== 'all') params.set('city', city)
    if (contractType && contractType !== 'all') params.set('type', contractType)
    router.push(`/offres?${params.toString()}`)
  }

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Veuillez saisir un email valide.')
      return
    }
    setNewsletterLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      if (res.ok) {
        toast.success('Abonnement confirmÃ© ! Vous recevrez nos meilleures offres.')
        setNewsletterEmail('')
      } else {
        toast.error("Erreur lors de l'inscription.")
      }
    } catch {
      toast.error('Erreur de connexion.')
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative bg-gradient-to-br from-[#001a33] via-[#003d80] to-[#0077cc] py-24 md:py-32 overflow-hidden">
        {/* Image de fond hero */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80"
            alt="Professionnels congolais au travail"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/90 via-[#003d80]/80 to-[#0077cc]/70" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo agrandi */}
            <div className="flex justify-center mb-8">
              <img
                src="/images/logo.jpeg"
                alt="Emploi Plus"
                className="h-28 md:h-36 w-auto object-contain brightness-0 invert drop-shadow-2xl"
              />
            </div>

            <span className="inline-flex items-center gap-2 bg-[#0099ff]/20 text-white/95 border border-[#00c3ff]/35 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
              ðŸ‡¨ðŸ‡¬ La plateforme internationale de la République du Congo
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Trouvez votre{' '}
              <span className="text-[#00c3ff]">prochaine opportunitÃ©</span>{' '}
              professionnelle au Congo
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Emploi Plus connecte les talents avec les meilleures entreprises Ã  Brazzaville et Pointe-Noire.
            </p>

            {/* Barre de recherche */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Titre du poste, entreprise..."
                  className="border-0 bg-transparent focus-visible:ring-0 p-0"
                  value={keyword} onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-auto">
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-auto">
                    <SelectValue placeholder="Type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Type de contrat</SelectItem>
                    {CONTRACT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="bg-[#00c3ff] hover:bg-[#00d6ff] text-[#001a33] font-semibold px-8 py-6 rounded-xl"
                onClick={handleSearch}>
                <Search className="w-5 h-5 mr-2" />Rechercher
              </Button>
            </div>

            {/* Stats dynamiques */}
            {siteStats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
                {siteStats.map(stat => (
                  <div key={stat.key} className="text-center">
                    <div className="font-serif text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€ CATÃ‰GORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          {/* Boutons rapides â€” secteurs clÃ©s */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {[
              { key: 'all',        label: 'Tous',             icon: 'ðŸ¢' },
              { key: 'tech',       label: 'Informatique',     icon: 'ðŸ’»' },
              { key: 'finance',    label: 'Finance',          icon: 'ðŸ’°' },
              { key: 'sante',      label: 'SantÃ©',            icon: 'ðŸ¥' },
              { key: 'petrole',    label: 'PÃ©trole & Gaz',    icon: 'ðŸ›¢ï¸' },
              { key: 'transport',  label: 'Transport',        icon: 'ðŸš—' },
              { key: 'logistique', label: 'Logistique',       icon: 'ðŸ“¦' },
              { key: 'agro',       label: 'Agro-alimentaire', icon: 'ðŸ½ï¸' },
              { key: 'btp',        label: 'BTP',              icon: 'ðŸ—ï¸' },
            ].map(sector => (
              <button key={sector.key} onClick={() => setActiveCategory(sector.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all border-2 ${
                  activeCategory === sector.key
                    ? 'border-[#0099ff] bg-[#0099ff] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#0099ff] hover:text-[#0099ff]'
                }`}>
                <span>{sector.icon}</span>{sector.label}
              </button>
            ))}
          </div>
          {/* Tous les secteurs via select */}
          <div className="flex justify-center">
            <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-4 py-2 text-gray-500 focus:outline-none focus:border-[#0099ff] bg-white cursor-pointer hover:border-gray-300">
              {SECTORS.map(s => (
                <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* â”€â”€ OFFRES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {filteredJobs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
              <div>
                <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  ðŸ”¥ RÃ©centes
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#001a33]">DerniÃ¨res offres d&apos;emploi</h2>
                <p className="text-gray-600 mt-1">{filteredJobs.length} offre{filteredJobs.length !== 1 ? 's' : ''} disponible{filteredJobs.length !== 1 ? 's' : ''}</p>
              </div>
              <Link href="/offres">
                <Button variant="outline" className="border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:text-white">
                  Voir toutes les offres <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredJobs.slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ FORMATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {formations.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
              <div>
                <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  ðŸŽ“ Formations
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#001a33]">Formations disponibles</h2>
              </div>
              <Link href="/formations">
                <Button variant="outline" className="border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:text-white">
                  Voir toutes <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formations.slice(0, 4).map(formation => <FormationCard key={formation.id} formation={formation} />)}
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ PARTENAIRES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {partners.length > 0 && (
        <section className="py-16 bg-[#001a33] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container mx-auto px-6 relative">
            <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-3">Ils nous font confiance</h2>
            <p className="text-white/65 text-center max-w-xl mx-auto mb-12">
              Les meilleures entreprises congolaises publient leurs offres sur Emploi Plus.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {partners.map(partner => (
                <div key={partner.id}
                  className="bg-white/[0.07] border border-white/[0.12] rounded-2xl p-6 text-center transition-all hover:bg-white/[0.14] hover:-translate-y-1">
                  <div
                    className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center font-serif font-bold text-lg text-white"
                    style={{ backgroundColor: partner.color }}>
                    {partner.logo}
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm">{partner.name}</h3>
                  <p className="text-white/55 text-xs">{partner.sector}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ TÃ‰MOIGNAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                ðŸ’¬ TÃ©moignages
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#001a33]">Ce qu&apos;ils disent d&apos;Emploi Plus</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white border border-gray-200 rounded-2xl p-7">
                  <div className="flex gap-0.5 text-[#f0a500] mb-4">
                    {Array.from({ length: t.stars }).map((_,i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: t.color }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[#001a33]">{t.name}</div>
                      <div className="text-sm text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ NEWSLETTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-16 bg-gradient-to-r from-[#0099ff] to-[#001a33] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80"
            alt="Newsletter emploi"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              âœ‰ï¸ Newsletter
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Recevez les offres par email</h2>
            <p className="text-white/75 mb-8">
              Inscrivez-vous Ã  notre newsletter et soyez les premiers informÃ©s des nouvelles opportunitÃ©s.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-white border-0 py-6 px-5 rounded-xl text-gray-800"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
              />
              <Button
                type="submit"
                disabled={newsletterLoading}
                className="bg-[#00c3ff] hover:bg-[#00d6ff] text-[#001a33] font-semibold px-8 py-6 rounded-xl">
                {newsletterLoading ? 'Inscription...' : "S'inscrire"}
              </Button>
            </form>
            <p className="text-white/50 text-xs mt-4">Aucun spam. DÃ©sinscription en un clic.</p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <AuthModal />
      <ApplyModal />
      <FormationModal />
    </div>
  )
}



