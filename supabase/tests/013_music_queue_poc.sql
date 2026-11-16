begin;

do $$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid(); u uuid := gen_random_uuid();
begin
  perform set_config('app.test.music_a', a::text, true);
  perform set_config('app.test.music_b', b::text, true);
  perform set_config('app.test.music_user', u::text, true);
  insert into auth.users(id, aud, role, email) values(u, 'authenticated', 'authenticated', u || '@example.test');
  insert into public.establishments(id, name, slug) values(a, 'Music A', a::text), (b, 'Music B', b::text);
  insert into public.establishment_users(establishment_id, user_id) values(a, u);
  if not (select relrowsecurity from pg_class where oid = 'public.music_requests'::regclass) then
    raise exception 'RLS missing';
  end if;
  if has_table_privilege('anon', 'public.music_requests', 'SELECT')
     or has_table_privilege('anon', 'public.music_requests', 'INSERT')
     or has_table_privilege('anon', 'public.music_requests', 'UPDATE')
     or has_table_privilege('anon', 'public.music_requests', 'DELETE')
     or has_table_privilege('authenticated', 'public.music_requests', 'UPDATE') then
    raise exception 'Unexpected direct queue privilege';
  end if;
  if has_function_privilege('anon', 'public.claim_next_music_request(uuid)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.claim_next_music_request(uuid)', 'EXECUTE')
     or has_function_privilege('anon', 'public.advance_music_player(uuid,uuid,text,integer)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.advance_music_player(uuid,uuid,text,integer)', 'EXECUTE')
     or has_function_privilege('anon', 'public.mark_music_request_played(uuid,uuid)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.mark_music_request_failed(uuid,uuid,text)', 'EXECUTE')
     or has_function_privilege('anon', 'public.music_player_topic(uuid)', 'EXECUTE') then
    raise exception 'Lifecycle/topic RPC exposed to browser roles';
  end if;
end;
$$;

set local role anon;
do $$
declare r public.music_requests;
begin
  r := public.create_music_request(current_setting('app.test.music_a'), 'aaaaaaaaaaa', 'First', 'Channel', null);
  if r.id is null or r.status <> 'queued' or r.establishment_id <> current_setting('app.test.music_a')::uuid
     or r.playing_at is not null then raise exception 'Unsafe public creation'; end if;
  perform set_config('app.test.first', r.id::text, true);
  r := public.create_music_request(current_setting('app.test.music_b'), 'bbbbbbbbbbb', 'Other tenant', 'Channel', null);
  perform set_config('app.test.other', r.id::text, true);
  begin
    update public.music_requests set status = 'played' where id = current_setting('app.test.first')::uuid;
    raise exception 'Anon direct update accepted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.advance_music_player(current_setting('app.test.music_a')::uuid, current_setting('app.test.first')::uuid, 'ended');
    raise exception 'Anon player event accepted';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

-- Explicit instants: now() is transaction-stable, so sleeping cannot test FIFO.
update public.music_requests set requested_at = '2026-01-01' where id = current_setting('app.test.first')::uuid;
select set_config('request.jwt.claim.sub', current_setting('app.test.music_user'), true);
set local role authenticated;
do $$
begin
  if (select count(*) from public.music_requests) <> 1 then raise exception 'Member RLS leaked other tenant'; end if;
  begin
    update public.music_requests set status = 'failed' where establishment_id = current_setting('app.test.music_a')::uuid;
    raise exception 'Member direct update accepted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.claim_next_music_request(current_setting('app.test.music_a')::uuid);
    raise exception 'Member lifecycle RPC accepted';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

set local role service_role;
do $$
declare
  a uuid := current_setting('app.test.music_a')::uuid;
  b uuid := current_setting('app.test.music_b')::uuid;
  first_id uuid := current_setting('app.test.first')::uuid;
  other_id uuid := current_setting('app.test.other')::uuid;
  second public.music_requests; third public.music_requests; r public.music_requests;
  topic_a text; topic_b text;
