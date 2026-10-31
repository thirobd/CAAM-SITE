-- ============================================================
-- ĆAAM — Renforcement après l'audit du 31/10/2026.
-- Limite anti-commandes fantômes, fonction interne fermée,
-- index manquant, règles de lecture fusionnées.
--
-- À exécuter UNE FOIS dans Supabase > SQL Editor, après les comptes clients.
-- ============================================================

-- ------------------------------------------------------------
-- place_order : identique, avec deux limites contre les commandes en série
-- (5 par heure pour un même numéro, 30 toutes boutiques confondues en 10 minutes).
-- ------------------------------------------------------------
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
  v_phone text := regexp_replace(coalesce(p_customer->>'phone', ''), '\D', '', 'g');
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) not between 1 and 20 then
    raise exception 'Panier invalide';
  end if;

  if (select count(*) from public.orders
      where regexp_replace(phone, '\D', '', 'g') = v_phone and created_at > now() - interval '1 hour') >= 5
     or (select count(*) from public.orders where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'Trop de commandes';
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

-- ------------------------------------------------------------
-- Fonction déclenchée à l'inscription : personne n'a à l'appeler directement
-- (le déclencheur continue de fonctionner).
-- ------------------------------------------------------------
revoke all on function public.handle_new_customer() from public, anon, authenticated;

-- ------------------------------------------------------------
-- Index manquant (contenance d'un article commandé).
-- ------------------------------------------------------------
create index if not exists order_items_variant_id_idx on public.order_items (variant_id);

-- ------------------------------------------------------------
-- Une seule règle de lecture par rôle sur le catalogue (au lieu de deux qui se recoupent).
-- ------------------------------------------------------------
drop policy "Lecture publique des parfums publiés" on public.products;
drop policy "Admins : lecture de tous les parfums" on public.products;
create policy "Visiteurs : lecture des parfums publiés"
  on public.products for select to anon
  using (is_published);
create policy "Connectés : parfums publiés, tous pour un administrateur"
  on public.products for select to authenticated
  using (is_published or (select public.is_admin()));

drop policy "Lecture publique des contenances des parfums publiés" on public.product_variants;
drop policy "Admins : lecture de toutes les contenances" on public.product_variants;
create policy "Visiteurs : contenances des parfums publiés"
  on public.product_variants for select to anon
  using (exists (select 1 from public.products p where p.id = product_variants.product_id and p.is_published));
create policy "Connectés : contenances publiées, toutes pour un administrateur"
  on public.product_variants for select to authenticated
  using (
    (select public.is_admin())
    or exists (select 1 from public.products p where p.id = product_variants.product_id and p.is_published)
  );
