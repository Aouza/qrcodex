// Explicitly authorized controlled production rehearsal, not public acceptance.
// Existing public Supabase variables are untouched; secrets stay server-only.
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {join} from 'node:path';
import {randomBytes} from 'node:crypto';
try {
  const project=JSON.parse(readFileSync('.vercel/project.json','utf8'));
  const auth=JSON.parse(readFileSync(join(process.env.APPDATA,'com.vercel.cli/Data/auth.json'),'utf8'));
  const local=parseEnv(readFileSync('.env.production.local','utf8'));
  const origin='https://qrcodex-eight.vercel.app';
  if(project.projectName!=='qrcodex' || !auth.token) throw Error('Unexpected production project/auth');
  const suffix=`?teamId=${project.orgId}`;
  async function api(path,options={}) {
    const response=await fetch(`https://api.vercel.com${path}`,{...options,
      headers:{Authorization:`Bearer ${auth.token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(20000)});
    if(!response.ok) throw Error(`Production provisioning HTTP ${response.status}`);
    return response.json();
  }
  const domains=(await api(`/v9/projects/${project.projectId}/domains${suffix}`)).domains;
  if(!domains.some(d=>d.name===new URL(origin).hostname && !d.redirect && !d.gitBranch))
    throw Error('Approved production origin missing');
  const existing=(await api(`/v9/projects/${project.projectId}/env${suffix}`)).envs;
  const values={SUPABASE_SERVICE_ROLE_KEY:local.SUPABASE_SERVICE_ROLE_KEY,
    YOUTUBE_MUSIC_API_KEY:local.YOUTUBE_MUSIC_API_KEY,MUSIC_PRODUCTION_ENABLED:'true',MUSIC_APP_ORIGIN:origin};
  if(!values.SUPABASE_SERVICE_ROLE_KEY || !values.YOUTUBE_MUSIC_API_KEY) throw Error('Missing server credentials');
  if(!existing.some(v=>v.key==='MUSIC_SESSION_SECRET' && v.target?.includes('production')))
    values.MUSIC_SESSION_SECRET=randomBytes(48).toString('base64url');
  const variables=Object.entries(values).map(([key,value])=>({key,value,type:'encrypted',target:['production'],
    comment:'TASK-058 user-authorized owner rehearsal; not commercial/manual acceptance'}));
  if(process.argv.includes('--apply')) {
    const result=await api(`/v10/projects/${project.projectId}/env${suffix}&upsert=true`,{method:'POST',body:JSON.stringify(variables)});
    if(result.failed?.length) throw Error('Production configuration incomplete');
    console.log(JSON.stringify({configured:variables.map(v=>v.key),origin,previewSecretsUnchanged:true}));
  } else console.log(JSON.stringify({mode:'read-only',origin,variables:variables.map(v=>v.key)}));
} catch {console.error('Production provisioning unavailable; sensitive diagnostics withheld');process.exitCode=1;}
