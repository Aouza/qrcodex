-- Short human-entry code; device session tokens and authorization are unchanged.
-- CREATE OR REPLACE preserves the existing authenticated-only function grants.
create or replace function public.music_admin_pair(p_tenant uuid,p_replace boolean default false) returns text
language plpgsql security definer set search_path='' as $$
declare code text; entropy bytea; alphabet constant text:='23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; i integer;
begin
  perform private.music_admin_lock(p_tenant);
  if exists(select 1 from private.music_devices where establishment_id=p_tenant
    and revoked_at is null and expires_at>clock_timestamp()) then
    if not coalesce(p_replace,false) then raise exception 'device_already_paired' using errcode='22023'; end if;
    perform public.music_admin_revoke(p_tenant);
  end if;
  perform private.music_rate_lock();
  if not private.music_rate_ok('pair-issue',p_tenant::text,10,interval '1 hour') or
    not private.music_rate_ok('pair-issue-global','global',1000,interval '1 hour') then
    raise exception 'pair_issue_limit' using errcode='22023';
  end if;
  perform private.music_charge('pair-issue',p_tenant::text);
  perform private.music_charge('pair-issue-global','global');
  -- Eight uniform base32 symbols (40 bits) from a cryptographically random UUID.
  -- Serialized issuance and collision retry preserve the global hash uniqueness.
  loop
    entropy:=sha256(convert_to(gen_random_uuid()::text,'UTF8'));
    code:='';
    for i in 0..7 loop
      code:=code||substr(alphabet,(get_byte(entropy,i) & 31)+1,1);
    end loop;
    exit when not exists(select 1 from private.music_pairings
      where code_hash=encode(sha256(convert_to(code,'UTF8')),'hex'));
  end loop;
  update private.music_pairings set consumed_at=clock_timestamp() where establishment_id=p_tenant and consumed_at is null;
  insert into private.music_pairings(code_hash,establishment_id,expires_at)
    values(encode(sha256(convert_to(code,'UTF8')),'hex'),p_tenant,clock_timestamp()+interval '10 minutes');
  return code;
end $$;
