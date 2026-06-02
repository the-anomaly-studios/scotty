-- Alumni profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  email text unique not null,
  name text,
  graduation_year smallint,
  headshot_url text,
  linkedin_url text,
  bio text,
  role text,
  company text,
  location text,
  personal_email text,
  website text,
  instagram text,
  x text,
  bluesky text,
  tiktok text,
  skills text[] not null default '{}',
  is_mentorship_open boolean not null default false,
  is_featured_eligible boolean not null default false,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every write
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Row-level security
alter table public.profiles enable row level security;

-- Public can read active profiles
create policy "public read active profiles"
  on public.profiles for select
  using (is_active = true);

-- Authenticated users can insert their own profile
create policy "users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated users can update their own profile
create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can do anything
create policy "admins full access"
  on public.profiles for all
  using (
    exists (
      select 1 from public.user_meta
      where user_meta.user_id = auth.uid()
      and user_meta.is_admin = true
    )
  );

-- Storage bucket for headshots
insert into storage.buckets (id, name, public)
values ('headshots', 'headshots', true)
on conflict (id) do nothing;

-- Anyone can read headshots (public bucket)
create policy "public read headshots"
  on storage.objects for select
  using (bucket_id = 'headshots');

-- Authenticated users can upload their own headshot
create policy "users can upload headshot"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'headshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update/replace their own headshot
create policy "users can update headshot"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'headshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
