-- Production assertions run only in a disposable database or a reviewed transaction.
begin;
create function pg_temp.expect(ok boolean,message text) returns void language plpgsql as $$
begin if ok is distinct from true then raise exception 'ASSERT: %',message; end if; end $$;

insert into auth.users(id,aud,role,email) values
 ('54000000-0000-4000-8000-000000000001','authenticated','authenticated','music-owner@example.test'),
 ('54000000-0000-4000-8000-000000000002','authenticated','authenticated','other-owner@example.test');
insert into public.establishments(id,name,slug) values
 ('54000000-0000-4000-8000-000000000011','Production A','music-prod-a'),
 ('54000000-0000-4000-8000-000000000012','Production B','music-prod-b');
insert into public.establishment_users(establishment_id,user_id) values
 ('54000000-0000-4000-8000-000000000011','54000000-0000-4000-8000-000000000001'),
 ('54000000-0000-4000-8000-000000000012','54000000-0000-4000-8000-000000000002');
insert into public.music_settings(establishment_id) values
 ('54000000-0000-4000-8000-000000000011'),('54000000-0000-4000-8000-000000000012');

do $$ declare f record; t record; begin
  perform pg_temp.expect((select not music_enabled and not requests_enabled from public.music_settings
    where establishment_id='54000000-0000-4000-8000-000000000011'),'default OFF');
  for f in select oid,proname,proconfig from pg_proc where pronamespace in ('public'::regnamespace,'private'::regnamespace)
    and proname like 'music_%' and proname not in ('music_player_topic') loop
    perform pg_temp.expect(f.proconfig @> array['search_path=""'],'fixed search path: '||f.proname);
    if f.proname='music_availability' then continue; end if;
    perform pg_temp.expect(not has_function_privilege('anon',f.oid,'execute'),'anon RPC denied: '||f.proname);
    if f.proname like 'music_admin_%' and f.proname<>'music_admin_lock' then
      perform pg_temp.expect(has_function_privilege('authenticated',f.oid,'execute'),'admin grant: '||f.proname);
      perform pg_temp.expect(not has_function_privilege('service_role',f.oid,'execute'),'no service admin grant: '||f.proname);
    else
      perform pg_temp.expect(not has_function_privilege('authenticated',f.oid,'execute'),'member technical/helper RPC denied: '||f.proname);
    end if;
  end loop;
  for t in select oid,relname from pg_class where relnamespace='private'::regnamespace and relkind='r' and relname like 'music_%' loop
    perform pg_temp.expect((select relrowsecurity from pg_class where oid=t.oid),'private RLS: '||t.relname);
    perform pg_temp.expect(not has_table_privilege('authenticated',t.oid,'select'),'private member read denied');
    perform pg_temp.expect(not has_table_privilege('service_role',t.oid,'update'),'private service direct update denied');
  end loop;
  perform pg_temp.expect(not has_function_privilege('anon','public.create_music_request(text,text,text,text,text)','execute'),'legacy admission revoked');
  perform pg_temp.expect(not has_function_privilege('service_role','public.advance_music_player(uuid,uuid,text,integer)','execute'),'legacy event revoked');
  perform pg_temp.expect(not has_function_privilege('service_role','public.claim_next_music_request(uuid)','execute'),'legacy claim revoked');
  perform pg_temp.expect(not has_table_privilege('authenticated','public.music_requests','update'),'direct admin update denied');
  perform pg_temp.expect(not has_table_privilege('service_role','public.music_requests','update'),'direct service update denied');
end $$;

set local role anon;
select pg_temp.expect(public.music_availability('music-prod-a')='{"enabled":false,"accepting":false}'::jsonb,'minimal public state');
do $$ begin
  begin perform public.create_music_request('music-prod-a','aaaaaaaaaaa','Title','Channel',null); raise exception 'public create bypass';
    exception when insufficient_privilege then null; end;
  begin perform public.music_player_state('music-prod-a',repeat('a',64),gen_random_uuid(),gen_random_uuid()); raise exception 'public claim bypass';
    exception when insufficient_privilege then null; end;
end $$;
reset role;

select set_config('request.jwt.claim.sub','54000000-0000-4000-8000-000000000001',true);
set local role authenticated;
select pg_temp.expect((select count(*)=1 from public.music_settings),'member settings RLS');
do $$ begin
  begin perform public.music_admin_settings('54000000-0000-4000-8000-000000000012',true,true); raise exception 'cross tenant settings';
    exception when insufficient_privilege then null; end;
