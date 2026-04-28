'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState, StatusBadge } from '@/components/admin/AdminComponents'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Briefcase, Trash2, Mail, Phone, Clock, FileText } from 'lucide-react'
import { toast } from 'sonner'

const STATUSES = ['En cours', 'Entretien', 'Accepte', 'Refuse']

export default function CandidaturesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const load = async () => {
    const res = await fetch('/api/candidatures')
    setItems(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/candidatures/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    toast.success(`Statut: ${status}`)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }))
  }

  const del = async (id: string) => {
    await fetch(`/api/candidatures/${id}`, { method: 'DELETE' })
    toast.success('Candidature supprimée')
    setItems(prev => prev.filter(i => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = filterStatus === 'all' ? items : items.filter(i => i.status === filterStatus)
  const pending = items.filter(i => i.status === 'En cours').length

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Candidatures"
          desc={pending > 0 ? `${pending} en cours de traitement` : `${items.length} candidature${items.length !== 1 ? 's' : ''}`}
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filterStatus === s ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
              {s === 'all' ? `Tous (${items.length})` : `${s} (${items.filter(i => i.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-16" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={Briefcase} title="Aucune candidature" desc="Les candidatures aux offres apparaîtront ici" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Candidat</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Poste</th>
                    <th className="text-left px-4 py-3 font-medium">Statut</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelected(item)}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#001a33]">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-gray-700 truncate max-w-[200px]">{item.jobTitle}</p>
                        <p className="text-xs text-gray-400">{item.company}</p>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <Select value={item.status} onValueChange={v => updateStatus(item.id, v)}>
                          <SelectTrigger className="h-7 text-xs w-36 border-0 bg-transparent p-0 focus:ring-0">
                            <SelectValue><StatusBadge status={item.status} /></SelectValue>
                          </SelectTrigger>
                          <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Supprimer cette candidature ?</AlertDialogTitle>
                                <AlertDialogDescription>La candidature de {item.name} sera définitivement supprimée.</AlertDialogDescription>
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

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Candidature — {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{selected.jobTitle}</p>
                  <p className="text-xs text-emerald-600">{selected.company}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-[#0099ff]" />
                  <a href={`mailto:${selected.email}`} className="text-[#0099ff] hover:underline">{selected.email}</a>
                </div>
                {selected.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-[#0099ff]" /><span>{selected.phone}</span></div>}
                {selected.cvName && <div className="flex items-center gap-2 text-gray-600"><FileText className="w-4 h-4 text-gray-400" /><span className="text-xs">{selected.cvName}</span></div>}
                <div className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4" /><span className="text-xs">{new Date(selected.createdAt).toLocaleString('fr-FR')}</span></div>
              </div>
              {selected.coverLetter && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Lettre de motivation</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">{selected.coverLetter}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500">Changer le statut</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all border ${selected.status === s ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: Candidature ${selected.jobTitle}`}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-[#0099ff] hover:bg-[#0077cc] text-white rounded-xl text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" />Contacter le candidat
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
