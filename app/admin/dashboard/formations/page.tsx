'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState, StatusBadge } from '@/components/admin/AdminComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { GraduationCap, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const EMPTY = { title: '', desc: '', duration: '1 mois', level: 'Tous niveaux', price: '10 000 FCFA', emoji: '📚', bg: 'linear-gradient(135deg,#0099ff,#001a33)', isActive: true }
const EMOJIS = ['📚','💻','🎬','🎨','🌐','🎤','💼','📊','📱','🔧','📈','🏆']
const LEVELS = ['Tous niveaux','Débutant','Intermédiaire','Avancé']
const BG_OPTIONS = [
  { label: 'Bleu', value: 'linear-gradient(135deg,#0099ff,#001a33)' },
  { label: 'Violet', value: 'linear-gradient(135deg,#7c3aed,#4c1d95)' },
  { label: 'Vert', value: 'linear-gradient(135deg,#10b981,#047857)' },
  { label: 'Orange', value: 'linear-gradient(135deg,#f0a500,#dc2626)' },
  { label: 'Rose', value: 'linear-gradient(135deg,#ec4899,#be185d)' },
  { label: 'Cyan', value: 'linear-gradient(135deg,#0ea5e9,#0369a1)' },
]

export default function FormationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/formations')
    setItems(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ title: item.title, desc: item.desc, duration: item.duration,
      level: item.level, price: item.price, emoji: item.emoji, bg: item.bg, isActive: item.isActive })
    setModalOpen(true)
  }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title || !form.desc) { toast.error('Titre et description requis'); return }
    setSaving(true)
    if (editing) {
      await fetch(`/api/admin/formations/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success('Formation mise à jour')
    } else {
      await fetch('/api/admin/formations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success('Formation créée')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (item: any) => {
    await fetch(`/api/admin/formations/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) })
    toast.success(item.isActive ? 'Désactivée' : 'Activée'); load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/formations/${id}`, { method: 'DELETE' })
    toast.success('Supprimée'); load()
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader title="Formations" desc={`${items.length} formation${items.length !== 1 ? 's' : ''}`}
          action={
            <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Nouvelle formation
            </Button>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_,i) => <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-32" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={GraduationCap} title="Aucune formation" desc="Créez votre première formation"
              action={<Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 text-white"><Plus className="w-4 h-4 mr-1" />Créer</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2" style={{ background: item.bg }} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <p className="font-semibold text-[#001a33] text-sm leading-tight">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.duration} · {item.price}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.isActive ? 'Active' : 'Brouillon'} />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{item.level}</span>
                    <div className="flex gap-1">
                      <button onClick={() => toggle(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-purple-600 transition-colors">
                        {item.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Supprimer cette formation ?</AlertDialogTitle>
                            <AlertDialogDescription>&quot;{item.title}&quot; sera supprimée définitivement.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => del(item.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Modifier' : 'Nouvelle formation'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Titre *</Label><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Marketing Digital" /></div>
            <div className="space-y-1.5"><Label>Description *</Label><Textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} placeholder="Décrivez la formation..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Durée</Label><Input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="1 mois" /></div>
              <div className="space-y-1.5"><Label>Prix</Label><Input value={form.price} onChange={e => set('price', e.target.value)} placeholder="10 000 FCFA" /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Niveau</Label>
              <Select value={form.level} onValueChange={v => set('level', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Emoji</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} type="button" onClick={() => set('emoji', e)}
                    className={`w-9 h-9 text-xl rounded-lg border-2 flex items-center justify-center transition-all ${form.emoji === e ? 'border-[#0099ff] bg-[#0099ff]/10' : 'border-gray-200 hover:border-gray-300'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Couleur de fond</Label>
              <div className="flex gap-2 flex-wrap">
                {BG_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => set('bg', opt.value)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${form.bg === opt.value ? 'border-[#001a33] scale-110' : 'border-transparent'}`}
                    style={{ background: opt.value }} title={opt.label} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Active</Label><p className="text-xs text-gray-400">Visible sur le site</p></div>
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