end $$;
select public.music_admin_settings('54000000-0000-4000-8000-000000000011',true,true);
select set_config('test.prod.code',public.music_admin_pair('54000000-0000-4000-8000-000000000011'),true);
select pg_temp.expect(current_setting('test.prod.code') ~ '^[2-9A-HJ-NP-Z]{8}$','short unambiguous pairing code');
reset role;
select pg_temp.expect((select length(code_hash)=64 from private.music_pairings where establishment_id='54000000-0000-4000-8000-000000000011'),'pair digest only');

set local role service_role;
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('1',64),repeat('2',64),gen_random_uuid(),
 'aaaaaaaaaaa','First','Channel',null,clock_timestamp())->>'status'='offline','no offline admission');
select pg_temp.expect(public.music_redeem_pair('music-prod-b',encode(sha256(convert_to(current_setting('test.prod.code'),'UTF8')),'hex'),
 repeat('a',64),repeat('2',64))->>'status'='invalid','cross tenant pairing rejected');
select pg_temp.expect(public.music_redeem_pair('music-prod-a',encode(sha256(convert_to(current_setting('test.prod.code'),'UTF8')),'hex'),
 repeat('a',64),repeat('3',64))->>'status'='authorized','pair redemption');
select pg_temp.expect(public.music_redeem_pair('music-prod-a',encode(sha256(convert_to(current_setting('test.prod.code'),'UTF8')),'hex'),
 repeat('b',64),repeat('3',64))->>'status'='invalid','single use pairing');
select set_config('test.prod.instance',gen_random_uuid()::text,true);
select set_config('test.prod.boot',gen_random_uuid()::text,true);
select set_config('test.prod.state',public.music_player_state('music-prod-a',repeat('a',64),
 current_setting('test.prod.instance')::uuid,current_setting('test.prod.boot')::uuid)::text,true);
select pg_temp.expect(current_setting('test.prod.state')::jsonb->>'status'='waiting','initial WAITING');
select pg_temp.expect(public.music_player_state('music-prod-a',repeat('a',64),gen_random_uuid(),gen_random_uuid())->>'status'='busy','second tab denied');
select pg_temp.expect(public.music_player_state('music-prod-b',repeat('a',64),gen_random_uuid(),gen_random_uuid())->>'status'='unauthorized','cross tenant session');
select pg_temp.expect(public.music_player_heartbeat('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.state')::jsonb->>'leaseGeneration')::bigint,true)->>'status'='waiting','ready heartbeat');
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'search',1)->>'status'='quota_exhausted','quota defaults fail closed');
reset role;
delete from private.music_quota where bucket='search';
set local role service_role;
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'search',1)->>'status'='quota_exhausted','missing quota configuration fails closed');
reset role;
insert into private.music_quota(bucket) values('search');
update private.music_quota set daily_budget=2;
set local role service_role;
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'search',1)->>'status'='reserved','search reservation');
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'search',1)->>'status'='reserved','search reservation 2');
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'search',1)->>'status'='quota_exhausted','quota cap');
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'validate',1)->>'status'='reserved','separate video quota');
select set_config('test.prod.retry',gen_random_uuid()::text,true);
select set_config('test.prod.first',(public.music_admit_request('music-prod-a',repeat('1',64),repeat('2',64),current_setting('test.prod.retry')::uuid,
 'aaaaaaaaaaa','First','Channel',null,clock_timestamp())->>'requestId'),true);
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('1',64),repeat('2',64),'validate',1)->>'status'='limited','cooldown before upstream quota spend');
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('1',64),repeat('2',64),current_setting('test.prod.retry')::uuid,
 'aaaaaaaaaaa','Fresh metadata','Channel',null,clock_timestamp())->>'requestId'=current_setting('test.prod.first'),'retry not charged');
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('1',64),repeat('2',64),current_setting('test.prod.retry')::uuid,
 'bbbbbbbbbbb','Changed','Channel',null,clock_timestamp())->>'status'='retry_conflict','changed retry rejected');
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('1',64),repeat('2',64),gen_random_uuid(),
 'bbbbbbbbbbb','Too soon','Channel',null,clock_timestamp())->>'status'='limited','visitor cooldown');
