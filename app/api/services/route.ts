import { NextResponse } from 'next/server'
import { supabase, normalizeService } from '@/lib/db'
export async function GET() {
  const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeService))
}
