import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/Users/aliso/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/aliso/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe'});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://172.31.176.1:3000/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 for(const width of [1440,1024,768,360,320]){
  await page.setViewportSize({width,height:1000});const section=page.locator('section').filter({has:page.locator('#depoimentos-titulo')});await section.scrollIntoViewIfNeeded();
  assert.equal(await section.locator('blockquote').count(),3);assert.equal(await section.locator('time').count(),0);
  for(const name of ['Gilson Amorim','Karol Paixão','Jéssica Castro'])assert(await section.getByText(name,{exact:true}).isVisible());
  const text=await section.innerText();assert(!/há \d+|meses|ilustrativos/.test(text));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  await section.screenshot({path:`output/site-real-testimonials-review/testimonials-${width}.png`});console.log('PASS',width);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