select set_config('test.prod.second',(public.music_admit_request('music-prod-a',repeat('4',64),repeat('2',64),gen_random_uuid(),
 'bbbbbbbbbbb','Second','Channel',null,clock_timestamp())->>'requestId'),true);
select set_config('test.prod.state',public.music_player_state('music-prod-a',repeat('a',64),
 current_setting('test.prod.instance')::uuid,current_setting('test.prod.boot')::uuid)::text,true);
select pg_temp.expect(current_setting('test.prod.state')::jsonb->'track'->>'id'=current_setting('test.prod.first'),'FIFO first');
select pg_temp.expect(public.music_player_state('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 current_setting('test.prod.boot')::uuid)-'leaseExpiresAt'=current_setting('test.prod.state')::jsonb-'leaseExpiresAt',
 'healthy read does not change track/generation');
select set_config('test.prod.old',current_setting('test.prod.state'),true);
select set_config('test.prod.boot',gen_random_uuid()::text,true);
select set_config('test.prod.state',public.music_player_state('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 current_setting('test.prod.boot')::uuid)::text,true);
select pg_temp.expect((current_setting('test.prod.state')::jsonb->>'playbackGeneration')::bigint>
 (current_setting('test.prod.old')::jsonb->>'playbackGeneration')::bigint,'refresh fenced');
select pg_temp.expect(public.music_player_event('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.old')::jsonb->>'leaseGeneration')::bigint,(current_setting('test.prod.old')::jsonb->>'playbackGeneration')::bigint,
 current_setting('test.prod.first')::uuid,'ended')->>'status'='lease_lost','old same-request event rejected');
select pg_temp.expect(public.music_player_event('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.state')::jsonb->>'leaseGeneration')::bigint,(current_setting('test.prod.old')::jsonb->>'playbackGeneration')::bigint,
 current_setting('test.prod.first')::uuid,'ended')->>'ignored'='true','old playback generation ignored');
select set_config('test.prod.before',current_setting('test.prod.state'),true);
select set_config('test.prod.state',public.music_player_event('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.state')::jsonb->>'leaseGeneration')::bigint,(current_setting('test.prod.state')::jsonb->>'playbackGeneration')::bigint,
 current_setting('test.prod.first')::uuid,'ended')::text,true);
select pg_temp.expect(current_setting('test.prod.state')::jsonb->'track'->>'id'=current_setting('test.prod.second'),'ENDED advances');
select pg_temp.expect(public.music_player_event('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.before')::jsonb->>'leaseGeneration')::bigint,(current_setting('test.prod.before')::jsonb->>'playbackGeneration')::bigint,
 current_setting('test.prod.first')::uuid,'ended')->>'ignored'='true','duplicate ENDED ignored');
select pg_temp.expect(public.music_player_event('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.state')::jsonb->>'leaseGeneration')::bigint,(current_setting('test.prod.state')::jsonb->>'playbackGeneration')::bigint,
 current_setting('test.prod.second')::uuid,'error',101)->>'status'='waiting','ERROR to WAITING');
reset role;
select pg_temp.expect((select status='played' from public.music_requests where id=current_setting('test.prod.first')::uuid),'played history');
select pg_temp.expect((select status='failed' from public.music_requests where id=current_setting('test.prod.second')::uuid),'failed history');
select pg_temp.expect((select count(*)=2 from public.music_requests where establishment_id='54000000-0000-4000-8000-000000000011'),'no duplicate row');
select pg_temp.expect(not exists(select 1 from realtime.test_messages where payload<>'{}'::jsonb or event not in ('wake','instruction') or private),'opaque notifications');

-- Admin skip/remove/disable retain terminal history and don't replay.
insert into public.music_requests(establishment_id,youtube_video_id,title,channel_title,status,playing_at) values
 ('54000000-0000-4000-8000-000000000011','ccccccccccc','Third','Channel','playing',clock_timestamp());
insert into public.music_requests(establishment_id,youtube_video_id,title,channel_title) values
 ('54000000-0000-4000-8000-000000000011','ddddddddddd','Fourth','Channel');
