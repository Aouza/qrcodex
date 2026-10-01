// Check staged release content against local secrets without printing matches.
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { spawnSync } from 'node:child_process';
const git = args => {
  const result=spawnSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{encoding:'utf8',maxBuffer:32*1024*1024});
  if(result.status!==0) throw Error('Staged content unavailable');
  return result.stdout;
};
try {
  const names=git(['diff','--cached','--name-only','-z']).split('\0').filter(Boolean);
  const secrets=[];
  for(const path of ['.env.local','.env.production.local']) {
    try {for(const [key,value] of Object.entries(parseEnv(readFileSync(path,'utf8'))))
      if(/SECRET|TOKEN|PASSWORD|DATABASE_URL|API_KEY|PLAYER_KEY/.test(key) && value.length>=16) secrets.push(value);
    } catch(error) {if(error.code!=='ENOENT') throw error;}
  }
  for(const name of names) {
    if(name.startsWith('.release-backups/') || name.startsWith('.claude/') || name.startsWith('.vercel/') ||
      (name.startsWith('.env') && name!=='.env.example')) throw Error('Excluded artifact staged');
    const body=git(['show',`:${name}`]);
    if(secrets.some(value=>body.includes(value)) || /AIza[\w-]{35}|sb_secret_[\w-]{20,}/.test(body))
      throw Error('Potential credential in staged release content');
  }
  console.log(`Release secret scan PASS: ${names.length} staged files; no secret values printed.`);
} catch(error) {console.error(error.message);process.exitCode=1;}
