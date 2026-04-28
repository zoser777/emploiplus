import { NextResponse } from 'next/server'
import { supabase, normalizePartner } from '@/lib/db'
export async function GET() {
  const { data, error } = await supabase.from('partners').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizePartner))
}
