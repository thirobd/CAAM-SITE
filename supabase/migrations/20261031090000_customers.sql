-- ============================================================
-- ĆAAM — Comptes clients : profil (coordonnées de livraison),
-- commandes rattachées au compte et historique.
--
-- À exécuter UNE FOIS dans Supabase > SQL Editor, après l'espace propriétaire.
-- ============================================================

-- ------------------------------------------------------------
-- Profil client : une ligne par compte, créée automatiquement à l'inscription.
-- ------------------------------------------------------------
create table public.customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (length(full_name) <= 120),
  phone text not null default '' check (length(phone) <= 30),
  -- Code pays de src/lib/delivery.ts (SN, FR…)
  country text not null default 'SN' check (length(country) <= 10),
  city text not null default '' check (length(city) <= 120),
  address text not null default '' check (length(address) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

alter table public.customers enable row level security;
revoke all on public.customers from anon, authenticated;
grant select, update (full_name, phone, country, city, address) on public.customers to authenticated;

create policy "Chaque client lit son profil"
  on public.customers for select to authenticated using (user_id = (select auth.uid()));
create policy "Chaque client modifie son profil"
  on public.customers for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create or replace function public.handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.customers (user_id, full_name, phone)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data->>'full_name', ''), 120),
    left(coalesce(new.raw_user_meta_data->>'phone', ''), 30)
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_customer();

-- Comptes déjà existants (propriétaire).
insert into public.customers (user_id) select id from auth.users on conflict (user_id) do nothing;

-- ------------------------------------------------------------
-- Commandes rattachées au compte du client connecté.
-- ------------------------------------------------------------
alter table public.orders add column user_id uuid references auth.users (id) on delete set null;
create index orders_user_id_idx on public.orders (user_id);

-- place_order : identique, mais enregistre le compte du client s'il est connecté.
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
    (reference, user_id, customer_name, phone, country, city, address, notes, payment_method,
     subtotal_xof, delivery_label, delivery_fee_xof, total_xof)
  values
    (v_reference, (select auth.uid()), trim(p_customer->>'name'), trim(p_customer->>'phone'), trim(p_customer->>'country'),
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

-- Historique du client connecté, sans les informations internes (note, stock).
create or replace function public.my_orders()
returns table (
  reference text,
  status text,
  created_at timestamptz,
  delivery_fee_xof integer,
  total_xof integer,
  items jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    o.reference,
    o.status,
    o.created_at,
    o.delivery_fee_xof,
    o.total_xof,
    coalesce(
      (select jsonb_agg(jsonb_build_object('name', i.product_name, 'size_ml', i.size_ml, 'quantity', i.quantity, 'unit_price_xof', i.unit_price_xof))
       from public.order_items i where i.order_id = o.id),
      '[]'::jsonb
    )
  from public.orders o
  where o.user_id = (select auth.uid())
  order by o.created_at desc
  limit 50;
$$;

revoke all on function public.my_orders() from public, anon;
grant execute on function public.my_orders() to authenticated;
