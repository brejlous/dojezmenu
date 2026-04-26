-- LastBite by Piano — DB schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users with app role)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'restaurant' check (role in ('restaurant', 'admin')),
  created_at timestamptz default now()
);

-- Restaurants
create table if not exists restaurace (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nazev text not null,
  adresa text not null,
  mesto text not null,
  psc text default '',
  telefon text default '',
  email text default '',
  logo text default '',
  popis text default '',
  kategorie text not null default 'ceska'
    check (kategorie in ('ceska', 'italska', 'asijska', 'bistro', 'vegetarianska')),
  created_at timestamptz default now()
);

-- Offers
create table if not exists nabidky (
  id uuid primary key default gen_random_uuid(),
  restaurace_id uuid not null references restaurace(id) on delete cascade,
  nazev text not null,
  popis text default '',
  originalni_cena integer not null,
  zvyhodnena_cena integer not null,
  zbyvajici_kusu integer not null,
  celkem_kusu integer not null,
  vyzvednout_od text not null,
  vyzvednout_do text not null,
  kategorie text not null
    check (kategorie in ('ceska', 'italska', 'asijska', 'bistro', 'vegetarianska')),
  foto text default '',
  aktivni boolean default true,
  created_at timestamptz default now()
);

-- Reservations
create table if not exists rezervace (
  id uuid primary key default gen_random_uuid(),
  nabidka_id uuid not null references nabidky(id) on delete cascade,
  jmeno text not null,
  telefon text default '',
  email text default '',
  pocet_porci integer not null check (pocet_porci > 0),
  poznamka text default '',
  cas_vytvoreni timestamptz default now(),
  stav text not null default 'cekajici'
    check (stav in ('cekajici', 'potvrzena', 'vyzvednuta', 'zrusena'))
);

-- Auto-create profile on new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'role', 'restaurant'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Decrement zbyvajici_kusu atomically when reservation is created
create or replace function decrement_zbyvajici_kusu()
returns trigger as $$
begin
  update nabidky
  set zbyvajici_kusu = zbyvajici_kusu - new.pocet_porci
  where id = new.nabidka_id and zbyvajici_kusu >= new.pocet_porci;

  if not found then
    raise exception 'Nedostatek porcí';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists on_rezervace_created on rezervace;
create trigger on_rezervace_created
  before insert on rezervace
  for each row execute procedure decrement_zbyvajici_kusu();

-- ========================
-- Row Level Security
-- ========================

alter table profiles enable row level security;
alter table restaurace enable row level security;
alter table nabidky enable row level security;
alter table rezervace enable row level security;

-- Profiles: user can only read/update their own
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Restaurace: public read, owner update
create policy "Public can read restaurace" on restaurace for select using (true);
create policy "Owner can update restaurace" on restaurace for update using (auth.uid() = user_id);
create policy "Owner can insert restaurace" on restaurace for insert with check (auth.uid() = user_id);

-- Nabidky: public read active, owner full CRUD on their own
create policy "Public can read active nabidky" on nabidky for select using (aktivni = true);
create policy "Owner can manage nabidky" on nabidky for all using (
  restaurace_id in (select id from restaurace where user_id = auth.uid())
);

-- Rezervace: anyone can insert, owner can read/update
create policy "Anyone can create rezervace" on rezervace for insert with check (true);
create policy "Owner can read rezervace" on rezervace for select using (
  nabidka_id in (
    select n.id from nabidky n
    join restaurace r on r.id = n.restaurace_id
    where r.user_id = auth.uid()
  )
);
create policy "Owner can update rezervace" on rezervace for update using (
  nabidka_id in (
    select n.id from nabidky n
    join restaurace r on r.id = n.restaurace_id
    where r.user_id = auth.uid()
  )
);
