'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState } from '@/components/admin/AdminComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { MessageCircle, Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const COLORS = ['#1e6bcf','#0a2342','#10b981','#f0a500','#7c3aed','#dc2626','#0099ff','#059669']
const EMPTY = { name: '', role: '', stars: 5, text: '', initials: '', color: '#1e6bcf', isActive: true }

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/testimonials')
    setItems(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const openNew = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ name: item.name, role: item.role, stars: item.stars, text: item.text, initials: item.initials, color: item.color, isActive: item.isActive })
    setModalOpen(true)
  }

  const autoInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  const save = async () => {
    if (!form.name || !form.text) { toast.error('Nom et témoignage requis'); return }
    setSaving(true)
    const payload = { ...form, initials: form.initials || autoInitials(form.name) }
    if (editing) {
      await fetch(`/api/admin/testimonials/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Témoignage mis à jour')
    } else {
      await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Témoignage ajouté')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (item: any) => {
    await fetch(`/api/admin/testimonials/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) })
    load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    toast.success('Supprimé'); load()
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader title="Témoignages" desc={`${items.length} témoignage${items.length !== 1 ? 's' : ''}`}
          action={
            <Button onClick={openNew} className="bg-[#f0a500] hover:bg-[#d99400] text-white">
              <Plus className="w-4 h-4 mr-2" />Ajouter un témoignage
            </Button>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-40" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={MessageCircle} title="Aucun témoignage" desc="Ajoutez les avis de vos clients et candidats"
              action={<Button onClick={openNew} className="bg-[#f0a500] text-white"><Plus className="w-4 h-4 mr-1" />Ajouter</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <div key={item.id} className={`bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow ${!item.isActive ? 'opacity-50' : ''}`}>
                <div className="flex gap-0.5 text-[#f0a500] mb-3">
                  {Array.from({ length: item.stars }).map((_,i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 italic text-sm mb-4 line-clamp-3">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: item.color }}>
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#001a33] text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggle(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#f0a500] transition-colors">
                      {item.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer ce témoignage ?</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del(item.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Modifier' : 'Nouveau témoignage'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Nom *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Arielle Moukassa" /></div>
            <div className="space-y-1.5"><Label>Rôle / Fonction</Label><Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Développeuse Web — trouvée via Emploi Plus" /></div>
            <div className="space-y-1.5">
              <Label>Note</Label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => set('stars', n)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border-2 ${form.stars >= n ? 'border-[#f0a500] bg-[#f0a500]/10' : 'border-gray-200'}`}>
                    <Star className={`w-4 h-4 ${form.stars >= n ? 'text-[#f0a500] fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Témoignage *</Label><Textarea value={form.text} onChange={e => set('text', e.target.value)} rows={4} placeholder="Grâce à Emploi Plus, j'ai trouvé mon emploi en 3 semaines..." /></div>
            <div className="space-y-1.5"><Label>Initiales <span className="text-gray-400 text-xs">— auto si vide</span></Label><Input value={form.initials} onChange={e => set('initials', e.target.value.toUpperCase().slice(0,2))} placeholder="AM" maxLength={2} /></div>
            <div className="space-y-1.5"><Label>Couleur de l&apos;avatar</Label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set('color', c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-[#001a33] scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Visible</Label><p className="text-xs text-gray-400">Affiché sur le site</p></div>
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-[#f0a500] hover:bg-[#d99400] text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
