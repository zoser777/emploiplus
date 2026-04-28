import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeService } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeService))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { count } = await supabase.from('services').select('*', { count: 'exact', head: true })
  const { data, error } = await supabase.from('services').insert({
    title: body.title,
    description: body.desc || '',
    icon: body.icon || '⚙️',
    sort_order: (count || 0) + 1,
    is_active: body.isActive ?? true,
    updated_at: new Date().toISOString()
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeService(data), { status: 201 })
}
