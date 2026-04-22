-- =============================================================================
-- SAHABAT.AI — Postgres schema (Supabase)
-- =============================================================================
-- Run order: this file is idempotent. Execute via Supabase SQL editor or CLI:
--   supabase db reset      (local)
--   supabase db push       (remote)
--
-- Dependencies:
--   - Supabase Auth (auth.users)   → users.id references auth.users(id)
--   - pgcrypto                     → gen_random_uuid()
--   - vector (pgvector)            → embedding vector(384)  [MiniLM-L6-v2]
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "vector";


-- =============================================================================
-- Types
-- =============================================================================

do $$ begin
  create type wellbeing_tier as enum ('green', 'yellow', 'orange', 'red');
exception when duplicate_object then null; end $$;

do $$ begin
  create type chat_role as enum ('user', 'assistant', 'system');
exception when duplicate_object then null; end $$;

do $$ begin
  create type buddy_status as enum ('pending', 'active', 'declined', 'ended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type crisis_severity as enum ('low', 'medium', 'high', 'critical');
exception when duplicate_object then null; end $$;


-- =============================================================================
-- users
-- =============================================================================
-- 1:1 with auth.users. Stores profile/anonymous handle + language preference.

create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  handle        text unique,
  language_pref text not null default 'en' check (language_pref in ('en', 'bm')),
  created_at    timestamptz not null default now()
);

create index if not exists users_handle_idx on public.users (handle);


-- =============================================================================
-- journals  (60-second daily check-in)
-- =============================================================================

create table if not exists public.journals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  mood_score      smallint not null check (mood_score between 1 and 10),
  sleep_hours     numeric(4,2) check (sleep_hours >= 0 and sleep_hours <= 24),
  note            text,
  sentiment_score numeric(4,3) check (sentiment_score between -1 and 1),
  created_at      timestamptz not null default now()
);

create index if not exists journals_user_created_idx
  on public.journals (user_id, created_at desc);


-- =============================================================================
-- chats  (conversation history with Sahabat)
-- =============================================================================

create table if not exists public.chats (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  role       chat_role not null,
  content    text not null,
  sentiment  numeric(4,3) check (sentiment between -1 and 1),
  risk_flag  boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists chats_user_created_idx
  on public.chats (user_id, created_at desc);

create index if not exists chats_risk_idx
  on public.chats (user_id, risk_flag) where risk_flag = true;


-- =============================================================================
-- wellbeing_scores  (output of the risk engine)
-- =============================================================================

create table if not exists public.wellbeing_scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  score       smallint not null check (score between 0 and 100),
  tier        wellbeing_tier not null,
  computed_at timestamptz not null default now()
);

create index if not exists wellbeing_user_computed_idx
  on public.wellbeing_scores (user_id, computed_at desc);


-- =============================================================================
-- programs  (curated NGO/UPM/KBS opportunities — publicly readable)
-- =============================================================================

create table if not exists public.programs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  category    text,
  location    text,
  url         text,
  embedding   vector(384),
  created_at  timestamptz not null default now()
);

-- IVFFlat index for fast cosine similarity search.
-- Rebuild after large seed imports: reindex index programs_embedding_idx;
create index if not exists programs_embedding_idx
  on public.programs
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists programs_category_idx on public.programs (category);

-- Unique on title so seed scripts can upsert safely.
do $$ begin
  alter table public.programs add constraint programs_title_unique unique (title);
exception when duplicate_object then null; end $$;


-- =============================================================================
-- buddy_matches  (peer pairs)
-- =============================================================================
-- Canonical pairing: user_a < user_b (lexicographic) to prevent duplicates.

create table if not exists public.buddy_matches (
  id         uuid primary key default gen_random_uuid(),
  user_a     uuid not null references public.users(id) on delete cascade,
  user_b     uuid not null references public.users(id) on delete cascade,
  similarity numeric(5,4) check (similarity between 0 and 1),
  status     buddy_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint buddy_matches_distinct check (user_a <> user_b),
  constraint buddy_matches_ordered  check (user_a < user_b),
  constraint buddy_matches_unique   unique (user_a, user_b)
);

