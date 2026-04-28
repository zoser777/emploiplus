import { NextRequest, NextResponse } from 'next/server'
import { supabase, normalizeCandidature } from '@/lib/db'

export async function GET() {
  const { data, error } = await supabase.from('candidatures').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(normalizeCandidature))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { jobId, jobTitle, company, name, email, phone, coverLetter, cvName } = body
  if (!jobId || !name || !email) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  const { error } = await supabase.from('candidatures').insert({
    job_id: String(jobId), job_title: jobTitle || '', company: company || '',
    name, email, phone: phone || '', cover_letter: coverLetter || '', cv_name: cvName || '', status: 'En cours'
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
