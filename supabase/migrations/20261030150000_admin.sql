-- ============================================================
-- ĆAAM — Phase 3 : espace propriétaire (/admin) et commandes.
-- Comptes administrateurs, gestion du catalogue et des photos,
-- enregistrement et suivi des commandes passées sur le site.
--
-- À exécuter UNE FOIS dans Supabase > SQL Editor, après le catalogue.
-- ============================================================

-- ------------------------------------------------------------
-- Administrateurs : seuls les comptes listés ici accèdent à /admin.
-- La connexion utilise Supabase Auth (adresse <identifiant>@caam.local).
-- ------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9._-]{3,32}$'),
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Comptes autorisés à gérer la boutique depuis /admin.';

alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

create policy "Chaque administrateur lit sa propre fiche"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------
-- Catalogue : les administrateurs lisent tout (y compris les parfums
-- masqués) et peuvent ajouter, modifier ou supprimer.
-- ------------------------------------------------------------
grant insert, update, delete on public.products, public.product_variants to authenticated;

create policy "Admins : lecture de tous les parfums"
  on public.products for select to authenticated using ((select public.is_admin()));
create policy "Admins : ajout de parfums"
  on public.products for insert to authenticated with check ((select public.is_admin()));
create policy "Admins : modification des parfums"
  on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins : suppression des parfums"
  on public.products for delete to authenticated using ((select public.is_admin()));

create policy "Admins : lecture de toutes les contenances"
  on public.product_variants for select to authenticated using ((select public.is_admin()));
create policy "Admins : ajout de contenances"
  on public.product_variants for insert to authenticated with check ((select public.is_admin()));
create policy "Admins : modification des contenances"
  on public.product_variants for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins : suppression des contenances"
  on public.product_variants for delete to authenticated using ((select public.is_admin()));

-- ------------------------------------------------------------
-- Photos : envoi dans le compartiment « products » réservé aux administrateurs.
-- ------------------------------------------------------------
create policy "Admins : lecture des photos produits"
  on storage.objects for select to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
create policy "Admins : envoi des photos produits"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and (select public.is_admin()));
create policy "Admins : remplacement des photos produits"
  on storage.objects for update to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
create policy "Admins : suppression des photos produits"
  on storage.objects for delete to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));

