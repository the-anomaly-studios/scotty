-- Jobs board
create table public.jobs (
  id              uuid primary key default gen_random_uuid(),
  posted_by       uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  company         text not null,
  location        text not null,
  work_type       text not null check (work_type in ('remote', 'hybrid', 'onsite')),
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'contract', 'internship')),
  description     text not null,
  application_url text not null,
  created_at      timestamptz not null default now(),
  expires_at      timestamptz not null default (now() + interval '60 days')
);

alter table public.jobs enable row level security;

-- Public read: non-expired postings only
create policy "jobs_public_read"
  on public.jobs for select
  using (expires_at > now());

-- Authenticated insert: poster must own the profile
create policy "jobs_authenticated_insert"
  on public.jobs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = posted_by
        and profiles.user_id = auth.uid()
    )
  );

-- Owner or admin can delete
create policy "jobs_delete_own_or_admin"
  on public.jobs for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = posted_by
        and profiles.user_id = auth.uid()
    )
    or exists (
      select 1 from public.user_meta
      where user_meta.user_id = auth.uid()
        and user_meta.is_admin = true
    )
  );
