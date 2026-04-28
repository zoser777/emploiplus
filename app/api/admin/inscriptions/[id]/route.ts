import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeInscription } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { data, error } = await supabase.from('inscriptions').update({ status: body.status }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeInscription(data))
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('inscriptions').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