begin
  topic_a := public.music_player_topic(a); topic_b := public.music_player_topic(b);
  if topic_a is null or topic_a = topic_b or topic_a <> public.music_player_topic(a) then
    raise exception 'Wake-up topics must be stable and tenant-separated';
  end if;
  second := public.create_music_request(a::text, 'ccccccccccc', 'Second', 'Channel', null);
  update public.music_requests set requested_at = '2026-01-02' where id = second.id;
  r := public.claim_next_music_request(a);
  if r.id is distinct from first_id or r.status <> 'playing' then raise exception 'FIFO claim failed'; end if;
  third := public.create_music_request(a::text, 'ddddddddddd', 'Third', 'Channel', null);
  update public.music_requests set requested_at = '2026-01-03' where id = third.id;
  r := public.claim_next_music_request(a);
  if r.id is distinct from first_id then raise exception 'New request interrupted playback'; end if;
  r := public.advance_music_player(a, other_id, 'ended');
  if r.id is distinct from first_id then raise exception 'Cross-tenant event changed playback'; end if;
  r := public.advance_music_player(a, second.id, 'ended');
  if r.id is distinct from first_id then raise exception 'Queued request event changed playback'; end if;
  begin
    update public.music_requests set status = 'playing', playing_at = now() where id = second.id;
    raise exception 'Unique one-playing invariant failed';
  exception when unique_violation then null; end;
  r := public.advance_music_player(a, first_id, 'ended');
  if r.id is distinct from second.id then raise exception 'ENDED did not advance'; end if;
  if not exists(select 1 from public.music_requests where id = first_id and status = 'played' and played_at is not null) then
    raise exception 'ENDED did not mark played'; end if;
  r := public.advance_music_player(a, first_id, 'ended');
  if r.id is distinct from second.id then raise exception 'Duplicate stale ENDED changed current track'; end if;
  r := public.advance_music_player(b, second.id, 'ended');
  if r.id is not null then raise exception 'Cross-tenant request advanced another tenant'; end if;
  begin
    perform public.advance_music_player(a, second.id, 'error', 999);
    raise exception 'Invalid error code accepted';
  exception when invalid_parameter_value then null; end;
  r := public.advance_music_player(a, second.id, 'error', 150);
  if r.id is distinct from third.id then raise exception 'ERROR did not advance'; end if;
  if not exists(select 1 from public.music_requests where id = second.id and status = 'failed'
      and failed_at is not null and failure_reason = 'youtube_error_150') then
    raise exception 'ERROR did not mark failed'; end if;
  r := public.advance_music_player(a, third.id, 'ended');
  if r.id is not null then raise exception 'Empty queue must wait'; end if;
  r := public.claim_next_music_request(a);
  if r.id is not null then raise exception 'History re-entered active queue'; end if;
  r := public.claim_next_music_request(b);
  if r.id is distinct from other_id then raise exception 'Cross-tenant event changed queued request'; end if;
  perform set_config('app.test.second', second.id::text, true);
end;
$$;
reset role;

-- Disabled establishments cannot create, claim or process playback events.
update public.establishments set active = false where id = current_setting('app.test.music_b')::uuid;
set local role service_role;
do $$
declare r public.music_requests;
begin
  r := public.claim_next_music_request(current_setting('app.test.music_b')::uuid);
  if r.id is not null then raise exception 'Inactive tenant claimed playback'; end if;
  r := public.advance_music_player(current_setting('app.test.music_b')::uuid, current_setting('app.test.other')::uuid, 'ended');
  if r.id is not null then raise exception 'Inactive tenant processed event'; end if;
  r := public.create_music_request(current_setting('app.test.music_b'), 'eeeeeeeeeee', 'Inactive', 'Channel', null);
  if r.id is not null then raise exception 'Inactive tenant accepted request'; end if;
end;
$$;
reset role;
rollback;
