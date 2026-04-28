import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeService } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) update.title = body.title
  if (body.desc !== undefined) update.description = body.desc
  if (body.icon !== undefined) update.icon = body.icon
  if (body.order !== undefined) update.sort_order = body.order
  if (body.isActive !== undefined) update.is_active = body.isActive
  const { data, error } = await supabase.from('services').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeService(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('services').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
