import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeJob } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase
    .from('jobs').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeJob))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const now = new Date().toISOString()
  const { data, error } = await supabase.from('jobs').insert({
    title: body.title,
    company: body.company,
    sector: body.sector || '',
    city: body.city || '',
    type: body.type || '',
    exp: body.exp || '',
    salary: body.salary || '',
    description: body.desc || '',
    logo: body.logo || body.company?.substring(0, 2).toUpperCase() || '',
    color: body.color || '#1e6bcf',
    tags: body.tags || [],
    date: "Aujourd'hui",
    is_active: body.isActive ?? true,
    updated_at: now,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeJob(data), { status: 201 })
}
