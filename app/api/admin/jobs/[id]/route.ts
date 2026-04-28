import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeJob } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from('jobs').select('*').eq('id', params.id).single()
  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(normalizeJob(data))
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) update.title = body.title
  if (body.company !== undefined) update.company = body.company
  if (body.sector !== undefined) update.sector = body.sector
  if (body.city !== undefined) update.city = body.city
  if (body.type !== undefined) update.type = body.type
  if (body.exp !== undefined) update.exp = body.exp
  if (body.salary !== undefined) update.salary = body.salary
  if (body.desc !== undefined) update.description = body.desc
  if (body.logo !== undefined) update.logo = body.logo
  if (body.color !== undefined) update.color = body.color
  if (body.tags !== undefined) update.tags = body.tags
  if (body.isActive !== undefined) update.is_active = body.isActive
  const { data, error } = await supabase.from('jobs').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeJob(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('jobs').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
