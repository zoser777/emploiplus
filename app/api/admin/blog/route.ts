import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizePost } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizePost))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase.from('blog_posts').insert({
    title: body.title,
    summary: body.desc || '',
    content: body.content || '',
    cat: body.cat,
    emoji: body.emoji,
    bg: body.bg,
    is_active: body.isActive ?? true,
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    updated_at: new Date().toISOString()
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizePost(data), { status: 201 })
}
