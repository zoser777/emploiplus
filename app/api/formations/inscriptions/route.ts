import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { formationId, formationTitle, name, email, phone, city, message } = body
  if (!formationId || !name || !email) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  const { error } = await supabase.from('inscriptions').insert({
    formation_id: String(formationId), formation_title: formationTitle || '',
    name, email, phone: phone || '', city: city || '', message: message || '', status: 'En attente'
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
