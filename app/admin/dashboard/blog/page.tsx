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
import { Newspaper, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const EMPTY = { title: '', desc: '', content: '', cat: 'Conseils', emoji: '📝', bg: '#f0fdf4', isActive: true }
const CATEGORIES = ['Conseils CV','Entretien','Marché','Formation','Conseils','Emploi','Actualité']
const EMOJIS = ['📝','📄','🎤','📊','💡','🌍','🔍','📱','💼','🏆','📈','✉️']
const BG_COLORS = ['#f0fdf4','#eff6ff','#fefce8','#fdf4ff','#fff7ed','#f0f9ff','#fef2f2','#f8fafc']

export default function BlogPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/blog')
    setItems(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ title: item.title, desc: item.desc, content: item.content || '',
      cat: item.cat, emoji: item.emoji, bg: item.bg, isActive: item.isActive })
    setModalOpen(true)
  }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title || !form.desc) { toast.error('Titre et résumé requis'); return }
    setSaving(true)
    if (editing) {
      await fetch(`/api/admin/blog/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success('Article mis à jour')
    } else {
      await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success('Article créé')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (item: any) => {
    await fetch(`/api/admin/blog/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) })
    toast.success(item.isActive ? 'Dépublié' : 'Publié'); load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    toast.success('Article supprimé'); load()
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader title="Blog" desc={`${items.length} article${items.length !== 1 ? 's' : ''}`}
          action={
            <Button onClick={openNew} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" />Nouvel article
            </Button>
          }
        />

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-20" />)}</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={Newspaper} title="Aucun article" desc="Publiez votre premier article de blog"
              action={<Button onClick={openNew} className="bg-amber-500 hover:bg-amber-600 text-white"><Plus className="w-4 h-4 mr-1" />Créer</Button>} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Article</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Catégorie</th>
                    <th className="text-left px-4 py-3 font-medium">Statut</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <div>
                            <p className="font-medium text-[#001a33] truncate max-w-xs">{item.title}</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{item.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">{item.cat}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={item.isActive ? 'Publié' : 'Brouillon'} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => toggle(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors">
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
                              <AlertDialogHeader><AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
                                <AlertDialogDescription>&quot;{item.title}&quot; sera supprimé définitivement.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => del(item.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Modifier l\'article' : 'Nouvel article'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Titre *</Label><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Titre de l'article" /></div>
            <div className="space-y-1.5"><Label>Catégorie</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => set('cat', c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${form.cat === c ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Résumé *</Label><Textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={2} placeholder="Résumé court affiché dans la liste..." /></div>
            <div className="space-y-1.5"><Label>Contenu</Label><Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={6} placeholder="Contenu complet de l'article..." /></div>
            <div className="space-y-1.5"><Label>Emoji</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} type="button" onClick={() => set('emoji', e)}
                    className={`w-9 h-9 text-xl rounded-lg border-2 flex items-center justify-center transition-all ${form.emoji === e ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Couleur de fond</Label>
              <div className="flex gap-2 flex-wrap">
                {BG_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set('bg', c)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${form.bg === c ? 'border-[#001a33] scale-110' : 'border-gray-300'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Publier</Label><p className="text-xs text-gray-400">Visible sur le blog</p></div>
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Publier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
