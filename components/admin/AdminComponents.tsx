'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  sub?: string
  trend?: number
}

export function StatCard({ label, value, icon: Icon, color, sub, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-[#001a33] mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={cn("mt-3 text-xs font-medium", trend >= 0 ? "text-emerald-600" : "text-red-500")}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% ce mois
        </div>
      )}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  desc?: string
  action?: React.ReactNode
}

export function PageHeader({ title, desc, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#001a33]">{title}</h1>
        {desc && <p className="text-gray-500 text-sm mt-1">{desc}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, desc, action }: {
  icon: LucideIcon, title: string, desc: string, action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#001a33] mb-1">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-4">{desc}</p>
      {action}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'En cours': 'bg-blue-100 text-blue-700',
    'Entretien': 'bg-yellow-100 text-yellow-700',
    'Accepte': 'bg-emerald-100 text-emerald-700',
    'Refuse': 'bg-red-100 text-red-700',
    'En attente': 'bg-orange-100 text-orange-700',
    'Confirmee': 'bg-emerald-100 text-emerald-700',
    'Annulee': 'bg-gray-100 text-gray-600',
    'Active': 'bg-emerald-100 text-emerald-700',
    'Brouillon': 'bg-gray-100 text-gray-600',
    'Publié': 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", map[status] || 'bg-gray-100 text-gray-600')}>
      {status}
    </span>
  )
}
