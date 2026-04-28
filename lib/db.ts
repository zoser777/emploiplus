import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Normalizers — mappent les noms de colonnes DB vers les noms utilisés dans le front
export function normalizeJob(j: any): any {
  return { ...j, desc: j.description, isActive: j.is_active, createdAt: j.created_at, updatedAt: j.updated_at }
}
export function normalizeFormation(f: any): any {
  return { ...f, desc: f.description, isActive: f.is_active, createdAt: f.created_at, updatedAt: f.updated_at }
}
export function normalizePost(p: any): any {
  return { ...p, desc: p.summary, isActive: p.is_active, createdAt: p.created_at, updatedAt: p.updated_at }
}
export function normalizeService(s: any): any {
  return { ...s, desc: s.description, order: s.sort_order, isActive: s.is_active, createdAt: s.created_at, updatedAt: s.updated_at }
}
export function normalizeTeam(t: any): any {
  return { ...t, order: t.sort_order, isActive: t.is_active, createdAt: t.created_at, updatedAt: t.updated_at }
}
export function normalizePartner(p: any): any {
  return { ...p, order: p.sort_order, isActive: p.is_active, createdAt: p.created_at, updatedAt: p.updated_at }
}
export function normalizeTestimonial(t: any): any {
  return { ...t, text: t.content, order: t.sort_order, isActive: t.is_active, createdAt: t.created_at, updatedAt: t.updated_at }
}
export function normalizeMessage(m: any): any {
  return { ...m, isRead: m.is_read, createdAt: m.created_at }
}
export function normalizeInscription(i: any): any {
  return { ...i, formationId: i.formation_id, formationTitle: i.formation_title, createdAt: i.created_at }
}
export function normalizeCandidature(c: any): any {
  return { ...c, jobId: c.job_id, jobTitle: c.job_title, coverLetter: c.cover_letter, cvName: c.cv_name, createdAt: c.created_at }
}
export function normalizeStat(s: any): any {
  return { ...s, isAuto: s.is_auto, order: s.sort_order, updatedAt: s.updated_at }
}
