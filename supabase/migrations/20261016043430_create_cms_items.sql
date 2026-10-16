-- CMS unified content table: layanan, fasilitas, promo in one table (replaces cms_feature_items).
-- Applied remotely (dev) as: cms_items_unified + cms_item_data_valid_tone_null_fix (folded into this file).
--
-- Intended for environments that never had public.cms_feature_items (e.g. prod): creates the table empty.
-- Idempotent: safe to re-run (create ... if not exists / create or replace / drop ... if exists).
--
-- Rollback: drop table public.cms_items; drop function public.cms_item_data_valid(text, jsonb);
--           drop function public.set_cms_items_updated_at();
--
-- data jsonb shape per module:
--   layanan / fasilitas: {"icon": {"kind": "lucide" | "lucideCircle", "name": "<icon>", "tone": "<tone>"?}}
--                        tone is required for lucideCircle and must be absent/null for lucide.
--   promo:               {"image_path": "<storage path in bucket Klinik>" | null,
--                         "normal_price": int >= 0, "promo_price": int >= 0 and <= normal_price,
--                         "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD" (>= start_date)}
-- Icon names are intentionally not validated here: the icon list lives in the apps and changes often;
-- the landing drops unknown icons when mapping rows.

create or replace function public.cms_item_data_valid(p_module text, p_data jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_icon jsonb;
  v_kind text;
  v_start date;
  v_end date;
  v_normal numeric;
  v_promo numeric;
begin
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    return false;
  end if;

  if p_module in ('layanan', 'fasilitas') then
    v_icon := p_data -> 'icon';
    if v_icon is null or jsonb_typeof(v_icon) <> 'object' then
      return false;
    end if;
    v_kind := v_icon ->> 'kind';
    if v_kind is null or v_kind not in ('lucide', 'lucideCircle') then
      return false;
    end if;
    if jsonb_typeof(v_icon -> 'name') is distinct from 'string' or length(v_icon ->> 'name') = 0 then
      return false;
    end if;
    if v_kind = 'lucide' then
      return coalesce(jsonb_typeof(v_icon -> 'tone'), 'null') = 'null';
    end if;
    return coalesce((v_icon ->> 'tone') in ('blue', 'green', 'pink', 'lilac', 'mint', 'red'), false);
  end if;

  if p_module = 'promo' then
    if jsonb_typeof(p_data -> 'normal_price') is distinct from 'number'
       or jsonb_typeof(p_data -> 'promo_price') is distinct from 'number'
       or jsonb_typeof(p_data -> 'start_date') is distinct from 'string'
       or jsonb_typeof(p_data -> 'end_date') is distinct from 'string' then
      return false;
    end if;
    if coalesce(jsonb_typeof(p_data -> 'image_path'), 'null') not in ('null', 'string') then
      return false;
    end if;
    v_normal := (p_data ->> 'normal_price')::numeric;
    v_promo := (p_data ->> 'promo_price')::numeric;
    if v_normal < 0 or v_promo < 0 or v_promo > v_normal
       or v_normal <> floor(v_normal) or v_promo <> floor(v_promo) then
      return false;
    end if;
    if (p_data ->> 'start_date') !~ '^\d{4}-\d{2}-\d{2}$'
       or (p_data ->> 'end_date') !~ '^\d{4}-\d{2}-\d{2}$' then
      return false;
    end if;
    v_start := (p_data ->> 'start_date')::date;
    v_end := (p_data ->> 'end_date')::date;
    return v_end >= v_start;
  end if;

  return false;
exception when others then
  return false;
end;
$$;

create table if not exists public.cms_items (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  section text,
  title text not null,
  body text not null default '',
  data jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cms_items_module_check check (module in ('layanan', 'fasilitas', 'promo')),
  constraint cms_items_section_check check (
    (module = 'layanan' and section in ('umum_gigi', 'spesialis'))
    or (module = 'fasilitas' and section in ('umum', 'lainnya'))
    or (module = 'promo' and section is null)
  ),
  constraint cms_items_title_check check (char_length(btrim(title)) between 1 and 120),
  constraint cms_items_body_check check (char_length(body) <= 1000),
  constraint cms_items_data_check check (public.cms_item_data_valid(module, data))
);

create index if not exists cms_items_public_list_idx
  on public.cms_items (module, section, sort_order)
  where is_published and deleted_at is null;

create or replace function public.set_cms_items_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_items_set_updated_at on public.cms_items;
create trigger cms_items_set_updated_at
  before update on public.cms_items
  for each row execute function public.set_cms_items_updated_at();

alter table public.cms_items enable row level security;

-- Admin CRUD via authenticated client (no DELETE: removal is soft via deleted_at).
-- Public read goes through the Astro server with the service role only.
drop policy if exists cms_items_select_authenticated on public.cms_items;
create policy cms_items_select_authenticated on public.cms_items
  for select to authenticated using (true);

drop policy if exists cms_items_insert_authenticated on public.cms_items;
create policy cms_items_insert_authenticated on public.cms_items
  for insert to authenticated with check (true);

drop policy if exists cms_items_update_authenticated on public.cms_items;
create policy cms_items_update_authenticated on public.cms_items
  for update to authenticated using (true) with check (true);

comment on table public.cms_items is
  'CMS marketing content (layanan, fasilitas, promo); module-specific fields live in data jsonb; admin authenticated CRUD; public via Astro service-role only.';
