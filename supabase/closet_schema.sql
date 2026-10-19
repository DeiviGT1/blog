-- Esquema de /closet (josedavidgt.com/closet). Mismo proyecto Supabase que el
-- curso; todo con prefijo closet_. El servidor Flask usa la service role key,
-- así que RLS queda activado SIN políticas: nadie con la anon key puede leer
-- ni escribir estas tablas ni el bucket. Verificar con pg_policies, no con la doc.

-- Quién puede entrar. Por invitación: el correo se agrega antes de que la
-- persona tenga cuenta; user_id se rellena en su primer login.
create table if not exists public.closet_members (
  email        text primary key,
  user_id      uuid unique references auth.users(id) on delete set null,
  display_name text,
  is_admin     boolean not null default false,
  invited_by   text,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);

-- Estado completo de cada persona (perfil, votos, guardados, historial,
-- preferencias, ajustes a las prendas de ejemplo). Un documento por usuario.
create table if not exists public.closet_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  doc        jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Prendas propias (las que sube cada quien). La foto vive en el bucket
-- privado "closet" en <owner_id>/<id>.jpg; photo_path 'static:img/x.png'
-- apunta a una foto de ejemplo del catálogo (cuando marca "La compré").
create table if not exists public.closet_items (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  type        text not null,
  cat         text not null check (cat in ('top', 'bottom', 'shoes', 'layer')),
  name        text not null,
  color       jsonb not null default '{}'::jsonb,
  material    text not null default '',
  formality   smallint not null default 2 check (formality between 1 and 5),
  warmth      smallint not null default 2 check (warmth between 1 and 5),
  photo_path  text,
  removed     boolean not null default false,
  last_worn   date,
  wear_count  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists closet_items_owner_idx on public.closet_items (owner_id) where not removed;

alter table public.closet_members enable row level security;
alter table public.closet_state   enable row level security;
alter table public.closet_items   enable row level security;

-- Bucket privado para las fotos. Sin políticas de storage: solo service role.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('closet', 'closet', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
