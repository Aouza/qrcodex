// Public production smoke: no admin/device login, queue mutation or Google call.
import assert from 'node:assert/strict';
const origin='https://qrcodex-eight.vercel.app';
async function request(path,options={}) {
  return fetch(origin+path,{...options,signal:AbortSignal.timeout(20000),redirect:'manual'});
}
try {
  const hub=await request('/relicas');
  assert.equal(hub.status,200);
  const html=await hub.text();
  assert.match(html,/href="\/relicas\/musicas"/);
  assert.ok(!html.includes('Não foi possível carregar este estabelecimento'));
  for(const path of ['/relicas/cardapio','/relicas/agenda','/relicas/musicas','/relicas/musicas/player']) {
    const response=await request(path);assert.equal(response.status,200,path);
    const body=await response.text();assert.ok(!body.includes('NEXT_HTTP_ERROR_FALLBACK;404'),path);
  }
  const headers={'Content-Type':'application/json',Origin:origin};
  const player=await request('/api/music/player',{method:'POST',headers,
    body:JSON.stringify({operation:'state',slug:'relicas',instanceId:'65000000-0000-4000-8000-000000000001',bootId:'65000000-0000-4000-8000-000000000002'})});
  assert.equal(player.status,401);
  const consent=await request('/api/music/public',{method:'POST',headers,body:JSON.stringify({operation:'consent',slug:'relicas',accepted:true})});
  assert.equal(consent.status,200);
  const cookies=consent.headers.getSetCookie();
  assert.ok(cookies.some(cookie=>/HttpOnly/i.test(cookie)&&/Secure/i.test(cookie)&&/SameSite=Strict/i.test(cookie)));
  const badOrigin=await request('/api/music/public',{method:'POST',headers:{...headers,Origin:'https://example.invalid'},
    body:JSON.stringify({operation:'consent',slug:'relicas',accepted:true})});
  assert.equal(badOrigin.status,403);
  assert.equal((await request('/api/youtube/poc/search')).status,404);
  assert.equal((await request('/api/music/cleanup')).status,401);
  console.log('Production HTTP PASS: Hub/Music/Menu/Agenda/player, secure consent, unauthorized player, origin and legacy/cleanup boundaries. No queue or Google calls.');
} catch(error) {console.error(`Production HTTP FAIL: ${error.message.split('\n')[0]}`);process.exitCode=1;}
