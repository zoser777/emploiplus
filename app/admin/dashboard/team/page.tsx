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
import { Users, Plus, Pencil, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const GRADIENTS = [
  'from-[#0099ff] to-[#001a33]',
  'from-[#f0a500] to-[#dc2626]',
  'from-[#10b981] to-[#059669]',
  'from-[#8b5cf6] to-[#6d28d9]',
  'from-[#ec4899] to-[#be185d]',
  'from-[#06b6d4] to-[#0284c7]',
]
const EMPTY = { name: '', role: '', initials: '', gradient: GRADIENTS[0], bio: '', image_url: '', isActive: true }

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  const load = async () => {
    const res = await fetch('/api/admin/team')
    const d = await res.json(); setMembers(Array.isArray(d) ? d : []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setImagePreview(''); setModalOpen(true) }
  const openEdit = (m: any) => {
    setEditing(m)
    setForm({ name: m.name, role: m.role, initials: m.initials, gradient: m.gradient, bio: m.bio || '', image_url: m.image_url || '', isActive: m.isActive })
    setImagePreview(m.image_url || '')
    setModalOpen(true)
  }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const autoInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  // Convertir image en base64 pour stockage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image trop grande (max 2 Mo)'); return }
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setImagePreview(base64)
      set('image_url', base64)
    }
    reader.readAsDataURL(file)
  }

  const save = async () => {
    if (!form.name || !form.role) { toast.error('Nom et rÃ´le requis'); return }
    const payload = { ...form, initials: form.initials || autoInitials(form.name) }
    setSaving(true)
    if (editing) {
      await fetch(`/api/admin/team/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Membre mis Ã  jour')
    } else {
      await fetch('/api/admin/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Membre ajoutÃ©')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (m: any) => {
    await fetch(`/api/admin/team/${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !m.isActive }) })
    load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
    toast.success('Membre supprimÃ©'); load()
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader title="Ã‰quipe" desc={`${members.length} membre${members.length !== 1 ? 's' : ''} â€” affichÃ© sur la page Ã€ propos`}
          action={
            <Button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Ajouter un membre
            </Button>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-6 animate-pulse h-48" />)}
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={Users} title="Aucun membre" desc="Ajoutez les membres de votre Ã©quipe (affichÃ©s sur la page Ã€ propos)"
              action={<Button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-1" />Ajouter</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map(m => (
              <div key={m.id} className={`bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow ${!m.isActive ? 'opacity-60' : ''}`}>
                {/* Avatar avec image ou initiales */}
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-gray-100" />
                ) : (
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${m.gradient} mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold`}>
                    {m.initials}
                  </div>
                )}
                <p className="font-semibold text-[#001a33] text-sm">{m.name}</p>
                <p className="text-[#0099ff] text-xs mt-0.5">{m.role}</p>
                {m.bio && <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">{m.bio}</p>}
                <div className="flex justify-center gap-1 mt-3">
                  <button onClick={() => toggle(m)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                    {m.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Supprimer {m.name} ?</AlertDialogTitle><AlertDialogDescription>Ce membre sera retirÃ© de l&apos;Ã©quipe.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del(m.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Modifier le membre' : 'Nouveau membre'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {/* AperÃ§u avatar */}
            <div className="flex justify-center">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="AperÃ§u" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" />
                  <button onClick={() => { setImagePreview(''); set('image_url', '') }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${form.gradient} flex items-center justify-center text-white text-2xl font-bold`}>
                  {form.initials || (form.name ? autoInitials(form.name) : '?')}
                </div>
              )}
            </div>

            {/* Upload image */}
            <div className="space-y-1.5">
              <Label>Photo (optionnel)</Label>
              <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Cliquer pour importer une photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <p className="text-xs text-gray-400">JPG, PNG â€” max 2 Mo. Remplace les initiales si prÃ©sente.</p>
            </div>

            <div className="space-y-1.5"><Label>Nom complet *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Jean-Marc Bakala" /></div>
            <div className="space-y-1.5"><Label>Fonction *</Label><Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Ex: Directeur GÃ©nÃ©ral" /></div>
            <div className="space-y-1.5">
              <Label>Initiales <span className="text-gray-400 text-xs">â€” auto si vide</span></Label>
              <Input value={form.initials} onChange={e => set('initials', e.target.value.toUpperCase().slice(0,2))} placeholder="JM" maxLength={2} />
            </div>
            <div className="space-y-1.5"><Label>Bio</Label><Textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={2} placeholder="Courte biographie..." /></div>
            {!imagePreview && (
              <div className="space-y-1.5"><Label>Couleur de fond (si pas de photo)</Label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map(g => (
                    <button key={g} type="button" onClick={() => set('gradient', g)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br border-2 transition-all ${form.gradient === g ? 'border-[#001a33] scale-110' : 'border-transparent'} ${g}`} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div><Label>Visible</Label><p className="text-xs text-gray-400">Sur la page Ã€ propos</p></div>
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre Ã  jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

