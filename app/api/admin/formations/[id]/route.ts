import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeFormation } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) update.title = body.title
  if (body.desc !== undefined) update.description = body.desc
  if (body.duration !== undefined) update.duration = body.duration
  if (body.level !== undefined) update.level = body.level
  if (body.price !== undefined) update.price = body.price
  if (body.emoji !== undefined) update.emoji = body.emoji
  if (body.bg !== undefined) update.bg = body.bg
  if (body.isActive !== undefined) update.is_active = body.isActive
  const { data, error } = await supabase.from('formations').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeFormation(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('formations').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
