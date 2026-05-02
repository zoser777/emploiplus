'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Linkedin, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#001a33] text-white/70 pt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.jpeg"
                alt="Emploi Plus"
                width={180}
                height={70}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Emploi Plus est parmi les plateformes de mise en relation entre chercheurs d'emploi et entreprises au Congo-Brazzaville.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm hover:text-[#00c3ff] transition-colors">Accueil</Link>
              <Link href="/offres" className="text-sm hover:text-[#00c3ff] transition-colors">Offres d'emplois</Link>
              <Link href="/formations" className="text-sm hover:text-[#00c3ff] transition-colors">Formations</Link>
              <Link href="/blog" className="text-sm hover:text-[#00c3ff] transition-colors">Blog</Link>
              <Link href="/faq" className="text-sm hover:text-[#00c3ff] transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
              Informations
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/apropos" className="text-sm hover:text-[#00c3ff] transition-colors">A propos</Link>
              <Link href="/services" className="text-sm hover:text-[#00c3ff] transition-colors">Nos services</Link>
              <Link href="/contact" className="text-sm hover:text-[#00c3ff] transition-colors">Contact</Link>
              <Link href="/confidentialite" className="text-sm hover:text-[#00c3ff] transition-colors">Politique de confidentialite</Link>
              <Link href="/cgu" className="text-sm hover:text-[#00c3ff] transition-colors">CGU</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <span>📍 Ngoyo, Pointe-Noire</span>
              <a href="https://wa.me/242053639696" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c3ff] transition-colors">
                📞 05 363 96 96
              </a>
              <a href="mailto:secretariat@emploiplus.cg" className="hover:text-[#00c3ff] transition-colors">
                ✉ secretariat@emploiplus.cg
              </a>
            </div>
            <div className="flex gap-2 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=100068691730340"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#00c3ff] hover:text-[#001a33] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Va5ObJ55Ejy5jC43x50u"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#00c3ff] hover:text-[#001a33] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/emploi-plus-mda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#00c3ff] hover:text-[#001a33] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <span>&copy; 2026 Emploi Plus - Groupe Emploi Plus. Tous droits reservés.</span>
          <span>Fait au Congo-Brazzaville</span>
        </div>
      </div>
    </footer>
  )
}
