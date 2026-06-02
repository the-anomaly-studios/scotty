-- User metadata extending auth.users
create table public.user_meta (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row-level security
alter table public.user_meta enable row level security;

-- Users can read their own meta
create policy "users can read own meta"
  on public.user_meta for select
  using (auth.uid() = user_id);

-- Only service role can insert/update (managed via triggers or admin)
create policy "service role full access"
  on public.user_meta for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- Auto-create user_meta row on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_meta (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
