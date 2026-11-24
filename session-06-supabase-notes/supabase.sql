create table public.notes (id uuid primary key default gen_random_uuid(), title text not null check (length(trim(title)) > 0), content text not null check (length(trim(content)) > 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.notes enable row level security;
create policy "demo notes read" on public.notes for select to anon using (true);
create policy "demo notes insert" on public.notes for insert to anon with check (true);
create policy "demo notes update" on public.notes for update to anon using (true) with check (true);
create policy "demo notes delete" on public.notes for delete to anon using (true);
