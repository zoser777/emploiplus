'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { FORMATIONS, CITIES } from '@/lib/data'
import { toast } from 'sonner'
import { GraduationCap, Send } from 'lucide-react'

export function FormationModal() {
  const { formationModalOpen, formationModalId, setFormationModalOpen, addFormationRegistration } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formation, setFormation] = useState<any>(null)

  useEffect(() => {
    if (!formationModalId) return
    // Try static data first
    const staticF = FORMATIONS.find(f => String(f.id) === String(formationModalId))
    if (staticF) { setFormation(staticF); return }
    // Otherwise fetch from API
    fetch('/api/admin/formations')
      .then(r => r.json())
      .then((list: any[]) => {
        const found = list.find(f => String(f.id) === String(formationModalId))
        setFormation(found || null)
      })
      .catch(() => setFormation(null))
  }, [formationModalId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) { toast.error('Nom et email requis'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/formations/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formationId: String(formationModalId),
          formationTitle: formation?.title || 'Formation',
          name, email, phone, city, message,
        }),
      })
      if (res.ok) {
        if (formationModalId && typeof formationModalId === 'number') {
          addFormationRegistration(formationModalId, formation?.title || '')
        }
        toast.success('Inscription envoyée ! Nous vous contacterons bientôt.')
        setFormationModalOpen(false)
        setName(''); setEmail(''); setPhone(''); setCity(''); setMessage('')
      } else {
        toast.error('Erreur lors de l\'inscription.')
      }
    } catch {
      toast.error('Erreur de connexion.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={formationModalOpen} onOpenChange={open => setFormationModalOpen(open)}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            S&apos;inscrire — {formation?.title || 'Formation'}
          </DialogTitle>
        </DialogHeader>
        {formation && (
          <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-3">
            <span className="text-2xl">{formation.emoji}</span>
            <div>
              <p className="font-semibold text-[#001a33] text-sm">{formation.title}</p>
              <p className="text-xs text-gray-500">{formation.duration} · {formation.level} · <span className="text-purple-600 font-medium">{formation.price}</span></p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Nom complet *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" /></div>
            <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Téléphone</Label><Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+242 06..." /></div>
            <div className="space-y-1.5">
              <Label>Ville</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>{CITIES.slice(0, 6).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Message (optionnel)</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Questions ou informations complémentaires..." />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5" disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />{isLoading ? 'Envoi...' : 'Envoyer mon inscription'}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Notre équipe vous contactera pour confirmer l&apos;inscription et les modalités de paiement.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
