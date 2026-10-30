-- ============================================================
-- ĆAAM — Connexion à l'espace propriétaire par nom d'utilisateur.
-- Retrouve l'adresse e-mail du compte administrateur correspondant
-- au nom d'utilisateur (public.admins.username).
-- ============================================================

create or replace function public.admin_login_email(p_username text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email
  from public.admins a
  join auth.users u on u.id = a.user_id
  where a.username = lower(trim(p_username));
$$;

revoke all on function public.admin_login_email(text) from public;
grant execute on function public.admin_login_email(text) to anon, authenticated;

-- Déclarer un administrateur (une fois le compte créé dans Authentication > Users) :
-- insert into public.admins (user_id, username)
-- select id, 'nom-utilisateur' from auth.users where email = 'adresse@exemple.com';
