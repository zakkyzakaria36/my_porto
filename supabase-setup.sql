-- Run once in Supabase Dashboard > SQL Editor.
-- This keeps public visitors read-only while signed-in admins manage work.

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
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

drop policy if exists "Public can view portfolio" on public.portfolio_items;
create policy "Public can view portfolio"
on public.portfolio_items for select using (true);

drop policy if exists "Authenticated users manage portfolio" on public.portfolio_items;
create policy "Authenticated users manage portfolio"
on public.portfolio_items for all to authenticated
using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view portfolio files" on storage.objects;
create policy "Public can view portfolio files"
on storage.objects for select using (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated users manage portfolio files" on storage.objects;
create policy "Authenticated users manage portfolio files"
on storage.objects for all to authenticated
using (bucket_id = 'portfolio-assets') with check (bucket_id = 'portfolio-assets');
