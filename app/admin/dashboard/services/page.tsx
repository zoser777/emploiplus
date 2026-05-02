'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState, StatusBadge } from '@/components/admin/AdminComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Settings, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const EMPTY = { title: '', desc: '', icon: 'âš™ï¸', isActive: true }
const ICONS = ['âš™ï¸','ðŸ’¼','ðŸ”','ðŸŽ“','ðŸ‘¥','ðŸ¢','ðŸ“Š','ðŸ’¡','ðŸŒ','ðŸš€','ðŸ“±','ðŸ¤','ðŸ“‹','âœ…','ðŸŽ¯']

export default function ServicesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/services')
    const d = await res.json(); setItems(Array.isArray(d) ? d : []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ title: item.title, desc: item.desc, icon: item.icon, isActive: item.isActive })
    setModalOpen(true)
  }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title || !form.desc) { toast.error('Titre et description requis'); return }
    setSaving(true)
    if (editing) {
      await fetch(`/api/admin/services/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success('Service mis à jour')
    } else {
      await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success('Service créé')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (item: any) => {
    await fetch(`/api/admin/services/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) })
    load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    toast.success('Service supprimé'); load()
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader title="Services" desc={`${items.length} service${items.length !== 1 ? 's' : ''}`}
          action={
            <Button onClick={openNew} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Nouveau service
            </Button>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-24" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={Settings} title="Aucun service" desc="Ajoutez vos services"
              action={<Button onClick={openNew} className="bg-teal-600 hover:bg-teal-700 text-white"><Plus className="w-4 h-4 mr-1" />Ajouter</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-[#001a33]">{item.title}</p>
                        <StatusBadge status={item.isActive ? 'Active' : 'Brouillon'} />
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button onClick={() => toggle(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-teal-600 transition-colors">
                      {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
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
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Modifier le service' : 'Nouveau service'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Titre *</Label><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Publication d'offres" /></div>
            <div className="space-y-1.5"><Label>Description *</Label><Textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} placeholder="Décrivez ce service..." /></div>
            <div className="space-y-1.5"><Label>Icône</Label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => set('icon', ic)}
                    className={`w-9 h-9 text-xl rounded-lg border-2 flex items-center justify-center transition-all ${form.icon === ic ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Actif</Label><p className="text-xs text-gray-400">Visible sur le site</p></div>
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

