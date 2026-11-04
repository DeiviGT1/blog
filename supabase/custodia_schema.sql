-- Estado compartido de josedavidgt.com/custodia (reparto de artistas).
-- Mismo patrón que trabajo_a: solo el servidor Flask (service role) lee y
-- escribe; RLS activado sin políticas, así la anon key no puede tocarla.
-- Una fila por artista asignado (clave = nombre), así cambiar la lista de
-- artistas no rompe lo ya repartido.

create table if not exists public.custodia_asignacion (
  caso       text not null,
  artista    text not null check (char_length(artista) <= 80),
  lado       text not null check (lado in ('a', 'b', 'c')),
  updated_at timestamptz not null default now(),
  primary key (caso, artista)
);

alter table public.custodia_asignacion enable row level security;
