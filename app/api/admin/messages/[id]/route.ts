import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeMessage } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const update: any = {}
  if (body.isRead !== undefined) update.is_read = body.isRead
  if (body.is_read !== undefined) update.is_read = body.is_read
  const { data, error } = await supabase.from('messages').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeMessage(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('messages').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
