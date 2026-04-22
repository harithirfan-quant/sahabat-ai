-- =============================================================================
-- SAHABAT.AI — Postgres RPC functions
-- =============================================================================
-- Run AFTER schema.sql. These are exposed to the Supabase client via
-- `supabase.rpc('name', args)`.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- match_programs(query_embedding, match_count, min_similarity)
-- -----------------------------------------------------------------------------
-- Returns the `match_count` programs most semantically similar to the query
-- embedding, ordered by cosine similarity desc. Filters out anything below
-- `min_similarity` so we never surface a program that's barely related.
--
-- Similarity is `1 - cosine_distance`, so the range is [-1, 1] where 1 is a
-- perfect match. pgvector's `<=>` operator returns cosine distance directly.
-- -----------------------------------------------------------------------------

create or replace function public.match_programs(
  query_embedding vector(384),
  match_count     int default 5,
  min_similarity  float default 0.0
)
returns table (
  id          uuid,
  title       text,
  description text,
  category    text,
  location    text,
  url         text,
  similarity  float
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    p.id,
    p.title,
    p.description,
    p.category,
    p.location,
    p.url,
    1 - (p.embedding <=> query_embedding) as similarity
  from public.programs p
  where p.embedding is not null
    and 1 - (p.embedding <=> query_embedding) >= min_similarity
  order by p.embedding <=> query_embedding asc
  limit greatest(match_count, 1);
$$;

-- Callable by anyone — programs are public-read per RLS policy.
grant execute on function public.match_programs(vector, int, float)
  to anon, authenticated, service_role;
