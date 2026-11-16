begin;
create function pg_temp.expect(ok boolean,message text) returns void language plpgsql as $$
begin if ok is distinct from true then raise exception 'ASSERT: %',message; end if; end $$;
insert into auth.users(id,aud,role,email) values
 ('56000000-0000-4000-8000-000000000001','authenticated','authenticated','admin-snapshot@example.test');
insert into public.establishments(id,name,slug) values
 ('56000000-0000-4000-8000-000000000011','Snapshot A','snapshot-a'),
 ('56000000-0000-4000-8000-000000000012','Snapshot B','snapshot-b');
insert into public.establishment_users(establishment_id,user_id) values
 ('56000000-0000-4000-8000-000000000011','56000000-0000-4000-8000-000000000001');
insert into public.music_requests(id,establishment_id,youtube_video_id,title,channel_title,requested_at) values
 ('56000000-0000-4000-8000-000000000021','56000000-0000-4000-8000-000000000011','aaaaaaaaaaa','Oldest','Channel',now()-interval '2 seconds'),
 ('56000000-0000-4000-8000-000000000022','56000000-0000-4000-8000-000000000011','bbbbbbbbbbb','Next','Channel',now()-interval '1 second'),
 ('56000000-0000-4000-8000-000000000023','56000000-0000-4000-8000-000000000012','ccccccccccc','Other tenant','Channel',now());
select pg_temp.expect(not has_function_privilege('anon','public.music_admin_state(uuid)','execute'),'anonymous snapshot denied');
select pg_temp.expect(not has_function_privilege('service_role','public.music_admin_state(uuid)','execute'),'TV service snapshot denied');
set local role authenticated;
select set_config('request.jwt.claim.sub','56000000-0000-4000-8000-000000000001',true);
do $$ declare snapshot jsonb; begin
  snapshot:=public.music_admin_state('56000000-0000-4000-8000-000000000011');
  perform pg_temp.expect(snapshot->>'enabled'='false' and snapshot->>'online'='false' and snapshot->>'paired'='false','default offline/OFF');
  perform pg_temp.expect(jsonb_array_length(snapshot->'queue')=2,'own active queue only');
  perform pg_temp.expect(snapshot->'queue'->0->>'title'='Oldest','FIFO snapshot');
  perform pg_temp.expect(snapshot->'queue'->1->>'title'='Next','second FIFO entry');
  perform pg_temp.expect(not snapshot::text~'token_hash|visitor|network|pairing|Other tenant','snapshot privacy');
  begin
    perform public.music_admin_state('56000000-0000-4000-8000-000000000012');
    raise exception 'cross tenant accepted';
  exception when insufficient_privilege then null; end;
  perform pg_temp.expect(not public.music_admin_remove('56000000-0000-4000-8000-000000000011','56000000-0000-4000-8000-000000000023'),'foreign request ignored');
  perform pg_temp.expect(public.music_admin_remove('56000000-0000-4000-8000-000000000011','56000000-0000-4000-8000-000000000021'),'own queued removed');
  perform pg_temp.expect(not public.music_admin_remove('56000000-0000-4000-8000-000000000011','56000000-0000-4000-8000-000000000021'),'stale remove false');
  snapshot:=public.music_admin_state('56000000-0000-4000-8000-000000000011');
  perform pg_temp.expect(jsonb_array_length(snapshot->'queue')=1,'history excluded');
end $$;
reset role;
insert into public.establishment_users(establishment_id,user_id) values
 ('56000000-0000-4000-8000-000000000012','56000000-0000-4000-8000-000000000001');
set local role authenticated;
do $$ begin
  begin perform public.music_admin_state('56000000-0000-4000-8000-000000000011');raise exception 'multi membership accepted';
  exception when insufficient_privilege then null;end;
end $$;
rollback;
