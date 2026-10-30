-- ============================================================
-- ĆAAM — DONNÉES DE DÉMONSTRATION (parfums, prix et stocks FICTIFS)
-- Généré par scripts/generate-demo-seed.mjs depuis src/lib/catalog/data.ts.
-- Ne pas modifier à la main : relancer le script.
--
-- À exécuter APRÈS la migration, dans Supabase > SQL Editor.
-- Peut être relancé sans risque : met à jour les parfums existants.
-- ============================================================

insert into public.products
  (slug, name, brand, concentration, collection, family, tagline, description,
   notes_top, notes_heart, notes_base, tint, images, featured, best_seller_rank, is_new, position, added_at)
values
  ('ambre-souverain', 'Ambre Souverain', 'ĆAAM', 'Extrait de parfum', 'esprits-libres', 'ambre', 'Une chaleur dorée qui ne s''éteint pas', 'Un ambre profond, illuminé de safran et adouci par la vanille. Ambre Souverain s''installe lentement sur la peau et laisse derrière lui un sillage enveloppant, presque magnétique.', array['Safran', 'Bergamote'], array['Ambre gris', 'Labdanum'], array['Vanille', 'Benjoin', 'Musc'], '#b8742e', '{}'::text[], true, 1, false, 1, '2026-01-15'::date),
  ('oud-imperial', 'Oud Impérial', 'ĆAAM', 'Extrait de parfum', 'lui', 'boise', 'La noblesse brute des bois précieux', 'L''oud dans toute sa puissance, relevé de poivre noir et posé sur un lit de santal et de cuir. Une signature intense, pour ceux qui aiment qu''on se souvienne de leur passage.', array['Poivre noir', 'Cardamome'], array['Oud', 'Rose'], array['Santal', 'Cuir', 'Patchouli'], '#4a3526', '{}'::text[], true, 2, false, 2, '2026-01-15'::date),
  ('rose-absolue', 'Rose Absolue', 'ĆAAM', 'Extrait de parfum', 'elle', 'floral', 'Une rose couronnée de lumière', 'La rose de Damas dans sa version la plus éclatante, rehaussée de litchi et de poivre rose. Une féminité assurée, à la fois fraîche et charnelle.', array['Litchi', 'Poivre rose'], array['Rose de Damas', 'Jasmin'], array['Musc blanc', 'Ambroxan'], '#b86a74', '{}'::text[], true, 3, false, 3, '2026-02-01'::date),
  ('cuir-nocturne', 'Cuir Nocturne', 'ĆAAM', 'Extrait de parfum', 'lui', 'cuir', 'Le velours d''un cuir fumé', 'Un cuir souple et fumé, traversé de tabac blond et de safran. Cuir Nocturne est un parfum du soir, sombre et élégant, qui se révèle au fil des heures.', array['Bergamote', 'Safran'], array['Cuir', 'Tabac blond'], array['Vétiver', 'Bouleau fumé'], '#2f2420', '{}'::text[], false, null, false, 4, '2026-02-20'::date),
  ('fleur-de-bissap', 'Fleur de Bissap', 'ĆAAM', 'Extrait de parfum', 'elle', 'floral', 'L''éclat pourpre de l''hibiscus', 'Un floral fruité et solaire, inspiré de la fleur d''hibiscus. La mandarine et la pivoine s''ouvrent sur un fond vanillé, gourmand sans jamais être sucré.', array['Hibiscus', 'Mandarine'], array['Pivoine', 'Fleur d''oranger'], array['Vanille', 'Musc'], '#8e2f45', '{}'::text[], false, null, true, 5, '2026-09-10'::date),
  ('encens-d-or', 'Encens d''Or', 'ĆAAM', 'Extrait de parfum', 'esprits-libres', 'epice', 'Une fumée sacrée, chaude et dorée', 'L''encens et la myrrhe s''élèvent comme une volute, portés par le safran et adoucis par l''ambre. Un parfum mystique et lumineux, à porter comme un rituel.', array['Encens', 'Poivre rose'], array['Myrrhe', 'Safran'], array['Oud', 'Ambre', 'Bois de gaïac'], '#8a5a2b', '{}'::text[], true, null, true, 6, '2026-09-25'::date),
  ('vetiver-blanc', 'Vétiver Blanc', 'ĆAAM', 'Extrait de parfum', 'lui', 'frais', 'Une fraîcheur minérale et racée', 'Le vétiver, débarrassé de sa rudesse, rencontre le citron et le gingembre. Une composition nette et lumineuse, élégante du matin au soir.', array['Citron', 'Gingembre'], array['Vétiver', 'Iris'], array['Cèdre', 'Musc'], '#8f9a84', '{}'::text[], false, 4, false, 7, '2026-03-05'::date),
  ('musc-velours', 'Musc Velours', 'ĆAAM', 'Extrait de parfum', 'elle', 'ambre', 'La douceur d''une seconde peau', 'Un musc poudré et enveloppant, réchauffé de vanille et de notes cachemire. Musc Velours se porte près du corps, comme un secret partagé.', array['Poire', 'Bergamote'], array['Musc', 'Iris'], array['Vanille', 'Bois de cachemire'], '#c9a58a', '{}'::text[], false, null, false, 8, '2026-04-12'::date),
  ('neroli-atlantique', 'Néroli Atlantique', 'ĆAAM', 'Extrait de parfum', 'esprits-libres', 'frais', 'L''océan au lever du jour', 'Le néroli et le citron vert portés par une brise saline, sur un fond de bois flotté. Une évasion lumineuse, entre l''Atlantique et la Méditerranée.', array['Néroli', 'Citron vert'], array['Sel marin', 'Fleur d''oranger'], array['Bois flotté', 'Ambrette'], '#6f9aa3', '{}'::text[], false, null, true, 9, '2026-08-30'::date),
  ('nuit-a-dakar', 'Nuit à Dakar', 'ĆAAM', 'Extrait de parfum', 'elle', 'epice', 'Une nuit chaude, épicée et vibrante', 'La prune et la cannelle s''ouvrent sur une tubéreuse opulente, avant un fond d''ambre et de vanille noire. Un parfum de fête, sensuel et inoubliable.', array['Prune', 'Cannelle'], array['Tubéreuse', 'Safran'], array['Ambre', 'Vanille noire'], '#5a2a3a', '{}'::text[], true, null, false, 10, '2026-06-18'::date)
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
  position = excluded.position,
  added_at = excluded.added_at;

