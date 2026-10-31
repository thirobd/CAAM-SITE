-- ============================================================
-- ĆAAM — un parfum peut apparaître dans plusieurs collections
--
-- « collection » reste la collection principale (fil d'Ariane, fiche).
-- « also_in » liste les collections où il est aussi proposé : par exemple
-- un parfum mixte rangé « Pour elle » et « Esprits libres ».
-- ============================================================

alter table public.products
  add column if not exists also_in text[] not null default '{}'
  constraint products_also_in_check check (also_in <@ array['elle', 'lui', 'esprits-libres']::text[]);

-- SAKINA et FOR YOU : « Extrait de parfum mixte » dans le catalogue WhatsApp, rangés « Pour elle ».
update public.products
set also_in = array['esprits-libres']
where slug in ('sakina', 'for-you');
