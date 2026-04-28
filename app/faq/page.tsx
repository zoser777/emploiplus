'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { BackToTop } from '@/components/back-to-top'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQS } from '@/lib/data'

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                ❓ FAQ
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#001a33] mb-3">
                Questions frequentes
              </h1>
              <p className="text-gray-600">
                Retrouvez les reponses aux questions les plus posees.
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-5 text-left font-semibold text-[#001a33] hover:text-[#0099ff] hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-12 bg-gradient-to-br from-[#001a33] to-[#0066cc] rounded-2xl p-8 text-center">
              <h2 className="font-serif text-2xl text-white mb-3">
                Vous n&apos;avez pas trouve votre reponse ?
              </h2>
              <p className="text-white/70 mb-6">
                Notre equipe est disponible pour repondre a toutes vos questions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00d6ff] text-[#001a33] font-semibold px-8 py-3 rounded-xl transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
      <AuthModal />
    </div>
  )
}
