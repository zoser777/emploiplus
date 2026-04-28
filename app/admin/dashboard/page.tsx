'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatCard } from '@/components/admin/AdminComponents'
import {
  Briefcase, GraduationCap, MessageSquare,
  UserCheck, Newspaper, Users, Settings, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
  jobs: { total: number; active: number; draft: number }
  formations: { total: number; active: number }
  blog: { total: number; published: number }
  messages: { total: number; unread: number }
  inscriptions: { total: number; pending: number }
  candidatures: { total: number; pending: number }
  team: { total: number }
  services: { total: number }
}

interface RecentItem {
  id: string; label: string; sub: string; date: string; type: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, msgsRes, inscrRes, candidRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/messages'),
          fetch('/api/admin/inscriptions'),
          fetch('/api/candidatures'),
        ])
        const [s, msgs, inscr, candid] = await Promise.all([
          statsRes.json(), msgsRes.json(), inscrRes.json(), candidRes.json()
        ])
        setStats(s)
        const items: RecentItem[] = [
          ...msgs.slice(0, 3).map((m: any) => ({
            id: m.id, label: m.name, sub: m.subject || 'Message de contact',
            date: m.createdAt, type: 'message'
          })),
          ...inscr.slice(0, 3).map((i: any) => ({
            id: i.id, label: i.name, sub: `Inscription: ${i.formationTitle}`,
            date: i.createdAt, type: 'inscription'
          })),
          ...candid.slice(0, 3).map((c: any) => ({
            id: c.id, label: c.name, sub: `Candidature: ${c.jobTitle}`,
            date: c.createdAt, type: 'candidature'
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
        setRecent(items)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    load()
  }, [])

  const typeLink: Record<string,string> = {
    message: '/admin/dashboard/messages',
    inscription: '/admin/dashboard/inscriptions',
    candidature: '/admin/dashboard/candidatures',
  }
  const typeColor: Record<string,string> = {
    message: 'bg-blue-100 text-blue-600',
    inscription: 'bg-purple-100 text-purple-600',
    candidature: 'bg-emerald-100 text-emerald-600',
  }
  const typeLabel: Record<string,string> = {
    message: 'Message', inscription: 'Inscription', candidature: 'Candidature',
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#001a33]">Bonjour 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Voici un aperçu de votre plateforme Emploi Plus</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Offres actives" value={stats.jobs.active} icon={Briefcase} color="bg-[#0099ff]" sub={`${stats.jobs.total} total`} />
              <StatCard label="Formations" value={stats.formations.active} icon={GraduationCap} color="bg-purple-500" sub={`${stats.formations.total} total`} />
              <StatCard label="Articles blog" value={stats.blog.published} icon={Newspaper} color="bg-amber-500" sub={`${stats.blog.total} total`} />
              <StatCard label="Services" value={stats.services.total} icon={Settings} color="bg-teal-500" />
              <StatCard label="Messages non lus" value={stats.messages.unread} icon={MessageSquare} color="bg-red-500" sub={`${stats.messages.total} total`} />
              <StatCard label="Inscriptions" value={stats.inscriptions.pending} icon={UserCheck} color="bg-orange-500" sub="En attente" />
              <StatCard label="Candidatures" value={stats.candidatures.pending} icon={TrendingUp} color="bg-emerald-500" sub="En cours" />
              <StatCard label="Équipe" value={stats.team.total} icon={Users} color="bg-indigo-500" sub="membres" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#001a33]">Activité récente</h2>
                </div>
                {recent.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Aucune activité pour l&apos;instant</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {recent.map(item => (
                      <Link key={item.id} href={typeLink[item.type]}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${typeColor[item.type]}`}>
                          {typeLabel[item.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#001a33] truncate">{item.label}</p>
                          <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#001a33]">Actions rapides</h2>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { href: '/admin/dashboard/jobs', label: '+ Nouvelle offre d\'emploi', color: 'bg-[#0099ff]/10 text-[#0099ff] hover:bg-[#0099ff]/20' },
                    { href: '/admin/dashboard/formations', label: '+ Nouvelle formation', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
                    { href: '/admin/dashboard/blog', label: '+ Nouvel article', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
                    { href: '/admin/dashboard/services', label: '+ Nouveau service', color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
                    { href: '/admin/dashboard/team', label: '+ Membre d\'équipe', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
                    { href: '/admin/dashboard/messages', label: '📨 Voir les messages', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
                  ].map(link => (
                    <Link key={link.href} href={link.href}
                      className={`block w-full text-sm font-medium px-4 py-2.5 rounded-lg transition-colors ${link.color}`}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Erreur de chargement</p>
        )}
      </div>
    </AdminLayout>
  )
}
