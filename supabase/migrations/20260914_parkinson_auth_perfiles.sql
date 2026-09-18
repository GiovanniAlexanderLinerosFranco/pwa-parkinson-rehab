-- =============================================================================
-- Cadencia Auth: perfiles en schema parkinson (galf-core-hub)
-- Idempotente. NO toca public (TrainAIfit / BioGALF / Cudoku).
-- =============================================================================

create schema if not exists parkinson;

grant usage on schema parkinson to postgres, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- perfiles (cuenta de la PWA)
-- -----------------------------------------------------------------------------
create table if not exists parkinson.perfiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete cascade,
  nombre_mostrar text not null,
  email text unique not null,
  rol text not null default 'fisioterapeuta'
    check (rol in ('fisioterapeuta', 'paciente', 'cuidador')),
  plan text not null default 'piloto'
    check (plan in ('piloto', 'free', 'pro')),
  pro_expires_at timestamptz,
  verificado boolean not null default false,
  idioma_preferido text default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table parkinson.perfiles
  add column if not exists auth_user_id uuid;
alter table parkinson.perfiles
  add column if not exists nombre_mostrar text;
alter table parkinson.perfiles
  add column if not exists email text;
alter table parkinson.perfiles
  add column if not exists rol text;
alter table parkinson.perfiles
  add column if not exists plan text;
alter table parkinson.perfiles
  add column if not exists pro_expires_at timestamptz;
alter table parkinson.perfiles
  add column if not exists verificado boolean not null default false;
alter table parkinson.perfiles
  add column if not exists idioma_preferido text default 'es';
alter table parkinson.perfiles
  add column if not exists updated_at timestamptz not null default now();

create index if not exists perfiles_auth_user_id_idx
  on parkinson.perfiles (auth_user_id);
create index if not exists perfiles_email_idx
  on parkinson.perfiles (email);

-- Vincular valoraciones al usuario Auth
alter table parkinson.valoraciones_parkinson
  add column if not exists auth_user_id uuid references auth.users (id) on delete set null;
alter table parkinson.valoraciones_parkinson
  add column if not exists perfil_id uuid references parkinson.perfiles (id) on delete set null;

create index if not exists valoraciones_parkinson_auth_user_id_idx
  on parkinson.valoraciones_parkinson (auth_user_id);

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------
grant select, insert, update, delete on all tables in schema parkinson to authenticated, service_role;
grant select on all tables in schema parkinson to anon;
grant usage, select on all sequences in schema parkinson to anon, authenticated, service_role;

alter default privileges in schema parkinson
  grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema parkinson
  grant select on tables to anon;

-- -----------------------------------------------------------------------------
-- RLS perfiles
-- -----------------------------------------------------------------------------
alter table parkinson.perfiles enable row level security;

drop policy if exists perfiles_select_own on parkinson.perfiles;
create policy perfiles_select_own
  on parkinson.perfiles for select
  to authenticated
  using (auth.uid() = auth_user_id);

drop policy if exists perfiles_update_own on parkinson.perfiles;
create policy perfiles_update_own
  on parkinson.perfiles for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists perfiles_service_all on parkinson.perfiles;
create policy perfiles_service_all
  on parkinson.perfiles for all
  to service_role
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- RLS valoraciones: dueño autenticado (retirar anon abierto)
-- -----------------------------------------------------------------------------
alter table parkinson.valoraciones_parkinson enable row level security;

drop policy if exists valoraciones_parkinson_anon_insert on parkinson.valoraciones_parkinson;
drop policy if exists valoraciones_parkinson_anon_select on parkinson.valoraciones_parkinson;

drop policy if exists valoraciones_select_own on parkinson.valoraciones_parkinson;
create policy valoraciones_select_own
  on parkinson.valoraciones_parkinson for select
  to authenticated
  using (auth.uid() = auth_user_id);

drop policy if exists valoraciones_insert_own on parkinson.valoraciones_parkinson;
create policy valoraciones_insert_own
  on parkinson.valoraciones_parkinson for insert
  to authenticated
  with check (auth.uid() = auth_user_id);

drop policy if exists valoraciones_update_own on parkinson.valoraciones_parkinson;
create policy valoraciones_update_own
  on parkinson.valoraciones_parkinson for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists valoraciones_parkinson_service_all on parkinson.valoraciones_parkinson;
create policy valoraciones_parkinson_service_all
  on parkinson.valoraciones_parkinson for all
  to service_role
  using (true)
  with check (true);

-- validacion_expertos: autenticados (piloto)
alter table parkinson.validacion_expertos enable row level security;

drop policy if exists validacion_expertos_anon_insert on parkinson.validacion_expertos;
drop policy if exists validacion_expertos_anon_select on parkinson.validacion_expertos;

drop policy if exists validacion_auth_insert on parkinson.validacion_expertos;
create policy validacion_auth_insert
  on parkinson.validacion_expertos for insert
  to authenticated
  with check (true);

drop policy if exists validacion_auth_select on parkinson.validacion_expertos;
create policy validacion_auth_select
  on parkinson.validacion_expertos for select
  to authenticated
  using (true);

drop policy if exists validacion_expertos_service_all on parkinson.validacion_expertos;
create policy validacion_expertos_service_all
  on parkinson.validacion_expertos for all
  to service_role
  using (true)
  with check (true);

-- Dashboard: Exposed schemas debe incluir "parkinson".
-- Auth → URL Configuration: añadir redirects de Cadencia (no reemplazar Site URL).
