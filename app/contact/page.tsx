'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { BackToTop } from '@/components/back-to-top'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) { toast.error('Champs obligatoires manquants.'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      })
      if (res.ok) {
        toast.success('Message envoyé ! Nous vous répondrons sous 24h.')
        setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('')
      } else { toast.error('Erreur lors de l\'envoi.') }
    } catch { toast.error('Erreur de connexion.') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-gradient-to-br from-[#001a33] via-[#003d80] to-[#0077cc] py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Nous sommes à votre écoute</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Une question ? Notre équipe vous répond sous 24h.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#001a33]">Nos coordonnées</h2>
              {[
                { icon: MapPin, title: 'Adresse', lines: ['Ngoyo, Pointe-Noire', 'Congo-Brazzaville'] },
                { icon: Clock, title: 'Horaires', lines: ['Lundi - Vendredi', '8h00 - 18h00'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0099ff]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#0099ff]" />
                  </div>
                  <div><h3 className="font-semibold text-[#001a33] mb-1 text-sm">{title}</h3>{lines.map(l => <p key={l} className="text-gray-600 text-sm">{l}</p>)}</div>
                </div>
              ))}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0099ff]/10 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-[#0099ff]" /></div>
                <div><h3 className="font-semibold text-[#001a33] mb-1 text-sm">Téléphone</h3>
                  <a href="https://wa.me/242053639696" target="_blank" rel="noopener noreferrer" className="text-[#0099ff] hover:underline font-medium text-sm">05 363 96 96</a>
                  <p className="text-gray-500 text-xs mt-0.5">WhatsApp disponible</p></div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0099ff]/10 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-[#0099ff]" /></div>
                <div><h3 className="font-semibold text-[#001a33] mb-1 text-sm">Email</h3>
                  <a href="mailto:secretariat@emploiplus.cg" className="text-[#0099ff] hover:underline font-medium text-sm">secretariat@emploiplus.cg</a></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="font-serif text-2xl text-[#001a33] mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label>Nom complet *</Label><Input placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Téléphone</Label><Input type="tel" placeholder="+242 06 00 00 00" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Sujet</Label><Input placeholder="Objet du message" value={subject} onChange={e => setSubject(e.target.value)} /></div>
                  </div>
                  <div className="space-y-2"><Label>Message *</Label><Textarea placeholder="Votre message..." rows={6} value={message} onChange={e => setMessage(e.target.value)} /></div>
                  <Button type="submit" className="w-full bg-[#0099ff] hover:bg-[#0066cc] py-6 text-base" disabled={isLoading}>
                    <Send className="w-5 h-5 mr-2" />{isLoading ? 'Envoi...' : 'Envoyer le message'}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">Votre message sera reçu directement dans notre tableau de bord.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer /><BackToTop /><AuthModal />
    </div>
  )
}
