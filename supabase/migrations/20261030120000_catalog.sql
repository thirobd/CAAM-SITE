-- ============================================================
-- ĆAAM — Phase 2 : catalogue (parfums, contenances, stock)
-- et stockage des photos produits.
--
-- À exécuter UNE FOIS : Supabase > SQL Editor > New query > coller > Run.
-- ============================================================

-- Horodatage automatique des modifications
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- Parfums
-- Les valeurs de « collection » et « family » doivent rester
-- alignées avec src/lib/catalog/taxonomy.ts.
-- ------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(trim(name)) > 0),
  brand text not null default 'ĆAAM',
  concentration text not null default 'Extrait de parfum',
  collection text not null check (collection in ('elle', 'lui', 'esprits-libres')),
  family text not null check (family in ('ambre', 'boise', 'floral', 'cuir', 'epice', 'frais')),
  tagline text not null default '',
  description text not null default '',
  notes_top text[] not null default '{}',
  notes_heart text[] not null default '{}',
  notes_base text[] not null default '{}',
  -- Couleur du jus (visuel de remplacement tant qu'il n'y a pas de photo)
  tint text not null default '#b88a3e' check (tint ~ '^#[0-9a-fA-F]{6}$'),
  -- Chemins dans le compartiment « products » (ex. ambre-souverain/1.jpg) ou URL complètes
  images text[] not null default '{}',
  featured boolean not null default false,
  best_seller_rank integer check (best_seller_rank > 0),
  is_new boolean not null default false,
  -- Un parfum non publié reste en base mais n'apparaît pas sur le site
  is_published boolean not null default true,
  -- Ordre d'affichage manuel (plus petit = plus haut)
  position integer not null default 0,
  added_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Parfums ĆAAM. Collections et familles alignées avec src/lib/catalog/taxonomy.ts.';

-- ------------------------------------------------------------
-- Contenances (50 ml, 100 ml…) : prix et stock par contenance
-- ------------------------------------------------------------
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  size_ml integer not null check (size_ml > 0),
  price_xof integer not null check (price_xof >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size_ml)
);

create index product_variants_product_id_idx on public.product_variants (product_id);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Sécurité (RLS) : le public lit le catalogue publié, rien d'autre.
-- Aucune politique d'écriture : seule la clé secrète (serveur) peut
-- modifier les données, en attendant le tableau de bord sécurisé.
-- ------------------------------------------------------------
alter table public.products enable row level security;
alter table public.product_variants enable row level security;

create policy "Lecture publique des parfums publiés"
  on public.products for select
  to anon, authenticated
  using (is_published);

create policy "Lecture publique des contenances des parfums publiés"
  on public.product_variants for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.is_published
    )
  );

revoke all on public.products, public.product_variants from anon, authenticated;
grant select on public.products, public.product_variants to anon, authenticated;

-- ------------------------------------------------------------
-- Photos produits : compartiment public en lecture.
-- Envoi des fichiers depuis le tableau de bord Supabase (Storage).
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