select set_config('test.prod.third',(select id::text from public.music_requests where establishment_id='54000000-0000-4000-8000-000000000011' and youtube_video_id='ccccccccccc'),true);
select set_config('test.prod.fourth',(select id::text from public.music_requests where establishment_id='54000000-0000-4000-8000-000000000011' and youtube_video_id='ddddddddddd'),true);
set local role authenticated;
select pg_temp.expect(public.music_admin_remove('54000000-0000-4000-8000-000000000011',current_setting('test.prod.fourth')::uuid),'remove queued');
select pg_temp.expect(not public.music_admin_remove('54000000-0000-4000-8000-000000000011',current_setting('test.prod.third')::uuid),'cannot remove playing');
select pg_temp.expect(public.music_admin_skip('54000000-0000-4000-8000-000000000011',current_setting('test.prod.third')::uuid),'skip current');
select pg_temp.expect(not public.music_admin_skip('54000000-0000-4000-8000-000000000011',current_setting('test.prod.third')::uuid),'duplicate skip ignored');
select public.music_admin_settings('54000000-0000-4000-8000-000000000011',false,false);
reset role;
select pg_temp.expect((select status='skipped' and skipped_at is not null from public.music_requests where id=current_setting('test.prod.third')::uuid),'skipped retained');
select pg_temp.expect((select status='cancelled' and cancelled_at is not null from public.music_requests where id=current_setting('test.prod.fourth')::uuid),'cancelled retained');
set local role service_role;
select pg_temp.expect(public.music_player_state('music-prod-a',repeat('a',64),current_setting('test.prod.instance')::uuid,
 current_setting('test.prod.boot')::uuid)->>'status'='disabled','disabled TV');
reset role;
set local role authenticated;
select public.music_admin_settings('54000000-0000-4000-8000-000000000011',true,true);
select public.music_admin_revoke('54000000-0000-4000-8000-000000000011');
reset role;
set local role service_role;
select pg_temp.expect(public.music_player_state('music-prod-a',repeat('a',64),gen_random_uuid(),gen_random_uuid())->>'status'='unauthorized','revocation enforced');
reset role;

-- Persist failed pairing charges, rolling windows, network caps and cleanup.
set local role authenticated;
select set_config('test.prod.code',public.music_admin_pair('54000000-0000-4000-8000-000000000011'),true);
reset role;
update private.music_pairings set expires_at=clock_timestamp()-interval '1 second' where establishment_id='54000000-0000-4000-8000-000000000011';
set local role service_role;
select pg_temp.expect(public.music_redeem_pair('music-prod-a',encode(sha256(convert_to(current_setting('test.prod.code'),'UTF8')),'hex'),
 repeat('b',64),repeat('6',64))->>'status'='invalid','expired pairing rejected');
reset role;
set local role authenticated;
select set_config('test.prod.code',public.music_admin_pair('54000000-0000-4000-8000-000000000011'),true);
reset role;
set local role service_role;
select pg_temp.expect(public.music_redeem_pair('music-prod-a',encode(sha256(convert_to(current_setting('test.prod.code'),'UTF8')),'hex'),
 repeat('b',64),repeat('6',64))->>'status'='authorized','replacement device paired');
select set_config('test.prod.state',public.music_player_state('music-prod-a',repeat('b',64),
 current_setting('test.prod.instance')::uuid,current_setting('test.prod.boot')::uuid)::text,true);
select public.music_player_heartbeat('music-prod-a',repeat('b',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.state')::jsonb->>'leaseGeneration')::bigint,true);
select set_config('test.prod.recovery',(public.music_admit_request('music-prod-a',repeat('7',64),repeat('2',64),gen_random_uuid(),
 'eeeeeeeeeee','Recovery','Channel',null,clock_timestamp())->>'requestId'),true);
select set_config('test.prod.state',public.music_player_state('music-prod-a',repeat('b',64),
 current_setting('test.prod.instance')::uuid,current_setting('test.prod.boot')::uuid)::text,true);
reset role;
update private.music_leases set expires_at=clock_timestamp()-interval '1 second' where establishment_id='54000000-0000-4000-8000-000000000011';
set local role service_role;
select pg_temp.expect(public.music_player_event('music-prod-a',repeat('b',64),current_setting('test.prod.instance')::uuid,
 (current_setting('test.prod.state')::jsonb->>'leaseGeneration')::bigint,(current_setting('test.prod.state')::jsonb->>'playbackGeneration')::bigint,
 current_setting('test.prod.recovery')::uuid,'ended')->>'status'='lease_lost','expired lease rejects ENDED');
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('8',64),repeat('2',64),gen_random_uuid(),
 'fffffffffff','Offline','Channel',null,clock_timestamp())->>'status'='offline','expired lease rejects admission');
