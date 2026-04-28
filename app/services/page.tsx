'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { BackToTop } from '@/components/back-to-top'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function ServicesPage() {
  const { setAuthModalOpen } = useAppStore()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero avec image */}
      <section className="relative bg-gradient-to-br from-[#001a33] via-[#065f46] to-[#059669] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80"
            alt="Nos services"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/90 via-[#065f46]/75 to-[#059669]/60" />
        <div className="container mx-auto px-6 relative text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            ⚙️ Ce que nous offrons
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-3">Nos services</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Des solutions complètes pour les entreprises et les chercheurs d&apos;emploi au Congo-Brazzaville.
          </p>
        </div>
      </section>

      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">⚙️</p>
              <p className="text-lg">Nos services seront affichés ici prochainement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {services.map(service => (
                <div key={service.id}
                  className="bg-white border border-gray-200 rounded-2xl p-8 transition-all hover:border-teal-400 hover:shadow-lg hover:-translate-y-1 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mb-6 text-2xl">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-xl text-[#001a33] mb-3 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center bg-white rounded-2xl border border-gray-200 p-10">
            <h2 className="font-serif text-2xl text-[#001a33] mb-3">Prêt à commencer ?</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Rejoignez des milliers de candidats et d&apos;entreprises qui font confiance à Emploi Plus.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button className="bg-[#0099ff] hover:bg-[#0066cc] px-8 py-5"
                onClick={() => setAuthModalOpen(true, 'register')}>
                Démarrer gratuitement
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:text-white px-8 py-5">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer /><BackToTop /><AuthModal />
    </div>
  )
}
