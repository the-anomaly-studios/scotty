-- News posts
create table public.news (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  body            text not null,
  published_at    timestamptz not null default now(),
  cover_image_url text,
  external_link   text
);

alter table public.news enable row level security;

-- Public read
create policy "news_public_read"
  on public.news for select
  using (true);

-- Admin insert/update/delete
create policy "news_admin_insert"
  on public.news for insert
  with check (
    exists (select 1 from public.user_meta where id = auth.uid() and is_admin = true)
  );

create policy "news_admin_update"
  on public.news for update
  using (
    exists (select 1 from public.user_meta where id = auth.uid() and is_admin = true)
  );

create policy "news_admin_delete"
  on public.news for delete
  using (
    exists (select 1 from public.user_meta where id = auth.uid() and is_admin = true)
  );
