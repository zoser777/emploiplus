'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState, StatusBadge } from '@/components/admin/AdminComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Building2, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const COLORS = ['#dc2626','#1e3a8a','#f59e0b','#7c3aed','#0284c7','#059669','#374151','#0a2342','#10b981','#f0a500','#0099ff','#001a33']
const EMPTY = { name: '', sector: '', logo: '', color: '#0099ff', isActive: true }

export default function PartnersPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/partners')
    setItems(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const openNew = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ name: item.name, sector: item.sector, logo: item.logo, color: item.color, isActive: item.isActive })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name) { toast.error('Le nom est requis'); return }
    setSaving(true)
    const logo = form.logo || form.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()
    const payload = { ...form, logo }
    if (editing) {
      await fetch(`/api/admin/partners/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Partenaire mis à jour')
    } else {
      await fetch('/api/admin/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Partenaire ajouté')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (item: any) => {
    await fetch(`/api/admin/partners/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) })
    load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })
    toast.success('Partenaire supprimé'); load()
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader title="Partenaires" desc={`${items.length} partenaire${items.length !== 1 ? 's' : ''} — section "Ils nous font confiance"`}
          action={
            <Button onClick={openNew} className="bg-[#001a33] hover:bg-[#002a4d] text-white">
              <Plus className="w-4 h-4 mr-2" />Ajouter un partenaire
            </Button>
          }
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-28" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={Building2} title="Aucun partenaire" desc='Ajoutez vos entreprises partenaires (section "Ils nous font confiance")'
              action={<Button onClick={openNew} className="bg-[#001a33] text-white"><Plus className="w-4 h-4 mr-1" />Ajouter</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className={`bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow ${!item.isActive ? 'opacity-50' : ''}`}>
                <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center font-bold text-white text-lg"
                  style={{ backgroundColor: item.color }}>
                  {item.logo}
                </div>
                <p className="font-semibold text-[#001a33] text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs mb-3">{item.sector}</p>
                <div className="flex justify-center gap-1">
                  <button onClick={() => toggle(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#0099ff] transition-colors">
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
                      <AlertDialogHeader><AlertDialogTitle>Supprimer {item.name} ?</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del(item.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Modifier le partenaire' : 'Nouveau partenaire'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: form.color }}>
                {form.logo || (form.name ? form.name.split(' ').map((w: string) => w[0]).join('').substring(0,2).toUpperCase() : '?')}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Nom de l&apos;entreprise *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: TotalEnergies Congo" /></div>
            <div className="space-y-1.5"><Label>Secteur</Label><Input value={form.sector} onChange={e => set('sector', e.target.value)} placeholder="Ex: Énergie" /></div>
            <div className="space-y-1.5"><Label>Logo (2 lettres) <span className="text-gray-400 text-xs">— auto si vide</span></Label><Input value={form.logo} onChange={e => set('logo', e.target.value.toUpperCase().slice(0,2))} placeholder="Ex: TE" maxLength={2} /></div>
            <div className="space-y-1.5"><Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set('color', c)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${form.color === c ? 'border-[#001a33] scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Visible</Label><p className="text-xs text-gray-400">Sur la page d&apos;accueil</p></div>
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-[#001a33] hover:bg-[#002a4d] text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
