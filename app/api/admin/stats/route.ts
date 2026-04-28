import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
export async function GET() {
  const [jobs, formations, blog, messages, inscriptions, candidatures, team, services] = await Promise.all([
    supabase.from('jobs').select('is_active', { count: 'exact' }),
    supabase.from('formations').select('is_active', { count: 'exact' }),
    supabase.from('blog_posts').select('is_active', { count: 'exact' }),
    supabase.from('messages').select('is_read', { count: 'exact' }),
    supabase.from('inscriptions').select('status', { count: 'exact' }),
    supabase.from('candidatures').select('status', { count: 'exact' }),
    supabase.from('team').select('id', { count: 'exact' }),
    supabase.from('services').select('id', { count: 'exact' }),
  ])
  const jobsData = jobs.data || []
  const formationsData = formations.data || []
  const blogData = blog.data || []
  const messagesData = messages.data || []
  const inscriptionsData = inscriptions.data || []
  const candidaturesData = candidatures.data || []
  return NextResponse.json({
    jobs: { total: jobs.count || 0, active: jobsData.filter((j: any) => j.is_active).length, draft: jobsData.filter((j: any) => !j.is_active).length },
    formations: { total: formations.count || 0, active: formationsData.filter((f: any) => f.is_active).length },
    blog: { total: blog.count || 0, published: blogData.filter((b: any) => b.is_active).length },
    messages: { total: messages.count || 0, unread: messagesData.filter((m: any) => !m.is_read).length },
    inscriptions: { total: inscriptions.count || 0, pending: inscriptionsData.filter((i: any) => i.status === 'En attente').length },
    candidatures: { total: candidatures.count || 0, pending: candidaturesData.filter((c: any) => c.status === 'En cours').length },
    team: { total: team.count || 0 },
    services: { total: services.count || 0 },
  })
}
