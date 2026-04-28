'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import { Send, Briefcase } from 'lucide-react'

export function ApplyModal() {
  const { applyModalOpen, applyModalJob, setApplyModalOpen, addApplication } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [cvName, setCvName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) { toast.error('Nom et email requis'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/candidatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: String(applyModalJob?.id),
          jobTitle: applyModalJob?.title,
          company: applyModalJob?.company,
          name, email, phone, coverLetter, cvName,
        }),
      })
      if (res.ok) {
        if (applyModalJob) {
          addApplication(applyModalJob.id, applyModalJob.title, applyModalJob.company)
        }
        toast.success('Candidature envoyée avec succès !')
        setApplyModalOpen(false)
        setName(''); setEmail(''); setPhone(''); setCoverLetter(''); setCvName('')
      } else {
        toast.error('Erreur lors de l\'envoi.')
      }
    } catch {
      toast.error('Erreur de connexion.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={applyModalOpen} onOpenChange={open => setApplyModalOpen(open)}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#0099ff]" />
            Postuler — {applyModalJob?.title}
          </DialogTitle>
        </DialogHeader>
        {applyModalJob && (
          <div className="mb-2 p-3 bg-[#0099ff]/5 rounded-xl border border-[#0099ff]/20 text-sm text-gray-600">
            <span className="font-medium text-[#001a33]">{applyModalJob.company}</span>
            {' · '}{applyModalJob.city}{' · '}{applyModalJob.type}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nom complet *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+242 06..." />
            </div>
            <div className="space-y-1.5">
              <Label>Nom du CV</Label>
              <Input value={cvName} onChange={e => setCvName(e.target.value)} placeholder="CV_NomPrenom.pdf" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Lettre de motivation</Label>
            <Textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4}
              placeholder="Décrivez votre motivation pour ce poste..." />
          </div>
          <Button type="submit" className="w-full bg-[#0099ff] hover:bg-[#0066cc] text-white py-5" disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Votre candidature sera reçue directement dans notre tableau de bord.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
