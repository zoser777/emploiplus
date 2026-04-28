import { NextResponse } from 'next/server'
import { supabase, normalizeStat } from '@/lib/db'
export async function GET() {
  const { data, error } = await supabase.from('site_stats').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeStat))
}
