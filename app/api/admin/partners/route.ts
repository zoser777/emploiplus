import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizePartner } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('partners').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizePartner))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { count } = await supabase.from('partners').select('*', { count: 'exact', head: true })
  const { data, error } = await supabase.from('partners').insert({
    name: body.name,
    sector: body.sector || '',
    logo: body.logo || body.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase(),
    color: body.color || '#0099ff',
    sort_order: (count || 0) + 1,
    is_active: body.isActive ?? true,
    updated_at: new Date().toISOString()
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizePartner(data), { status: 201 })
}