-- ------------------------------------------------------------
-- Commandes passées sur le site (envoyées ensuite par WhatsApp).
-- ------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status text not null default 'nouvelle' check (status in ('nouvelle', 'confirmee', 'livree', 'annulee')),
  customer_name text not null check (length(customer_name) between 2 and 120),
  phone text not null check (length(phone) between 6 and 30),
  country text not null check (length(country) between 2 and 60),
  city text not null check (length(city) between 2 and 120),
  address text not null check (length(address) between 5 and 300),
  notes text not null default '' check (length(notes) <= 500),
  payment_method text not null check (payment_method in ('cash', 'mobile-money', 'card')),
  subtotal_xof integer not null check (subtotal_xof >= 0),
  delivery_label text not null default '',
  -- null = livraison sur devis (international)
  delivery_fee_xof integer check (delivery_fee_xof between 0 and 100000),
  total_xof integer not null check (total_xof >= 0),
  -- Vrai quand le stock a été retiré (commande confirmée ou livrée)
  stock_applied boolean not null default false,
  admin_note text not null default '' check (length(admin_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_created_at_idx on public.orders (created_at desc);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  size_ml integer not null,
  quantity integer not null check (quantity > 0),
  unit_price_xof integer not null check (unit_price_xof >= 0)
);

create index order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
revoke all on public.orders, public.order_items from anon, authenticated;
grant select on public.orders, public.order_items to authenticated;
-- Seule la note interne se modifie directement ; le statut passe par set_order_status().
grant update (admin_note) on public.orders to authenticated;

create policy "Admins : lecture des commandes"
  on public.orders for select to authenticated using ((select public.is_admin()));
create policy "Admins : note interne des commandes"
  on public.orders for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins : lecture des articles commandés"
  on public.order_items for select to authenticated using ((select public.is_admin()));

-- Enregistre une commande du site. Appelée par le serveur du site avec la clé publique :
-- les prix sont relus dans le catalogue, ceux envoyés par le navigateur sont ignorés.
create or replace function public.place_order(
  p_customer jsonb,
  p_items jsonb,
  p_delivery_label text,
  p_delivery_fee_xof integer
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_reference text;
  v_subtotal integer := 0;
  v_item jsonb;
  v_qty integer;
  v_variant record;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) not between 1 and 20 then
    raise exception 'Panier invalide';
  end if;

  loop
    v_reference := 'CAAM-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
    exit when not exists (select 1 from public.orders where reference = v_reference);
  end loop;

  insert into public.orders
    (reference, customer_name, phone, country, city, address, notes, payment_method,
     subtotal_xof, delivery_label, delivery_fee_xof, total_xof)
  values
    (v_reference, trim(p_customer->>'name'), trim(p_customer->>'phone'), trim(p_customer->>'country'),
     trim(p_customer->>'city'), trim(p_customer->>'address'), coalesce(trim(p_customer->>'notes'), ''),
     p_customer->>'payment_method', 0, coalesce(p_delivery_label, ''), p_delivery_fee_xof, 0)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    select v.id, v.size_ml, v.price_xof, v.stock, p.name
      into v_variant
      from public.product_variants v
      join public.products p on p.id = v.product_id
      where v.id = (v_item->>'variant_id')::uuid and p.is_published;
    if not found then
      raise exception 'Article indisponible';
    end if;
    if v_qty is null or v_qty < 1 or v_qty > v_variant.stock then
      raise exception 'Stock insuffisant';
    end if;
    insert into public.order_items (order_id, variant_id, product_name, size_ml, quantity, unit_price_xof)
    values (v_order_id, v_variant.id, v_variant.name, v_variant.size_ml, v_qty, v_variant.price_xof);
    v_subtotal := v_subtotal + v_qty * v_variant.price_xof;
  end loop;

  update public.orders
  set subtotal_xof = v_subtotal, total_xof = v_subtotal + coalesce(p_delivery_fee_xof, 0)
  where id = v_order_id;

  return v_reference;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb, text, integer) from public;
grant execute on function public.place_order(jsonb, jsonb, text, integer) to anon, authenticated;

-- Change le statut d'une commande. Le stock est retiré à la confirmation (ou à la
-- livraison), et rendu si la commande repasse « nouvelle » ou est annulée.
create or replace function public.set_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;
  if p_status not in ('nouvelle', 'confirmee', 'livree', 'annulee') then
    raise exception 'Statut inconnu';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Commande introuvable';
  end if;

  if p_status in ('confirmee', 'livree') and not v_order.stock_applied then
    if exists (
      select 1 from public.order_items i
      join public.product_variants v on v.id = i.variant_id
      where i.order_id = p_order_id and v.stock < i.quantity
    ) then
      raise exception 'Stock insuffisant pour confirmer cette commande. Mettez le stock à jour, puis réessayez.';
    end if;
    update public.product_variants v
    set stock = v.stock - i.quantity
    from public.order_items i
    where i.order_id = p_order_id and i.variant_id = v.id;
    update public.orders set stock_applied = true where id = p_order_id;
  elsif p_status in ('nouvelle', 'annulee') and v_order.stock_applied then
    update public.product_variants v
    set stock = v.stock + i.quantity
    from public.order_items i
    where i.order_id = p_order_id and i.variant_id = v.id;
    update public.orders set stock_applied = false where id = p_order_id;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;

revoke all on function public.set_order_status(uuid, text) from public, anon;
grant execute on function public.set_order_status(uuid, text) to authenticated;
