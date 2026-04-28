import { NextResponse } from 'next/server'
import { supabase, normalizePost } from '@/lib/db'
export async function GET() {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizePost))
}
