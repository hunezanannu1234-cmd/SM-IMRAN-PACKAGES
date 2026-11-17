// Starts the app on a random port and checks pages, validation, CSRF and a real enquiry submission.
process.env.DB_FILE = './data/test.sqlite'; delete process.env.WHATSAPP_NUMBER; let fails = 0;
const chk = (n, c) => { console.log((c ? 'PASS ' : 'FAIL ') + n); if (!c) fails++; };
chk('WhatsApp unset -> safe /contact fallback', require('../src/config/company').whatsappLink === '/contact#whatsapp' && !require('../src/config/company').hasWhatsApp);
process.env.WHATSAPP_NUMBER = '+000 TEST'; delete require.cache[require.resolve('../src/config/company')];
chk('WhatsApp set -> wa.me link', /^https:\/\/wa\.me\/000/.test(require('../src/config/company').whatsappLink)); delete process.env.WHATSAPP_NUMBER; delete require.cache[require.resolve('../src/config/company')]; const fs = require('fs'); try { fs.unlinkSync('./data/test.sqlite'); } catch {}
const app = require('../server'), db = require('../src/config/db');
setTimeout(async () => {
  const srv = app.listen(0), base = 'http://localhost:' + srv.address().port;
  for (const p of ['/', '/about', '/products', '/custom-packaging', '/process', '/gallery', '/contact', '/quote', '/privacy', '/terms', '/placeholder/Test.svg', '/images/logo.jpeg', '/css/style.css', '/js/main.js'])
    chk('GET ' + p, (await fetch(base + p)).status === 200);
  const home = await (await fetch(base + '/')).text(), prod = await (await fetch(base + '/products')).text();
  for (const [n, h] of [['home', home], ['products', prod]]) { chk(n + ': packaging solutions heading', h.includes('Explore Our Packaging Solutions')); chk(n + ': custom CTA copy + both buttons', h.includes('Have Something Different in Mind?') && h.includes('Discuss Your Packaging Requirements') && h.includes('Request a Custom Quote')); }
  const industryList = home.match(/<ul class="industry-list"[\s\S]*?<\/ul>/);
  chk('home: industry section follows custom packaging and precedes why', /<section class="feature custom-cta"[\s\S]*?<section class="sec industry-sec"[\s\S]*?Why SM IMRAN PACKAGES/.test(home));
  chk('home: all 22 industry examples are listed', industryList && [...industryList[0].matchAll(/<li(?:\s|>)/g)].length === 22);
  chk('home: custom enquiry message and individual-feasibility note', home.includes('Not seeing your required packaging? We welcome custom enquiries for products beyond our listed range.') && home.includes('manufacturing feasibility are reviewed individually'));
  chk('custom CTA follows last product card', /Window Carton[\s\S]*?<section class="feature custom-cta"/.test(prod));
  chk('tagline + timeline on home', home.includes('Strong Carton, Trusted Quality') && home.includes('Sample Approval &amp; Order Agreement'));
  const links = new Set(); for (const p of ['/', '/about', '/products', '/custom-packaging', '/process', '/gallery', '/contact', '/quote']) for (const m of (await (await fetch(base + p)).text()).matchAll(/href="(\/[^"#]*)/g)) links.add(m[1].replace(/&amp;/g, '&'));
  let bad = []; for (const l of links) if ((await fetch(base + encodeURI(l))).status >= 400) bad.push(l); chk('all ' + links.size + ' internal links resolve' + (bad.length ? ' BAD: ' + bad : ''), !bad.length);
  const imgs = new Set(); for (const p of ['/', '/products', '/about', '/custom-packaging', '/process', '/gallery']) for (const m of (await (await fetch(base + p)).text()).matchAll(/src="(\/(?:images|placeholder)[^"]+)/g)) imgs.add(m[1]);
  let badImg = []; for (const i of imgs) { const r = await fetch(base + i); if (r.status !== 200 || !/image\//.test(r.headers.get('content-type'))) badImg.push(i); } chk('all ' + imgs.size + ' images and fonts load' + (badImg.length ? ' BAD: ' + badImg : ''), !badImg.length && imgs.size > 20);
  for (const f of ['dm-serif-display-latin-400-normal.woff2', 'inter-latin-wght-normal.woff2']) chk('font ' + f, (await fetch(base + '/fonts/' + f)).status === 200);
  chk('no external font requests', !home.includes('googleapis'));
  chk('404 page', (await fetch(base + '/nope')).status === 404);
  const page = await fetch(base + '/quote'), cookie = page.headers.get('set-cookie').split(';')[0], csrf = (await page.text()).match(/name="_csrf" value="(\w+)"/)[1];
  const post = (fields, tok = csrf) => { const f = new FormData(); Object.entries({ _csrf: tok, ...fields }).forEach(([k, v]) => f.append(k, v)); f.append('attachments', new Blob(['%PDF-1.4 test'], { type: 'application/pdf' }), 'ref.pdf'); return fetch(base + '/quote', { method: 'POST', body: f, headers: { cookie } }); };
  const upCount = () => fs.readdirSync('./storage/uploads').filter(f => f !== '.gitkeep').length, before = upCount();
  chk('bad CSRF rejected', (await post({ company_name: 'A' }, 'bad')).status === 403);
  chk('invalid form rejected', (await post({ company_name: 'A' })).status === 422);
  await new Promise(r => setTimeout(r, 300)); chk('rejected submissions leave no orphaned uploads', upCount() === before);
  const ok = await post({ company_name: 'Test Co', contact_person: 'Ali', phone: '0300 1234567', city: 'Karachi', product_type: 'Plain Carton', length: '10', width: '8', height: '6', unit: 'inch' });
  const html = await ok.text();
  chk('valid enquiry accepted', ok.status === 200 && /SMI-\d{4}-/.test(html) && /not<\/strong> an order/.test(html));
  const e = await db('enquiries').first(), fl = await db('enquiry_files').first();
  chk('enquiry saved as New Enquiry', e && e.status === 'New Enquiry'); chk('upload stored privately', fl && fs.existsSync('./storage/uploads/' + fl.stored_name));
  chk('uploads not web-accessible', (await fetch(base + '/storage/uploads/' + fl.stored_name)).status === 404);
  chk('activity logged', (await db('activity_log').count({ c: '*' }).first()).c === 1);
  if (fl) fs.unlinkSync('./storage/uploads/' + fl.stored_name);
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); srv.close(); await db.destroy(); fs.unlinkSync('./data/test.sqlite'); process.exit(fails ? 1 : 0);
}, 1500);
