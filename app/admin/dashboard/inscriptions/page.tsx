'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState, StatusBadge } from '@/components/admin/AdminComponents'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserCheck, Trash2, Mail, Phone, MapPin, Clock, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

const STATUSES = ['En attente', 'Confirmee', 'Annulee']

export default function InscriptionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const load = async () => {
    const res = await fetch('/api/admin/inscriptions')
    setItems(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/inscriptions/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    toast.success(`Statut mis à jour: ${status}`)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }))
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/inscriptions/${id}`, { method: 'DELETE' })
    toast.success('Inscription supprimée')
    setItems(prev => prev.filter(i => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = filterStatus === 'all' ? items : items.filter(i => i.status === filterStatus)
  const pending = items.filter(i => i.status === 'En attente').length

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Inscriptions formations"
          desc={pending > 0 ? `${pending} en attente de confirmation` : `${items.length} inscription${items.length !== 1 ? 's' : ''}`}
        />

        {/* Filter */}
        <div className="mb-4 flex items-center gap-3">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filterStatus === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {s === 'all' ? `Tous (${items.length})` : `${s} (${items.filter(i => i.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-16" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={UserCheck} title="Aucune inscription" desc="Les inscriptions aux formations apparaîtront ici" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Candidat</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Formation</th>
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
                        <span className="text-gray-700">{item.formationTitle}</span>
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
                              <AlertDialogHeader><AlertDialogTitle>Supprimer cette inscription ?</AlertDialogTitle>
                                <AlertDialogDescription>L&apos;inscription de {item.name} sera supprimée.</AlertDialogDescription>
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
          <DialogHeader><DialogTitle>Inscription — {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-purple-900">{selected.formationTitle}</p>
                  <p className="text-xs text-purple-600">Formation demandée</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-[#0099ff]" />
                  <a href={`mailto:${selected.email}`} className="text-[#0099ff] hover:underline">{selected.email}</a>
                </div>
                {selected.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-[#0099ff]" /><span>{selected.phone}</span></div>}
                {selected.city && <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /><span>{selected.city}</span></div>}
                <div className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4" /><span className="text-xs">{new Date(selected.createdAt).toLocaleString('fr-FR')}</span></div>
              </div>
              {selected.message && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-700">{selected.message}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500">Changer le statut</p>
                <div className="flex gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${selected.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <a href={`mailto:${selected.email}?subject=Inscription ${selected.formationTitle}`}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-[#0099ff] hover:bg-[#0077cc] text-white rounded-xl text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" />Contacter par email
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
