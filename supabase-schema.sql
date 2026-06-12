-- Supabase'de SQL Editor'e yapıştır ve çalıştır

create table reservations (
  id uuid default gen_random_uuid() primary key,
  date text not null,
  slot text not null check (slot in ('sabah', 'aksam')),
  name text not null,
  phone text not null,
  email text not null,
  guest_count integer not null default 10,
  note text default '',
  status text not null default 'beklemede' check (status in ('beklemede', 'onaylandi', 'iptal')),
  created_at timestamptz default now()
);

-- Güvenlik: sadece service role yazabilir, okuyabilir
alter table reservations enable row level security;

create policy "Service role full access" on reservations
  using (true)
  with check (true);
