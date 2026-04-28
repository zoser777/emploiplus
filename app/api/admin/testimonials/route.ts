import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeTestimonial } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeTestimonial))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { count } = await supabase.from('testimonials').select('*', { count: 'exact', head: true })
  const initials = body.initials || body.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()
  const { data, error } = await supabase.from('testimonials').insert({
    name: body.name,
    role: body.role || '',
    stars: body.stars || 5,
    content: body.text || '',
    initials,
    color: body.color || '#1e6bcf',
    sort_order: (count || 0) + 1,
    is_active: body.isActive ?? true,
    updated_at: new Date().toISOString()
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeTestimonial(data), { status: 201 })
}
