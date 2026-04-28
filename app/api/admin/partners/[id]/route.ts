import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizePartner } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = { updated_at: new Date().toISOString() }
  if (body.name !== undefined) update.name = body.name
  if (body.sector !== undefined) update.sector = body.sector
  if (body.logo !== undefined) update.logo = body.logo
  if (body.color !== undefined) update.color = body.color
  if (body.order !== undefined) update.sort_order = body.order
  if (body.isActive !== undefined) update.is_active = body.isActive
  const { data, error } = await supabase.from('partners').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizePartner(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('partners').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