select pg_temp.expect(public.music_player_state('music-prod-a',repeat('b',64),current_setting('test.prod.instance')::uuid,
 gen_random_uuid())->'track'->>'id'=current_setting('test.prod.recovery'),'offline recovery preserves playing');
reset role;
select pg_temp.expect((select status='playing' from public.music_requests where id=current_setting('test.prod.recovery')::uuid),'timeout never marks played');
do $$ begin
  begin insert into private.music_receipts(establishment_id,visitor_hash,retry_id,video_id,request_id)
    values('54000000-0000-4000-8000-000000000012',repeat('1',64),gen_random_uuid(),'eeeeeeeeeee',current_setting('test.prod.recovery')::uuid);
    raise exception 'cross tenant receipt FK'; exception when foreign_key_violation then null; end;
end $$;
update private.music_leases set ready=true where establishment_id='54000000-0000-4000-8000-000000000011';
insert into private.music_rate_events(scope,actor,occurred_at)
 select 'request-visitor','54000000-0000-4000-8000-000000000011:'||repeat('8',64),clock_timestamp()-interval '5 minutes'*n
 from generate_series(1,5) n;
insert into private.music_rate_events(scope,actor)
 select 'request-network','54000000-0000-4000-8000-000000000011:'||repeat('6',64) from generate_series(1,60);
insert into private.music_rate_events(scope,actor)
 select 'api-search','54000000-0000-4000-8000-000000000011:'||repeat('9',64) from generate_series(1,5);
set local role service_role;
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('8',64),repeat('2',64),gen_random_uuid(),
 'fffffffffff','Hour limit','Channel',null,clock_timestamp())->>'status'='limited','five per rolling hour');
select pg_temp.expect(public.music_admit_request('music-prod-a',repeat('9',64),repeat('6',64),gen_random_uuid(),
 'fffffffffff','Network limit','Channel',null,clock_timestamp())->>'status'='limited','network request cap');
select pg_temp.expect(public.music_reserve_api('music-prod-a',repeat('9',64),repeat('2',64),'search',1)->>'status'='limited','search visitor cap');
do $$ begin
  begin perform public.music_admit_request('music-prod-a',repeat('a',64),repeat('2',64),gen_random_uuid(),
    'fffffffffff','Stale metadata','Channel',null,clock_timestamp()-interval '6 minutes');
    raise exception 'stale verification accepted'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
update private.music_devices set expires_at=clock_timestamp()-interval '1 second' where token_hash=repeat('b',64);
set local role service_role;
select pg_temp.expect(public.music_player_state('music-prod-a',repeat('b',64),gen_random_uuid(),gen_random_uuid())->>'status'='unauthorized','expired session');
reset role;

set local role service_role;
do $$ declare i integer; state jsonb; begin
  for i in 1..5 loop
    state:=public.music_redeem_pair('music-prod-a',repeat('0',64),repeat('b',64),repeat('9',64));
    perform pg_temp.expect(state->>'status'='invalid','failed pairing counted');
  end loop;
  perform pg_temp.expect(public.music_redeem_pair('music-prod-a',repeat('0',64),repeat('b',64),repeat('9',64))->>'status'='limited','pair brute cap');
end $$;
reset role;
update public.music_requests set metadata_verified_at=clock_timestamp()-interval '29 days 1 hour' where establishment_id='54000000-0000-4000-8000-000000000011';
update private.music_rate_events set occurred_at=clock_timestamp()-interval '23 hours 1 minute';
set local role service_role;
select public.music_cleanup();
reset role;
select pg_temp.expect(not exists(select 1 from public.music_requests where establishment_id='54000000-0000-4000-8000-000000000011'),'30-day metadata cleanup');
select pg_temp.expect(not exists(select 1 from private.music_devices where establishment_id='54000000-0000-4000-8000-000000000011'),'revoked digest cleanup');
select pg_temp.expect(not exists(select 1 from private.music_rate_events),'24h rate digest cleanup');
rollback;