insert into public.product_variants (product_id, sku, size_ml, price_xof, stock)
select p.id, v.sku, v.size_ml, v.price_xof, v.stock
from (values
  ('ambre-souverain', 'CAAM-AMS-50', 50, 55000, 14),
  ('ambre-souverain', 'CAAM-AMS-100', 100, 85000, 6),
  ('oud-imperial', 'CAAM-OUD-50', 50, 65000, 8),
  ('oud-imperial', 'CAAM-OUD-100', 100, 98000, 2),
  ('rose-absolue', 'CAAM-ROS-50', 50, 52000, 12),
  ('rose-absolue', 'CAAM-ROS-100', 100, 82000, 9),
  ('cuir-nocturne', 'CAAM-CUI-50', 50, 62000, 0),
  ('cuir-nocturne', 'CAAM-CUI-100', 100, 95000, 0),
  ('fleur-de-bissap', 'CAAM-BIS-50', 50, 48000, 20),
  ('fleur-de-bissap', 'CAAM-BIS-100', 100, 76000, 11),
  ('encens-d-or', 'CAAM-ENC-50', 50, 58000, 3),
  ('encens-d-or', 'CAAM-ENC-100', 100, 90000, 0),
  ('vetiver-blanc', 'CAAM-VET-50', 50, 45000, 16),
  ('vetiver-blanc', 'CAAM-VET-100', 100, 72000, 10),
  ('musc-velours', 'CAAM-MUS-50', 50, 50000, 9),
  ('musc-velours', 'CAAM-MUS-100', 100, 79000, 5),
  ('neroli-atlantique', 'CAAM-NER-50', 50, 46000, 18),
  ('neroli-atlantique', 'CAAM-NER-100', 100, 74000, 12),
  ('nuit-a-dakar', 'CAAM-NAD-50', 50, 60000, 7),
  ('nuit-a-dakar', 'CAAM-NAD-100', 100, 92000, 4)
) as v (slug, sku, size_ml, price_xof, stock)
join public.products p on p.slug = v.slug
on conflict (sku) do update set
  size_ml = excluded.size_ml,
  price_xof = excluded.price_xof,
  stock = excluded.stock;
