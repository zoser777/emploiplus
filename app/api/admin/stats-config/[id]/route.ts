import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeStat } from '@/lib/db'
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { data, error } = await supabase.from('site_stats')
    .update({ value: body.value, label: body.label, updated_at: new Date().toISOString() })
    .eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeStat(data))
}
