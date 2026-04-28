import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizePost } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) update.title = body.title
  if (body.desc !== undefined) update.summary = body.desc
  if (body.content !== undefined) update.content = body.content
  if (body.cat !== undefined) update.cat = body.cat
  if (body.emoji !== undefined) update.emoji = body.emoji
  if (body.bg !== undefined) update.bg = body.bg
  if (body.isActive !== undefined) update.is_active = body.isActive
  const { data, error } = await supabase.from('blog_posts').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizePost(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
