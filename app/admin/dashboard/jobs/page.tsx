'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState, StatusBadge } from '@/components/admin/AdminComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Briefcase, Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import { SECTORS, CONTRACT_TYPES, EXPERIENCE_LEVELS, CITIES } from '@/lib/data'
import { toast } from 'sonner'

const EMPTY_FORM = {
  title: '', company: '', sector: '', city: '', type: '', exp: '',
  salary: '', desc: '', logo: '', color: '#1e6bcf', tags: [] as string[], isActive: true,
}

const COLORS = ['#1e6bcf','#0a2342','#10b981','#f0a500','#7c3aed','#dc2626','#059669','#2563eb']

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/jobs')
    setJobs(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setTagInput(''); setModalOpen(true) }
  const openEdit = (job: any) => {
    setEditing(job)
    setForm({ title: job.title, company: job.company, sector: job.sector, city: job.city,
      type: job.type, exp: job.exp, salary: job.salary, desc: job.desc,
      logo: job.logo, color: job.color, tags: job.tags || [], isActive: job.isActive })
    setTagInput('')
    setModalOpen(true)
  }

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set('tags', [...form.tags, tagInput.trim()]); setTagInput('')
    }
  }

  const save = async () => {
    if (!form.title || !form.company || !form.sector || !form.city || !form.type || !form.exp) {
      toast.error('Remplissez les champs obligatoires'); return
    }
    setSaving(true)
    const logo = form.logo || (form.company.split(' ').length >= 2
      ? (form.company.split(' ')[0][0] + form.company.split(' ')[1][0]).toUpperCase()
      : form.company.substring(0, 2).toUpperCase())
    const payload = { ...form, logo }

    if (editing) {
      await fetch(`/api/admin/jobs/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Offre mise à jour')
    } else {
      await fetch('/api/admin/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      toast.success('Offre créée')
    }
    setSaving(false); setModalOpen(false); load()
  }

  const toggle = async (job: any) => {
    await fetch(`/api/admin/jobs/${job.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !job.isActive })
    })
    toast.success(job.isActive ? 'Offre désactivée' : 'Offre activée'); load()
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
    toast.success('Offre supprimée'); load()
  }

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Offres d'emploi"
          desc={`${jobs.length} offre${jobs.length !== 1 ? 's' : ''} au total`}
          action={
            <Button onClick={openNew} className="bg-[#0099ff] hover:bg-[#0077cc] text-white">
              <Plus className="w-4 h-4 mr-2" />Nouvelle offre
            </Button>
          }
        />

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9" />
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_,i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={Briefcase} title="Aucune offre" desc="Créez votre première offre d'emploi"
              action={<Button onClick={openNew} className="bg-[#0099ff] hover:bg-[#0077cc] text-white"><Plus className="w-4 h-4 mr-1" />Créer</Button>} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Poste</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Entreprise</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Ville</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3 font-medium">Statut</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: job.color }}>
                            {job.logo}
                          </div>
                          <span className="font-medium text-[#001a33] truncate max-w-[200px]">{job.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{job.company}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{job.city}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.isActive ? 'Active' : 'Brouillon'} />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                        {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggle(job)} title={job.isActive ? 'Désactiver' : 'Activer'}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#0099ff] transition-colors">
                            {job.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEdit(job)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-500 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette offre ?</AlertDialogTitle>
                                <AlertDialogDescription>Action irréversible. &quot;{job.title}&quot; sera supprimée définitivement.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => del(job.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
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

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Modifier l\'offre' : 'Nouvelle offre d\'emploi'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Titre du poste *</Label>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Développeur Web Full Stack" />
              </div>
              <div className="space-y-1.5">
                <Label>Entreprise *</Label>
                <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Ex: TechCongo SARL" />
              </div>
              <div className="space-y-1.5">
                <Label>Secteur *</Label>
                <select value={form.sector} onChange={e => set('sector', e.target.value)}
                  className="w-full h-10 border border-input rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0099ff] focus:border-transparent cursor-pointer">
                  <option value="">Sélectionner un secteur</option>
                  {SECTORS.filter(s => s.key !== 'all').map(s => (
                    <option key={s.key} value={s.value}>{s.icon} {s.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Ville *</Label>
                <Select value={form.city} onValueChange={v => set('city', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={v => set('type', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{CONTRACT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Expérience *</Label>
                <Select value={form.exp} onValueChange={v => set('exp', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{EXPERIENCE_LEVELS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Salaire</Label>
                <Input value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="Ex: 300 000 FCFA" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} placeholder="Décrivez le poste..." />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Compétences / Tags</Label>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() }}}
                    placeholder="Ajouter (Entrée pour valider)" />
                  <Button type="button" variant="outline" onClick={addTag}>+</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(t => (
                      <span key={t} onClick={() => set('tags', form.tags.filter(x => x !== t))}
                        className="px-2 py-0.5 bg-gray-100 rounded-full text-xs cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors">
                        {t} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Couleur</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => set('color', c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${form.color === c ? 'border-[#001a33] scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Publier immédiatement</Label>
                  <p className="text-xs text-gray-400">Visible sur le site</p>
                </div>
                <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save} disabled={saving} className="bg-[#0099ff] hover:bg-[#0077cc] text-white">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer l\'offre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
