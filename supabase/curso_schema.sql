-- Esquema del curso Excel 365 (josedavidgt.com/curso).
-- Vive en el proyecto Supabase "portafolio-victoria" junto a otras tablas,
-- por eso todo lleva el prefijo curso_. El servidor Flask usa la service
-- role key, así que RLS queda activado sin políticas: nadie con la anon key
-- puede leer ni escribir estas tablas.

create table if not exists public.curso_profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  username     text,
  is_admin     boolean not null default false,
  is_approved  boolean not null default false,
  formula_lang text not null default 'es' check (formula_lang in ('es', 'en')),
  created_at   timestamptz not null default now()
);

create table if not exists public.curso_module_permissions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  module_id  text not null,
  enabled    boolean not null default true,
  granted_by uuid,
  created_at timestamptz not null default now(),
  constraint curso_module_permissions_user_module_key unique (user_id, module_id),
  constraint curso_module_permissions_user_id_fkey
    foreign key (user_id) references public.curso_profiles(id) on delete cascade,
  constraint curso_module_permissions_granted_by_fkey
    foreign key (granted_by) references public.curso_profiles(id) on delete set null
);

create table if not exists public.curso_submissions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null,
  module_id         text not null,
  file_path         text not null,
  original_filename text,
  uploaded_at       timestamptz not null default now(),
  grade             text,
  feedback          text,
  reviewed          boolean not null default false,
  reviewed_by       uuid,
  reviewed_at       timestamptz,
  constraint curso_submissions_user_id_fkey
    foreign key (user_id) references public.curso_profiles(id) on delete cascade,
  constraint curso_submissions_reviewed_by_fkey
    foreign key (reviewed_by) references public.curso_profiles(id) on delete set null
);

create table if not exists public.curso_purchases (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null,
  product               text not null,
  amount_cents          integer not null,
  currency              text not null default 'usd',
  stripe_session_id     text unique,
  stripe_payment_intent text,
  status                text not null default 'pending',
  created_at            timestamptz not null default now(),
  completed_at          timestamptz,
  constraint curso_purchases_user_id_fkey
    foreign key (user_id) references public.curso_profiles(id) on delete cascade
);

create index if not exists curso_submissions_user_idx on public.curso_submissions(user_id);
create index if not exists curso_purchases_user_idx   on public.curso_purchases(user_id);

alter table public.curso_profiles           enable row level security;
alter table public.curso_module_permissions enable row level security;
alter table public.curso_submissions        enable row level security;
alter table public.curso_purchases          enable row level security;

-- Bucket privado para las entregas de los alumnos
insert into storage.buckets (id, name, public)
values ('course-submissions', 'course-submissions', false)
on conflict (id) do nothing;
