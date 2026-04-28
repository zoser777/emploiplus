import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, subject, message } = body
  if (!name || !email || !message) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  const { error } = await supabase.from('messages')
    .insert({ name, email, phone: phone || '', subject: subject || '', message, is_read: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
