-- =========================================
-- Zarga Gentlemen's Barber Shop
-- Initial Schema Migration
-- =========================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =========================================
-- CLIENTS
-- =========================================
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  preferred_barber text,
  no_show_count int default 0,
  total_appointments int default 0,
  notes text,
  created_at timestamptz default now()
);

-- Index on phone for quick lookup
create index if not exists idx_clients_phone on clients(phone);

-- =========================================
-- APPOINTMENTS
-- =========================================
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  client_name text not null,
  client_phone text not null,
  client_email text,
  barber text not null,
  service_name text not null,
  service_category text not null,
  duration_minutes int not null,
  price decimal(10, 2) not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'pending' check (
    status in (
      'pending',
      'confirmed',
      'arrived',
      'in_service',
      'completed',
      'cancelled_client',
      'cancelled_shop',
      'no_show',
      'rescheduled'
    )
  ),
  notes text,
  booking_source text default 'online' check (
    booking_source in ('online', 'phone', 'walk-in', 'admin')
  ),
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_appointments_start_time on appointments(start_time);
create index if not exists idx_appointments_barber on appointments(barber);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_client_id on appointments(client_id);

-- =========================================
-- BLOCKED TIMES
-- =========================================
create table if not exists blocked_times (
  id uuid primary key default gen_random_uuid(),
  barber text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  reason text,
  created_at timestamptz default now()
);

create index if not exists idx_blocked_times_barber on blocked_times(barber);
create index if not exists idx_blocked_times_start on blocked_times(start_time);

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Enable RLS
alter table clients enable row level security;
alter table appointments enable row level security;
alter table blocked_times enable row level security;

-- Public can create appointments and clients (booking flow)
create policy "Public can insert appointments"
  on appointments for insert
  with check (true);

create policy "Public can insert clients"
  on clients for insert
  with check (true);

-- Service role bypasses RLS (for admin API routes)
-- Note: The service role key automatically bypasses RLS

-- =========================================
-- FUNCTIONS
-- =========================================

-- Auto-increment total_appointments on client when appointment is created
create or replace function increment_client_appointments()
returns trigger as $$
begin
  if NEW.client_id is not null then
    update clients
    set total_appointments = total_appointments + 1
    where id = NEW.client_id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger on_appointment_created
  after insert on appointments
  for each row
  execute function increment_client_appointments();

-- Auto-increment no_show_count when status changes to no_show
create or replace function handle_no_show()
returns trigger as $$
begin
  if NEW.status = 'no_show' and OLD.status != 'no_show' and NEW.client_id is not null then
    update clients
    set no_show_count = no_show_count + 1
    where id = NEW.client_id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger on_appointment_no_show
  after update on appointments
  for each row
  execute function handle_no_show();
