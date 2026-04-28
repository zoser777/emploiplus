import { NextResponse } from 'next/server'
import { supabase, normalizeInscription } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeInscription))
}
