import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeFormation } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('formations').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeFormation))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase.from('formations').insert({
    title: body.title,
    description: body.desc || '',
    duration: body.duration,
    level: body.level,
    price: body.price,
    emoji: body.emoji,
    bg: body.bg,
    is_active: body.isActive ?? true,
    updated_at: new Date().toISOString()
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeFormation(data), { status: 201 })
}
