-- Instagram post history for CMS promos (omnichannel publish from matarammedika-admin).
-- v1: the admin app calls the Instagram Graph API from the browser and writes these rows itself
-- (authenticated). Planned: move the Meta call + writes into a Supabase Edge Function and drop the
-- insert/update policies below.
--
-- Idempotent: safe to re-run.
-- Rollback: drop table public.cms_promo_instagram_posts;

create table if not exists public.cms_promo_instagram_posts (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.cms_items (id),
  status text not null default 'publishing',
  caption text not null,
  image_path text not null,
  ig_container_id text,
  ig_media_id text,
  permalink text,
  error_message text,
  requested_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  constraint cms_promo_instagram_posts_status_check
    check (status in ('publishing', 'published', 'failed')),
  constraint cms_promo_instagram_posts_caption_check
    check (char_length(caption) between 1 and 2200),
  constraint cms_promo_instagram_posts_error_check
    check (error_message is null or char_length(error_message) <= 500)
);

-- One in-flight publish per promo, so a double click cannot create two Instagram posts.
create unique index if not exists cms_promo_instagram_posts_one_publishing_idx
  on public.cms_promo_instagram_posts (item_id)
  where status = 'publishing';

create index if not exists cms_promo_instagram_posts_item_created_idx
  on public.cms_promo_instagram_posts (item_id, created_at desc);

alter table public.cms_promo_instagram_posts enable row level security;

drop policy if exists cms_promo_instagram_posts_select_authenticated on public.cms_promo_instagram_posts;
create policy cms_promo_instagram_posts_select_authenticated on public.cms_promo_instagram_posts
  for select to authenticated using (true);

drop policy if exists cms_promo_instagram_posts_insert_authenticated on public.cms_promo_instagram_posts;
create policy cms_promo_instagram_posts_insert_authenticated on public.cms_promo_instagram_posts
  for insert to authenticated with check (true);

drop policy if exists cms_promo_instagram_posts_update_authenticated on public.cms_promo_instagram_posts;
create policy cms_promo_instagram_posts_update_authenticated on public.cms_promo_instagram_posts
  for update to authenticated using (true) with check (true);

comment on table public.cms_promo_instagram_posts is
  'Instagram publish history per CMS promo; written by matarammedika-admin (authenticated), no delete.';
