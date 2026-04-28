import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeTeam } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = { updated_at: new Date().toISOString() }
  if (body.name !== undefined) update.name = body.name
  if (body.role !== undefined) update.role = body.role
  if (body.initials !== undefined) update.initials = body.initials
  if (body.gradient !== undefined) update.gradient = body.gradient
  if (body.bio !== undefined) update.bio = body.bio
  if (body.image_url !== undefined) update.image_url = body.image_url
  if (body.order !== undefined) update.sort_order = body.order
  if (body.isActive !== undefined) update.is_active = body.isActive
  const { data, error } = await supabase.from('team').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeTeam(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('team').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
