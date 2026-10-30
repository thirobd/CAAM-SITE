-- ============================================================
-- ĆAAM — CATALOGUE RÉEL (d'après le catalogue WhatsApp Business, 30/10/2026)
--
-- À exécuter dans Supabase > SQL Editor. Peut être relancé sans risque.
-- Prix : tarifs du catalogue en euros, convertis en FCFA à la parité fixe
-- 1 € = 655,957 FCFA (34,99 € = 22 952 FCFA ; 35,00 € = 22 958 FCFA).
-- Stocks : 10 par défaut, À CONFIRMER par ĆAAM (modifiables dans Supabase).
-- ============================================================

-- Les parfums de démonstration restent en base mais ne s'affichent plus.
update public.products
set is_published = false
where slug in (
  'ambre-souverain', 'oud-imperial', 'rose-absolue', 'cuir-nocturne', 'fleur-de-bissap',
  'encens-d-or', 'vetiver-blanc', 'musc-velours', 'neroli-atlantique', 'nuit-a-dakar'
);

insert into public.products
  (slug, name, brand, concentration, collection, family, tagline, description,
   notes_top, notes_heart, notes_base, tint, images, featured, best_seller_rank, is_new, is_published, position)
values
  ('ghost', 'GHOST', 'ĆAAM', 'Extrait de parfum', 'lui', 'boise', 'Un parfum de grâce paisible', 'GHOST dévoile une harmonie subtile entre fraîcheur et profondeur. La bergamote et la cardamome ouvrent la voie à un cœur chaleureux de vanille et de bois précieux, sur un fond enveloppant d''ambre, de musc et de bois secs. Un parfum raffiné, intemporel et mystérieux.', array['Bergamote', 'Cardamome'], array['Bois précieux', 'Vanille'], array['Ambre', 'Musc', 'Bois secs'], '#8a6a3a', array['/products/ghost.jpg'], true, null, false, true, 1),
  ('sakina', 'SAKINA', 'ĆAAM', 'Extrait de parfum', 'esprits-libres', 'ambre', 'La douceur de la paix dans un flacon', 'SAKINA est une invitation à la sérénité. Ce parfum enveloppant associe la douceur de la vanille, la pureté du musc blanc et des notes lactées réconfortantes pour créer une sensation de calme, d''élégance et de bien-être. Un parfum unisexe conçu pour ceux qui recherchent une présence douce, raffinée et apaisante.', array['Notes lactées'], array['Vanille'], array['Musc blanc', 'Bois doux'], '#d4a59a', array['/products/sakina.jpg'], true, null, false, true, 2),
  ('azur', 'AZUR', 'ĆAAM', 'Extrait de parfum', 'lui', 'boise', 'Un parfum unique qui attire, et vous laisse un souvenir', 'AZUR est une fragrance magnétique et sophistiquée. La fraîcheur pétillante de la bergamote et de la cardamome s''ouvre sur un cœur boisé et vanillé chaleureux, pour se fondre dans un sillage profond d''ambre, de musc et de bois secs. Un parfum qui attire, marque les esprits et laisse une empreinte inoubliable.', array['Bergamote', 'Cardamome'], array['Bois précieux', 'Vanille'], array['Ambre', 'Musc', 'Bois secs'], '#2f4a7a', array['/products/azur.jpg'], true, null, false, true, 3),
  ('for-you', 'FOR YOU', 'ĆAAM', 'Extrait de parfum', 'esprits-libres', 'ambre', 'Une douceur gourmande qui attire et réconforte', 'FOR YOU est un parfum gourmand, chaleureux et irrésistiblement addictif. Inspiré des senteurs réconfortantes de vanille crémeuse, de lait onctueux, de caramel fondant et de miel délicat, il laisse un sillage doux qui attire naturellement l''attention. Un parfum unisexe qui évoque le plaisir, le confort et les souvenirs les plus tendres.', array['Notes lactées', 'Accord crémeux'], array['Vanille', 'Caramel'], array['Miel', 'Musc doux'], '#d9a066', array['/products/for-you.jpg'], true, null, false, true, 4)
on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  concentration = excluded.concentration,
  collection = excluded.collection,
  family = excluded.family,
  tagline = excluded.tagline,
  description = excluded.description,
  notes_top = excluded.notes_top,
  notes_heart = excluded.notes_heart,
  notes_base = excluded.notes_base,
  tint = excluded.tint,
  images = excluded.images,
  featured = excluded.featured,
  best_seller_rank = excluded.best_seller_rank,
  is_new = excluded.is_new,
  is_published = excluded.is_published,
  position = excluded.position;

-- Prix et stock : un nouveau lancement ne remet pas à zéro un stock déjà modifié dans Supabase.
insert into public.product_variants (product_id, sku, size_ml, price_xof, stock)
select p.id, v.sku, v.size_ml, v.price_xof, v.stock
from (values
  ('ghost', 'CAAM-GHO-50', 50, 22952, 10),
  ('sakina', 'CAAM-SAK-50', 50, 22958, 10),
  ('azur', 'CAAM-AZU-50', 50, 22952, 10),
  ('for-you', 'CAAM-FYO-50', 50, 22952, 10)
) as v (slug, sku, size_ml, price_xof, stock)
join public.products p on p.slug = v.slug
on conflict (sku) do update set
  size_ml = excluded.size_ml,
  price_xof = excluded.price_xof;
