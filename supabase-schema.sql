-- ================================================================
-- EMPLOI PLUS — Schéma Supabase complet (corrigé)
-- ================================================================

-- 1. OFFRES D'EMPLOI
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  sector text not null default '',
  city text not null default '',
  type text not null default '',
  exp text not null default '',
  salary text not null default '',
  date text not null default 'Aujourd''hui',
  logo text not null default '',
  color text not null default '#1e6bcf',
  description text not null default '',
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. FORMATIONS
create table if not exists formations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  duration text not null default '1 mois',
  level text not null default 'Tous niveaux',
  price text not null default '',
  emoji text not null default '📚',
  bg text not null default 'linear-gradient(135deg,#0099ff,#001a33)',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. BLOG
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  cat text not null default 'Conseils',
  title text not null,
  summary text not null default '',
  content text not null default '',
  emoji text not null default '📝',
  bg text not null default '#f0fdf4',
  date text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. SERVICES
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '⚙️',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. ÉQUIPE
create table if not exists team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  initials text not null default '',
  gradient text not null default 'from-[#0099ff] to-[#001a33]',
  bio text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. MESSAGES CONTACT
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  subject text not null default '',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. INSCRIPTIONS FORMATIONS
create table if not exists inscriptions (
  id uuid primary key default gen_random_uuid(),
  formation_id text not null,
  formation_title text not null,
  name text not null,
  email text not null,
  phone text not null default '',
  city text not null default '',
  message text not null default '',
  status text not null default 'En attente',
  created_at timestamptz not null default now()
);

-- 8. CANDIDATURES
create table if not exists candidatures (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  job_title text not null,
  company text not null default '',
  name text not null,
  email text not null,
  phone text not null default '',
  cover_letter text not null default '',
  cv_name text not null default '',
  status text not null default 'En cours',
  created_at timestamptz not null default now()
);

-- 9. PARTENAIRES
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null default '',
  logo text not null default '',
  color text not null default '#0099ff',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. TÉMOIGNAGES
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  stars integer not null default 5,
  content text not null,
  initials text not null default '',
  color text not null default '#1e6bcf',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. NEWSLETTER
create table if not exists newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 12. STATISTIQUES CONFIGURABLES
create table if not exists site_stats (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  value text not null,
  is_auto boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ================================================================
-- Désactiver RLS (accès via service_role côté serveur uniquement)
-- ================================================================
alter table jobs disable row level security;
alter table formations disable row level security;
alter table blog_posts disable row level security;
alter table services disable row level security;
alter table team disable row level security;
alter table messages disable row level security;
alter table inscriptions disable row level security;
alter table candidatures disable row level security;
alter table partners disable row level security;
alter table testimonials disable row level security;
alter table newsletter disable row level security;
alter table site_stats disable row level security;

-- ================================================================
-- Données initiales stats
-- ================================================================
insert into site_stats (key, label, value, is_auto, sort_order) values
  ('partenaires', 'Entreprises partenaires', '350+', false, 2),
  ('satisfaction', 'Taux de satisfaction', '95%', false, 4)
on conflict (key) do nothing;
