// Branch-scoped Preview provisioning only. Never log tokens/environment values.
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';

try {
  const project = JSON.parse(readFileSync('.vercel/project.json','utf8'));
  const auth = JSON.parse(readFileSync(join(process.env.APPDATA,'com.vercel.cli/Data/auth.json'),'utf8'));
  const local = parseEnv(readFileSync('.env.production.local','utf8'));
  const branch = 'feat/music-production';
  const git = spawnSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,
    'branch','--show-current'],{encoding:'utf8'});
  if (git.status !== 0 || git.stdout.trim() !== branch || project.projectName !== 'qrcodex')
    throw Error('Unexpected branch/project');
  if (!auth.token) throw Error('Vercel authentication unavailable');
  async function api(path, options={}) {
    const response = await fetch(`https://api.vercel.com${path}`,{...options,
      headers:{Authorization:`Bearer ${auth.token}`,'Content-Type':'application/json'},
      signal:AbortSignal.timeout(20000)});
    if (!response.ok) {
      const body=await response.json().catch(()=>null);
      const code=body?.error?.code;
      let category='';
      if (/gitBranch|git branch|Git repository/i.test(body?.error?.message||'')) {
        let message=body.error.message;
        const sent=options.body ? JSON.parse(options.body) : [];
        for (const value of [...Object.values(local),auth.token,...(Array.isArray(sent)?sent.map(v=>v.value):[])])
          if (typeof value==='string' && value.length>3) message=message.replaceAll(value,'[redacted]');
        category=` (${message.replace(/[\r\n]/g,' ').slice(0,220)})`;
      }
      throw Error(`Vercel provisioning HTTP ${response.status}${typeof code==='string' && /^[a-z0-9_-]+$/i.test(code)?` ${code}`:''}${category}`);
    }
    return response.json();
  }
  const suffix = `?teamId=${encodeURIComponent(project.orgId)}`;
  const settings = await api(`/v9/projects/${project.projectId}${suffix}`);
  if (settings.ssoProtection?.deploymentType !== 'all_except_custom_domains' &&
      settings.ssoProtection?.deploymentType !== 'all') throw Error('Protected Preview required');
  const existing = (await api(`/v9/projects/${project.projectId}/env${suffix}`)).envs || [];
  const values = Object.fromEntries(['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY','YOUTUBE_MUSIC_API_KEY'].map(key=>[key,local[key]]));
  if (Object.values(values).some(value=>!value?.trim())) throw Error('Missing local server configuration');
  values.MUSIC_PRODUCTION_ENABLED = 'true';
  if (!existing.some(variable=>variable.key==='MUSIC_SESSION_SECRET' && variable.gitBranch===branch &&
      variable.target?.includes('preview'))) values.MUSIC_SESSION_SECRET = randomBytes(48).toString('base64url');
  const variables = Object.entries(values).map(([key,value])=>({key,value,type:'encrypted',
    target:['preview'],gitBranch:branch,comment:'TASK-058 protected Music rehearsal; production DB, module remains OFF'}));
  if (!process.argv.includes('--apply')) {
    console.log(JSON.stringify({mode:'read-only',branch,protected:true,variables:variables.map(v=>v.key)}));
  } else {
    const result = await api(`/v10/projects/${project.projectId}/env${suffix}&upsert=true`,
      {method:'POST',body:JSON.stringify(variables)});
    if (result.failed?.length) throw Error('Some Preview variables were not provisioned');
    const after = (await api(`/v9/projects/${project.projectId}/env${suffix}`)).envs || [];
    if (variables.some(variable=>!after.some(v=>v.key===variable.key && v.gitBranch===branch &&
        v.target?.length===1 && v.target[0]==='preview'))) throw Error('Preview scope verification failed');
    console.log(JSON.stringify({branch,protected:true,provisioned:variables.length,
      productionEnvironmentChanged:false,secretsPrinted:false}));
  }
} catch (error) {
  // Only our fixed messages, never provider response bodies or configuration.
  const safe = error instanceof Error && /^(Unexpected|Vercel|Protected|Missing|Some|Preview)/.test(error.message);
  console.error(safe ? error.message : 'Preview provisioning unavailable; sensitive diagnostics withheld.');
  process.exitCode=1;
}
