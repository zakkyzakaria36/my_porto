-- ============================================================
--  MULTI-TENANT PORTFOLIO — jalankan di Supabase SQL Editor
--  Hapus setup lama dulu, lalu jalankan ini.
-- ============================================================

-- 1. Tabel profil tiap klien (diisi otomatis saat akun dibuat)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (char_length(username) between 2 and 30 and username ~ '^[a-z0-9_-]+$'),
  display_name text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Siapa saja bisa lihat profil
drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles"
  on public.profiles for select using (true);

-- Hanya pemilik yang bisa update profilnya sendiri
drop policy if exists "Owner update profile" on public.profiles;
create policy "Owner update profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Trigger: buat profil otomatis saat user baru dibuat di Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username',
      regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_-]', '-', 'g'))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Masukkan user yang sudah terdaftar sebelumnya ke tabel profiles
insert into public.profiles (id, email, display_name, username)
select 
  id, 
  email, 
  split_part(email, '@', 1), 
  regexp_replace(lower(split_part(email, '@', 1)), '[^a-z0-9_-]', '-', 'g')
from auth.users
on conflict (id) do nothing;


-- 2. Tabel karya — punya relasi ke profiles & auth.users
drop table if exists public.portfolio_items cascade;
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) <= 80),
  description text not null check (char_length(description) <= 300),
  category text not null check (category in ('projects', 'certificates', 'awards')),
  image_path text not null,
  tags text[] not null default '{}',
  demo_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table public.portfolio_items to anon;
grant all on table public.portfolio_items to authenticated;
grant select on table public.profiles to anon;
grant all on table public.profiles to authenticated;

-- Siapa saja bisa lihat semua karya (untuk tampilan publik)
drop policy if exists "Public read items" on public.portfolio_items;
create policy "Public read items"
  on public.portfolio_items for select using (true);

-- Hanya pemilik yang bisa insert/update/delete karyanya sendiri
drop policy if exists "Owner manage items" on public.portfolio_items;
create policy "Owner manage items"
  on public.portfolio_items for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);


-- 3. Storage bucket
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

-- Siapa saja bisa lihat file
drop policy if exists "Public read files" on storage.objects;
create policy "Public read files"
  on storage.objects for select using (bucket_id = 'portfolio-assets');

-- Klien hanya bisa kelola file di folder miliknya (folder = user id mereka)
drop policy if exists "Owner manage files" on storage.objects;
create policy "Owner manage files"
  on storage.objects for all to authenticated
  using (bucket_id = 'portfolio-assets' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'portfolio-assets' and (storage.foldername(name))[1] = auth.uid()::text);
