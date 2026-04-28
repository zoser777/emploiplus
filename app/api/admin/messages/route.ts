import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeMessage } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeMessage))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase
    .from('messages')
    .insert({ name: body.name, email: body.email, phone: body.phone || '',
      subject: body.subject || '', message: body.message, is_read: false })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeMessage(data), { status: 201 })
}
