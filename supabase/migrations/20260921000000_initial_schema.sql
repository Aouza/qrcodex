create table public.establishments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  instagram text,
  whatsapp text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.establishment_users (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  unique (establishment_id, user_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id),
  name text not null,
  slug text not null,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (establishment_id, slug),
  unique (id, establishment_id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id),
  category_id uuid not null,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  image_url text,
  available boolean not null default true,
  featured boolean not null default false,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_category_tenant_fk
    foreign key (category_id, establishment_id)
    references public.categories(id, establishment_id)
);

create index establishment_users_user_id_idx
  on public.establishment_users (user_id);
create index categories_menu_order_idx
  on public.categories (establishment_id, active, position, id);
create index products_menu_order_idx
  on public.products (establishment_id, category_id, active, position, id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger establishments_set_updated_at
  before update on public.establishments
  for each row execute function public.set_updated_at();
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.establishments enable row level security;
alter table public.establishment_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
