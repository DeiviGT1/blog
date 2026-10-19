-- Estado compartido de josedavidgt.com/trabajo-a (empleos cerca de Revv).
-- Vive en el proyecto Supabase "portafolio-victoria" con prefijo trabajo_a_.
-- Solo el servidor Flask (service role key) lee y escribe: RLS activado sin
-- políticas, así nadie con la anon key puede tocar la tabla.

create table if not exists public.trabajo_a_estado (
  job_id     text primary key,
  estado     text check (estado in ('aplique', 'entrevista', 'descartada', 'contratada')),
  nota       text check (char_length(nota) <= 1000),
  updated_at timestamptz not null default now()
);

alter table public.trabajo_a_estado enable row level security;
