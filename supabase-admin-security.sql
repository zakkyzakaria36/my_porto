-- Run once after supabase-setup.sql.
-- Only the portfolio owner's Supabase account may change public content.

drop policy if exists "Authenticated users manage portfolio" on public.portfolio_items;
create policy "Owner manages portfolio"
on public.portfolio_items for all to authenticated
using ((auth.jwt() ->> 'email') = 'zakkyzkr36@gmail.com')
with check ((auth.jwt() ->> 'email') = 'zakkyzkr36@gmail.com');

drop policy if exists "Authenticated users manage portfolio files" on storage.objects;
create policy "Owner manages portfolio files"
on storage.objects for all to authenticated
using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'zakkyzkr36@gmail.com')
with check (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'zakkyzkr36@gmail.com');
