import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeTeam } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('team').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeTeam))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { count } = await supabase.from('team').select('*', { count: 'exact', head: true })
  const { data, error } = await supabase.from('team').insert({
    name: body.name,
    role: body.role,
    initials: body.initials || body.name.substring(0, 2).toUpperCase(),
    gradient: body.gradient || 'from-[#0099ff] to-[#001a33]',
    bio: body.bio || '',
    image_url: body.image_url || '',
    sort_order: (count || 0) + 1,
    is_active: body.isActive ?? true,
    updated_at: new Date().toISOString()
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeTeam(data), { status: 201 })
}
