import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
export async function GET() {
  const [statsRes, jobsRes, candidaturesRes, inscriptionsRes] = await Promise.all([
    supabase.from('site_stats').select('*').order('sort_order', { ascending: true }),
    supabase.from('jobs').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('candidatures').select('id', { count: 'exact' }),
    supabase.from('inscriptions').select('id', { count: 'exact' }),
  ])
  const configStats = statsRes.data || []
  const activeJobs = jobsRes.count || 0
  const totalCandidats = (candidaturesRes.count || 0) + (inscriptionsRes.count || 0)
  const result = [
    { key: 'offres', label: 'Offres actives', value: `${activeJobs}+`, isAuto: true, order: 1 },
    ...configStats.filter((s: any) => !s.is_auto).map((s: any) => ({ key: s.key, label: s.label, value: s.value, isAuto: false, order: s.sort_order, id: s.id })),
    { key: 'candidats', label: 'Candidats inscrits', value: `${totalCandidats}+`, isAuto: true, order: 3 },
  ].sort((a, b) => (a.order || 0) - (b.order || 0))
  return NextResponse.json(result)
}
