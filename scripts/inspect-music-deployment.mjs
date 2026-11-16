// Read-only Preview status; never print deployment environment values.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
try {
  const project=JSON.parse(readFileSync('.vercel/project.json','utf8'));
  const auth=JSON.parse(readFileSync(join(process.env.APPDATA,'com.vercel.cli/Data/auth.json'),'utf8'));
  const response=await fetch(`https://api.vercel.com/v6/deployments?projectId=${project.projectId}&teamId=${project.orgId}&limit=20`,
    {headers:{Authorization:`Bearer ${auth.token}`},signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw Error('Preview deployment status unavailable');
  const deployments=(await response.json()).deployments.filter(d=>
    d.meta?.githubCommitRef==='feat/music-production' || d.meta?.gitCommitRef==='feat/music-production');
  console.log(JSON.stringify(deployments.map(d=>({id:d.uid,url:`https://${d.url}`,state:d.readyState||d.state,
    target:d.target||'preview',createdAt:d.createdAt,commit:d.meta?.githubCommitSha||d.meta?.gitCommitSha}))));
} catch {console.error('Preview status unavailable; credentials withheld.');process.exitCode=1;}
