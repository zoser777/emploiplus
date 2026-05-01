'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Users, Globe, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { BackToTop } from '@/components/back-to-top'

const values = [
  { icon: CheckCircle2, title: 'Excellence', desc: 'QualitÃ© et rigueur dans tout ce que nous faisons' },
  { icon: Users, title: 'Inclusion', desc: 'Offrir des chances Ã©gales Ã  tous' },
  { icon: Globe, title: 'Innovation', desc: 'Des outils numÃ©riques modernes et efficaces' },
  { icon: Shield, title: 'Confiance', desc: 'Transparence avec candidats et recruteurs' },
]

const heroStats = [
  { num: '1 200+', label: 'Offres actives' },
  { num: '350+', label: 'Partenaires' },
  { num: '8 500+', label: 'Candidats' },
]

export default function AproposPage() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(data => setTeam(Array.isArray(data) ? data : []))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* â”€â”€ HERO â”€â”€ */}
        <section className="relative py-16 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  ðŸ¢ Qui sommes-nous ?
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-[#001a33] leading-tight mb-6">
                  Emploi Plus, votre partenaire emploi au Congo
                </h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                  FondÃ©e Ã  Pointe-Noire, <strong>Emploi Plus</strong> est la premiÃ¨re plateforme numÃ©rique
                  de mise en relation entre chercheurs d&apos;emploi et entreprises au Congo-Brazzaville.
                  Notre mission : rendre l&apos;accÃ¨s Ã  l&apos;emploi plus simple, plus rapide et plus Ã©quitable.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Nous proposons Ã©galement des formations professionnelles certifiantes pour accompagner
                  les Congolais dans le dÃ©veloppement de leurs compÃ©tences et leur insertion professionnelle.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {values.map((value) => (
                    <div key={value.title} className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0099ff]/10 flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-5 h-5 text-[#0099ff]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#001a33] text-sm">{value.title}</h3>
                        <p className="text-gray-500 text-xs">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/contact"><Button className="bg-[#0099ff] hover:bg-[#0066cc]">Nous contacter</Button></Link>
                  <Link href="/services"><Button variant="outline" className="border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:text-white">Nos services</Button></Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl overflow-hidden h-96 relative">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                    alt="Ã‰quipe Emploi Plus"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/60 to-transparent" />
                </div>
                {heroStats.map((stat, index) => (
                  <div key={stat.label}
                    className={`absolute bg-white rounded-xl p-4 shadow-xl ${index === 0 ? 'top-6 left-6' : index === 1 ? 'top-1/2 -translate-y-1/2 right-4' : 'bottom-6 left-10'}`}>
                    <div className="font-serif text-2xl font-bold text-[#0099ff]">{stat.num}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€ Ã‰QUIPE â”€â”€ */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                ðŸ‘¥ Notre Ã©quipe
              </span>
              <h2 className="font-serif text-3xl text-[#001a33]">Les personnes derriÃ¨re Emploi Plus</h2>
              <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                Une Ã©quipe passionnÃ©e, engagÃ©e pour le dÃ©veloppement de l&apos;emploi au Congo-Brazzaville.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-[#0099ff] animate-spin" /></div>
            ) : team.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>L&apos;Ã©quipe sera bientÃ´t prÃ©sentÃ©e.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member) => (
                  <div key={member.id}
                    className="bg-white border border-gray-200 rounded-2xl p-7 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                    {/* Photo ou initiales */}
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100 shadow-md"
                      />
                    ) : (
                      <div
                        className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} mx-auto mb-4 flex items-center justify-center text-white font-serif text-2xl font-bold shadow-md`}>
                        {member.initials}
                      </div>
                    )}
                    <h3 className="font-bold text-[#001a33] mb-1">{member.name}</h3>
                    <p className="text-[#0099ff] text-sm">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-400 text-xs mt-2 leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* â”€â”€ CTA â”€â”€ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80"
              alt="Rejoindre Emploi Plus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/90 to-[#0066cc]/80" />
          </div>
          <div className="container mx-auto px-6 relative text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">PrÃªt Ã  rejoindre Emploi Plus ?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Que vous soyez candidat ou entreprise, notre plateforme vous offre les outils pour rÃ©ussir.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/offres">
                <Button className="bg-[#00c3ff] hover:bg-[#00d6ff] text-[#001a33] font-semibold px-8 py-6">
                  Voir les offres
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#001a33] px-8 py-6">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer /><BackToTop /><AuthModal />
    </div>
  )
}

