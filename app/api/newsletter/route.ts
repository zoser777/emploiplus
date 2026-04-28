import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
export async function GET() {
  const { data, error } = await supabase.from('newsletter').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  const { error } = await supabase.from('newsletter').upsert({ email, is_active: true }, { onConflict: 'email' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
