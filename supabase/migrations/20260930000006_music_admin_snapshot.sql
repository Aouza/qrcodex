-- Membership-only, tenant-consistent read model. Never returns device tokens,
-- pairing hashes/codes, visitor identities or historical requests.
create function public.music_admin_state(p_tenant uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare settings public.music_settings; current_track jsonb; queue jsonb; topic text;
begin
  perform private.music_admin_lock(p_tenant);
  select * into settings from public.music_settings where establishment_id=p_tenant;
  select jsonb_build_object('id',id,'title',title,'channelTitle',channel_title,'requestedAt',requested_at)
    into current_track from public.music_requests where establishment_id=p_tenant and status='playing';
  select coalesce(jsonb_agg(row_data order by requested_at,id),'[]'::jsonb) into queue from (
    select id,requested_at,jsonb_build_object('id',id,'title',title,'channelTitle',channel_title,'requestedAt',requested_at) row_data
    from public.music_requests where establishment_id=p_tenant and status='queued'
    order by requested_at,id limit 100
  ) requests;
  topic:=public.music_player_topic(p_tenant);
  return jsonb_build_object('enabled',settings.music_enabled,'requestsEnabled',settings.requests_enabled,
    'online',private.music_live(p_tenant),'paired',exists(select 1 from private.music_devices
      where establishment_id=p_tenant and revoked_at is null and expires_at>clock_timestamp()),
    'topic',topic,'current',current_track,'queue',queue);
end $$;
revoke all on function public.music_admin_state(uuid) from public,anon,authenticated,service_role;
grant execute on function public.music_admin_state(uuid) to authenticated;
