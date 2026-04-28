'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Briefcase, GraduationCap, Newspaper,
  Settings, Users, MessageSquare, UserCheck, LogOut,
  Menu, X, ChevronRight, Bell, Building2, Star, Mail, SlidersHorizontal
} from 'lucide-react'
import { useAdminStore } from '@/lib/admin-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble', badge: null },
  { href: '/admin/dashboard/jobs', icon: Briefcase, label: 'Offres d\'emploi', badge: null },
  { href: '/admin/dashboard/formations', icon: GraduationCap, label: 'Formations', badge: null },
  { href: '/admin/dashboard/blog', icon: Newspaper, label: 'Blog', badge: null },
  { href: '/admin/dashboard/services', icon: Settings, label: 'Services', badge: null },
  { href: '/admin/dashboard/partners', icon: Building2, label: 'Partenaires', badge: null },
  { href: '/admin/dashboard/team', icon: Users, label: 'Équipe', badge: null },
  { href: '/admin/dashboard/testimonials', icon: Star, label: 'Témoignages', badge: null },
  { href: '/admin/dashboard/messages', icon: MessageSquare, label: 'Messages', badge: 'messages' },
  { href: '/admin/dashboard/inscriptions', icon: UserCheck, label: 'Inscriptions', badge: 'inscriptions' },
  { href: '/admin/dashboard/candidatures', icon: Briefcase, label: 'Candidatures', badge: 'candidatures' },
  { href: '/admin/dashboard/settings', icon: SlidersHorizontal, label: 'Stats & Newsletter', badge: 'newsletter' },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdminAuthenticated, adminLogout } = useAdminStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!isAdminAuthenticated) router.push('/admin')
  }, [isAdminAuthenticated, router])

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [pathname])

  const handleLogout = () => {
    adminLogout()
    toast.success('Déconnexion réussie')
    router.push('/admin')
  }

  if (!isAdminAuthenticated) return null

  const getBadge = (key: string | null) => {
    if (!key || !stats) return null
    if (key === 'messages') return stats.messages?.unread || null
    if (key === 'inscriptions') return stats.inscriptions?.pending || null
    if (key === 'candidatures') return stats.candidatures?.pending || null
    return null
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={cn('flex flex-col h-full bg-[#001a33] text-white', mobile ? 'w-72' : 'w-64')}>
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/">
          <Image src="/images/logo.jpeg" alt="Emploi Plus" width={130} height={48}
            className="h-10 w-auto object-contain brightness-0 invert" />
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="px-6 py-2.5">
        <span className="text-[10px] uppercase tracking-widest text-[#00c3ff] font-bold">Administration</span>
      </div>
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href
          const badge = getBadge(item.badge)
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active ? 'bg-[#0099ff] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge ? (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{badge}</span>
              ) : active ? <ChevronRight className="w-3 h-3 opacity-60" /> : null}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
          <ChevronRight className="w-4 h-4 rotate-180" /><span>Voir le site</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /><span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden md:flex flex-col h-full"><Sidebar /></div>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full"><Sidebar mobile /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-gray-500">Tableau de bord</p>
              <p className="text-sm font-semibold text-[#001a33]">Emploi Plus — Back-office</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stats && (stats.messages?.unread > 0 || stats.inscriptions?.pending > 0) && (
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {(stats.messages?.unread || 0) + (stats.inscriptions?.pending || 0)}
                </span>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0099ff] to-[#001a33] flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
