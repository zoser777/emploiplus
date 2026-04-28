import { NextResponse } from 'next/server'
import { supabase, normalizeTeam } from '@/lib/db'
export async function GET() {
  const { data, error } = await supabase.from('team').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeTeam))
}
