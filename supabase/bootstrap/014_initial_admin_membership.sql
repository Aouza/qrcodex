\set ON_ERROR_STOP on

\if :{?admin_email}
\else
  \echo 'Missing required variable: admin_email'
  \quit 1
\endif

\if :{?establishment_slug}
\else
  \echo 'Missing required variable: establishment_slug'
  \quit 1
\endif

select count(*) = 1 as bootstrap_user_ok
from auth.users
where lower(email) = lower(:'admin_email')
\gset

\if :bootstrap_user_ok
\else
  \echo 'Expected exactly one Auth user for admin_email'
  \quit 1
\endif

select count(*) = 1 as bootstrap_establishment_ok
from public.establishments
where slug = :'establishment_slug'
\gset

\if :bootstrap_establishment_ok
\else
  \echo 'Expected exactly one establishment for establishment_slug'
  \quit 1
\endif

begin;

insert into public.establishment_users (establishment_id, user_id, role)
select establishment.id, auth_user.id, 'owner'
from public.establishments establishment
cross join auth.users auth_user
where establishment.slug = :'establishment_slug'
  and lower(auth_user.email) = lower(:'admin_email')
on conflict (establishment_id, user_id) do update
set role = excluded.role;

commit;