create index if not exists buddy_matches_user_a_idx on public.buddy_matches (user_a);
create index if not exists buddy_matches_user_b_idx on public.buddy_matches (user_b);


-- =============================================================================
-- crisis_events  (safety escalations)
-- =============================================================================

create table if not exists public.crisis_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  severity     crisis_severity not null,
  action_taken text not null,
  created_at   timestamptz not null default now()
);

create index if not exists crisis_user_created_idx
  on public.crisis_events (user_id, created_at desc);


-- =============================================================================
-- Row-Level Security
-- =============================================================================
-- Rule: a user can read/write ONLY their own rows.
-- Exception: programs is readable by everyone (including anon for landing demos).
-- Buddy rows are visible to both participants.
-- =============================================================================

alter table public.users            enable row level security;
alter table public.journals         enable row level security;
alter table public.chats            enable row level security;
alter table public.wellbeing_scores enable row level security;
alter table public.programs         enable row level security;
alter table public.buddy_matches    enable row level security;
alter table public.crisis_events    enable row level security;

-- ---------- users ----------
drop policy if exists "users self read"   on public.users;
drop policy if exists "users self insert" on public.users;
drop policy if exists "users self update" on public.users;

create policy "users self read"
  on public.users for select
  using (auth.uid() = id);

create policy "users self insert"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users self update"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------- journals ----------
drop policy if exists "journals self read"   on public.journals;
drop policy if exists "journals self insert" on public.journals;
drop policy if exists "journals self update" on public.journals;
drop policy if exists "journals self delete" on public.journals;

create policy "journals self read"
  on public.journals for select using (auth.uid() = user_id);
create policy "journals self insert"
  on public.journals for insert with check (auth.uid() = user_id);
create policy "journals self update"
  on public.journals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journals self delete"
  on public.journals for delete using (auth.uid() = user_id);

-- ---------- chats ----------
drop policy if exists "chats self read"   on public.chats;
drop policy if exists "chats self insert" on public.chats;
drop policy if exists "chats self delete" on public.chats;

create policy "chats self read"
  on public.chats for select using (auth.uid() = user_id);
create policy "chats self insert"
  on public.chats for insert with check (auth.uid() = user_id);
create policy "chats self delete"
  on public.chats for delete using (auth.uid() = user_id);

-- ---------- wellbeing_scores ----------
-- Reads are self-only. Inserts happen from the service role (risk engine), so
-- there is no user-facing insert policy; the service role bypasses RLS.
drop policy if exists "wellbeing self read" on public.wellbeing_scores;

create policy "wellbeing self read"
  on public.wellbeing_scores for select using (auth.uid() = user_id);

-- ---------- programs ----------
-- Public read (anon + authenticated). Writes are service-role only.
drop policy if exists "programs public read" on public.programs;

create policy "programs public read"
  on public.programs for select
  to anon, authenticated
  using (true);

-- ---------- buddy_matches ----------
-- Both participants can see the match row. Users may insert only where
-- one of the participants is themselves. Updates limited to status changes
-- by participants.
drop policy if exists "buddy read participants"  on public.buddy_matches;
drop policy if exists "buddy insert self"        on public.buddy_matches;
drop policy if exists "buddy update participants" on public.buddy_matches;

create policy "buddy read participants"
  on public.buddy_matches for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "buddy insert self"
  on public.buddy_matches for insert
  with check (auth.uid() = user_a or auth.uid() = user_b);

create policy "buddy update participants"
  on public.buddy_matches for update
  using (auth.uid() = user_a or auth.uid() = user_b)
  with check (auth.uid() = user_a or auth.uid() = user_b);

-- ---------- crisis_events ----------
-- Self-read only. Inserts flow via the API (service role) to ensure
-- audit integrity; no user insert policy is granted.
drop policy if exists "crisis self read" on public.crisis_events;

create policy "crisis self read"
  on public.crisis_events for select using (auth.uid() = user_id);


-- =============================================================================
-- Trigger: auto-create a public.users row when an auth user signs up
-- =============================================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, handle, language_pref)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'handle', null),
    coalesce(new.raw_user_meta_data->>'language_pref', 'en')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
