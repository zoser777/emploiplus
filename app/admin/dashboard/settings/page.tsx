'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/AdminComponents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart3, Mail, Save, RefreshCw, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [stats, setStats] = useState<any[]>([])
  const [newsletter, setNewsletter] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [autoStats, setAutoStats] = useState<any[]>([])
  const [saving, setSaving] = useState<string | null>(null)

  const load = async () => {
    const [statsRes, nlRes, autoRes] = await Promise.all([
      fetch('/api/admin/stats-config').then(r => r.json()),
      fetch('/api/newsletter').then(r => r.json()).catch(() => []),
      fetch('/api/site-stats').then(r => r.json()).catch(() => []),
    ])
    setStats(statsRes)
    setNewsletter(nlRes)
    setAutoStats(autoRes.filter((s: any) => s.isAuto))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const updateStat = async (stat: any) => {
    setSaving(stat.id)
    const res = await fetch(`/api/admin/stats-config/${stat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: stat.value, label: stat.label }),
    })
    if (res.ok) toast.success('Statistique mise à jour')
    else toast.error('Erreur')
    setSaving(null)
  }

  const setStatVal = (id: string, field: string, val: string) => {
    setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <PageHeader title="Paramètres" desc="Configurez les statistiques du site et gérez la newsletter" />

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-20" />)}</div>
        ) : (
          <div className="space-y-8">

            {/* Stats automatiques */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#0099ff]" />
                <h2 className="font-semibold text-[#001a33]">Statistiques — Section Hero</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Les statistiques en <strong>vert</strong> sont calculées automatiquement depuis la base de données. Seules les statistiques manuelles sont modifiables.</p>
                </div>

                {/* Auto stats (read-only) */}
                {autoStats.map(stat => (
                  <div key={stat.key} className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-800">{stat.label}</p>
                      <p className="text-xs text-emerald-600">Calculé automatiquement</p>
                    </div>
                    <span className="text-2xl font-bold text-emerald-700">{stat.value}</span>
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}

                {/* Manual stats (editable) */}
                {stats.map(stat => (
                  <div key={stat.id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 font-medium">Configurable manuellement</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1.5">
                        <Label>Libellé</Label>
                        <Input value={stat.label} onChange={e => setStatVal(stat.id, 'label', e.target.value)} placeholder="Ex: Entreprises partenaires" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Valeur</Label>
                        <Input value={stat.value} onChange={e => setStatVal(stat.id, 'value', e.target.value)} placeholder="Ex: 350+" />
                      </div>
                    </div>
                    <Button size="sm" onClick={() => updateStat(stat)} disabled={saving === stat.id}
                      className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                      {saving === stat.id ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#0099ff]" />
                  <h2 className="font-semibold text-[#001a33]">Abonnés Newsletter</h2>
                </div>
                <span className="bg-[#0099ff]/10 text-[#0099ff] text-sm font-semibold px-3 py-1 rounded-full">
                  {newsletter.length} abonné{newsletter.length !== 1 ? 's' : ''}
                </span>
              </div>
              {newsletter.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Aucun abonné pour le moment</p>
                  <p className="text-xs mt-1">Les inscriptions via le formulaire d&apos;accueil apparaîtront ici</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {newsletter.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0099ff]/10 flex items-center justify-center text-[#0099ff] text-xs font-bold">
                          {sub.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">{sub.email}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {newsletter.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const emails = newsletter.map((s: any) => s.email).join('; ')
                      navigator.clipboard.writeText(emails)
                      toast.success(`${newsletter.length} emails copiés !`)
                    }}
                    className="text-xs">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Copier tous les emails
                  </Button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  )
}
