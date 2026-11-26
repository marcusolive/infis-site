import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CONFIG, img } from './config.js';
import { T, CLIENTS, HERO_SLIDES, SECTOR_IMAGES } from './content.js';
import BLOG from './blog.json';
import { logoSVG, markSVG } from './logo.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const waLink = (num, text) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches && !(import.meta.env.DEV && location.search.includes('motion'));
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------- Idioma ---------------- */
const lang = document.documentElement.dataset.lang === 'en' ? 'en' : 'pt';
const L = T[lang];
const t = (path) => path.split('.').reduce((o, k) => o?.[k], L) ?? '';
localStorage.setItem('infis-lang', lang);
document.title = L.meta.title;
$('meta[name="description"]').content = L.meta.desc;

$$('[data-t]').forEach((el) => (el.textContent = t(el.dataset.t)));
$$('[data-t-html]').forEach((el) => (el.innerHTML = t(el.dataset.tHtml)));
$$('[data-t-attr]').forEach((el) => { const [a, k] = el.dataset.tAttr.split(':'); el.setAttribute(a, t(k)); });
$$('[data-setlang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.setlang === lang));

/* ---------------- Marca ---------------- */
$$('[data-logo]').forEach((el) => (el.innerHTML = logoSVG({ dark: true, className: 'lg-dark' }) + logoSVG({ className: 'lg-light' })));
$('[data-mark]').innerHTML = markSVG();
$('#year').textContent = new Date().getFullYear();

/* ---------------- Conteúdo ---------------- */
const NAV = [['#solutions', 'solutions'], ['#clients', 'clients'], ['#reforma', 'reforma'], ['#about', 'about'], ['#offices', 'offices'], ['#contact', 'contact']];
$('#nav').innerHTML = NAV.map(([h, k]) => `<a href="${h}">${L.nav[k]}</a>`).join('');
$('#drawerNav').innerHTML = NAV.map(([h, k]) => `<a href="${h}">${L.nav[k]}</a>`).join('');
$('.hd__burger').setAttribute('aria-label', L.nav.menu);

$('#facts').innerHTML = L.hero.facts.map(([n, l]) => `<div class="fact"><b>${n}</b><span>${l}</span></div>`).join('');
const pad = (n) => String(n).padStart(2, '0');
$('#introPoints').innerHTML = L.intro.points.map(([h, p], i) => `<li class="why__card tilt"><span class="why__n">${pad(i + 1)}</span><h4>${h}</h4><p>${p}</p><i class="tilt__glare" aria-hidden="true"></i></li>`).join('');

// Clientes
const sectorKeys = Object.keys(L.clients.sectors);
const count = (k) => CLIENTS.filter((c) => c.sector === k).length;
$('#clientFilters').innerHTML = [['all', L.clients.all, CLIENTS.length], ...sectorKeys.map((k) => [k, L.clients.sectors[k], count(k)])]
  .map(([k, label, n], i) => `<button role="tab" aria-selected="${i === 0}" data-sector="${k}">${label}<sup>${n}</sup></button>`).join('');
$('#clientDesc').textContent = L.clients.allDesc;
$('#logos').innerHTML = CLIENTS.map((c) => `<li class="logo" data-sector="${c.sector}"><img src="${c.logo}" alt="${esc(c.name)}" loading="lazy" decoding="async" /><span>${esc(c.name)}</span></li>`).join('');

// Soluções
const itemsHTML = (items) => `<ul class="ix__items">${items.map(([h, d]) => (d ? `<li><b>${h}</b><p>${d}</p></li>` : `<li class="is-plain"><b>${h}</b></li>`)).join('')}</ul>`;
const groupHTML = (g) => `<div class="ix__group"><h4>${g.name}</h4>${g.desc ? `<p>${g.desc}</p>` : ''}${typeof g.items[0] === 'string'
  ? `<ul class="ix__bullets">${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>` : itemsHTML(g.items)}</div>`;
$('#index').innerHTML = L.solutions.pillars.map((p, i) => `
  <li class="ix">
    <button class="ix__row" aria-expanded="false">
      <span class="ix__n">${pad(i + 1)}</span><span class="ix__name">${p.name}</span><span class="ix__desc">${p.desc}</span><span class="ix__plus" aria-hidden="true"></span>
    </button>
    <div class="ix__panel"><div>
      ${p.intro ? `<p class="ix__intro">${p.intro}</p>` : ''}
      ${p.groups ? `<div class="ix__groups">${p.groups.map(groupHTML).join('')}</div>` : itemsHTML(p.items)}
      <div class="ix__talk">${p.link
        ? `<a class="link-arrow" href="${p.link}"><span>${L.solutions.more}</span><i class="arr"></i></a>`
        : `<a class="link-arrow" href="#contact" data-interest="${esc(p.name)}"><span>${L.solutions.talk}</span><i class="arr"></i></a>`}</div>
    </div></div>
  </li>`).join('');

$('#figures').innerHTML = L.numbers.items.map(([n, s, l]) => `<div class="figure"><b><span data-count="${n}">0</span>${s ? `<sup>${s}</sup>` : ''}</b><p>${l}</p></div>`).join('');

$('#years').innerHTML = L.reforma.steps.map(([h, sub, p], i) => `<article class="yr"><b>${pad(i + 1)}</b><h3>${h}</h3><p class="yr__sub">${sub}</p><p>${p}</p></article>`).join('');

$('#steps').innerHTML = L.method.steps.map((p, i) => `<li class="step step--text"><span class="step__n">${pad(i + 1)}</span><p>${p}</p></li>`).join('');

const sectorIds = Object.keys(L.sectors.items);
$('#sectorMedia').innerHTML = sectorIds.map((k, i) => `<img data-src="${SECTOR_IMAGES[k]}" data-w="2000" alt="" class="${i === 0 ? 'is-on' : ''}" data-sector="${k}" />`).join('');
$('#sectorList').innerHTML = sectorIds.map((k, i) => `
  <li class="sector ${i === 0 ? 'is-on' : ''}" data-sector="${k}"><button><b>${L.sectors.items[k][0]}</b></button><p>${L.sectors.items[k][1]}</p></li>`).join('');

$('#values').innerHTML = L.values.items.map(([h, p]) => `<div class="value"><h3>${h}</h3><p>${p}</p></div>`).join('');
$('#team').innerHTML = L.team.people.map(([n, role, bio], i) => `<li><button class="team__btn" aria-expanded="false" aria-controls="bio${i}"><b>${n}</b><span>${role}</span></button><div class="team__bio" id="bio${i}"><div>${bio.map((p) => `<p>${p}</p>`).join('')}</div></div></li>`).join('');
$('#team').addEventListener('click', (e) => {
  const b = e.target.closest('.team__btn');
  if (!b) return;
  const li = b.parentElement, open = !li.classList.contains('is-open');
  li.classList.toggle('is-open', open);
  b.setAttribute('aria-expanded', open);
  setTimeout(() => ScrollTrigger.refresh(), 650);
});

$('#faqList').innerHTML = L.faq.items.map(([q, a]) => `<details class="faq__item"><summary>${q}</summary><p>${a}</p></details>`).join('');

$('#offices-list').innerHTML = CONFIG.units.map((u) => `
  <article class="office">
    <div class="img-mask"><img data-src="${u.image}" data-w="1000" alt="${u.city}" /></div>
    <span class="office__tag">${L.offices.unit}</span>
    <h3>${u.city}</h3>
    <address>${u.address}<br>${u.cityLine}</address>
    ${u.email ? `<p class="office__mail"><a href="mailto:${u.email}">${u.email}</a></p>` : ''}
    <div class="office__links">
      ${u.phone ? `<a href="tel:${u.phone}"><span>${u.phoneLabel}</span><small>${L.offices.phone}</small></a>` : ''}
      <a href="${waLink(u.whatsapp, L.contact.waHello)}" target="_blank" rel="noopener"><span>${u.whatsappLabel}</span><small>WhatsApp</small></a>
      <button data-map="${esc(u.mapQuery || `${u.address}, ${u.cityLine}`)}"><span>${L.offices.map}</span><i class="arr"></i></button>
    </div>
  </article>`).join('');

const ins = L.insights;
const blogBase = lang === 'en' ? `${CONFIG.site}/blog-en` : CONFIG.blog;
const locale = lang === 'en' ? 'en-US' : 'pt-BR';
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
const when = (iso) => {
  const days = Math.round((new Date(iso) - Date.now()) / 864e5);
  return days > -8 ? rtf.format(days, 'day') : new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
};
const fullDate = (iso) => new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
const posts = BLOG[lang] || [];
const meta = (p, extra = '') => `<div class="news__meta">${p.category ? `<b>${esc(p.category)}</b>` : ''}<time datetime="${p.date}" title="${fullDate(p.date)}">${when(p.date)}</time>${extra}</div>`;
const mins = (p) => (p.minutes ? `<span>${Math.max(1, Math.round(p.minutes))} ${ins.min}</span>` : '');
const link = (p, inner, cls = '') => `<a class="${cls}" href="${p.url}" target="_blank" rel="noopener">${inner}</a>`;
if (posts.length) {
  const [top, ...rest] = posts;
  $('#newsGrid').innerHTML = `
    <article class="news__lead tilt">${link(top, `
      <span class="news__flag">${ins.lead1}</span>
      ${meta(top, mins(top))}
      <h3>${esc(top.title)}</h3>
      <p>${esc(top.summary)}</p>
      <div class="news__foot">${top.author ? `<span>${ins.by} ${esc(top.author)}</span>` : '<span></span>'}<span class="link-arrow"><span>${ins.read}</span><i class="arr"></i></span></div>`)}
      <i class="tilt__glare" aria-hidden="true"></i>
    </article>
    <ol class="news__list">${rest.slice(0, 4).map((p, i) => `<li>${link(p, `<span class="news__idx">${pad(i + 2)}</span><div>${meta(p)}<h4>${esc(p.title)}</h4></div>`)}</li>`).join('')}</ol>`;
  $('#newsMore').innerHTML = rest.length > 4
    ? `<div class="news__row">${rest.slice(4, 8).map((p) => `<article class="news__card tilt">${link(p, `${meta(p)}<h4>${esc(p.title)}</h4><p>${esc(p.summary)}</p>`)}<i class="tilt__glare" aria-hidden="true"></i></article>`).join('')}</div>` : '';
  $('#newsMore').insertAdjacentHTML('beforeend', `<div class="news__bar"><span>${ins.updated} ${fullDate(BLOG.updated)}</span><a class="link-arrow" href="${blogBase}" target="_blank" rel="noopener"><span>${ins.all}</span><i class="arr"></i></a></div>`);
  const tick = posts.map((p) => `<a href="${p.url}" target="_blank" rel="noopener" tabindex="-1"><time>${new Date(p.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' })}</time>${esc(p.title)}</a>`).join('');
  $('#newsTicker').innerHTML = tick + tick;
}
$('#newsletterBox').innerHTML = `<div><small>${ins.nl[0]}</small><h3>${ins.nl[1]}</h3></div><form id="newsletter" novalidate><label class="sr" for="nlEmail" hidden>${ins.nl[3]}</label><input id="nlEmail" type="email" placeholder="${ins.nl[3]}" autocomplete="email" required /><button class="btn btn--ink btn--sm" type="submit">${ins.nl[2]}</button><p class="msg" role="status"></p></form>`;

const C = L.contact;
$('#direct').innerHTML = CONFIG.units.filter((u) => u.phone).map((u) => `
  <li><a href="${waLink(u.whatsapp, C.waHello)}" target="_blank" rel="noopener"><div><b>${u.city}</b><small>WhatsApp ${u.whatsappLabel}${u.phone.replace('+', '') !== u.whatsapp ? ` · ${u.phoneLabel}` : ''}</small></div><i class="arr"></i></a></li>`).join('');

const topics = L.solutions.pillars.map((p) => p.name);
$('#form').innerHTML = `
  <fieldset><legend>${C.interest}</legend><div class="chips">${topics.map((n) => `<label class="chip"><input type="checkbox" name="interesse" value="${esc(n)}"><span>${n}</span></label>`).join('')}</div></fieldset>
  <div class="row2"><label class="field"><span>${C.fields.name} *</span><input name="nome" required autocomplete="name"></label><label class="field"><span>${C.fields.company} *</span><input name="empresa" required autocomplete="organization"></label></div>
  <div class="row2"><label class="field"><span>${C.fields.email} *</span><input name="email" type="email" required autocomplete="email"></label><label class="field"><span>${C.fields.phone} *</span><input name="telefone" type="tel" required autocomplete="tel" inputmode="tel"></label></div>
  <div class="row2"><label class="field"><span>${C.fields.size}</span><select name="porte">${C.sizes.map((s) => `<option>${s}</option>`).join('')}</select></label><label class="field"><span>${C.fields.role} *</span><input name="cargo" required autocomplete="organization-title"></label></div>
  <label class="field"><span>${C.fields.office}</span><select name="unidade">${CONFIG.units.map((u) => `<option value="${u.id}">${u.city}</option>`).join('')}</select></label>
  <label class="field"><span>${C.fields.message}</span><textarea name="mensagem" rows="3"></textarea></label>
  <label class="consent"><input type="checkbox" name="optin" value="sim"><span>${C.consent}</span></label>
  <button class="btn btn--ink" type="submit"><span>${C.send}</span><i class="arr"></i></button>
  <p class="msg" role="status"></p>`;

$('#ftSol').innerHTML = L.solutions.pillars.map((p) => `<li><a href="#solutions">${p.name}</a></li>`).join('');
$('#ftCo').innerHTML = [['#about', L.nav.about], ['#clients', L.nav.clients], ['#reforma', L.nav.reforma], ['#insights', ins.label], ['#contact', L.nav.contact]].map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('');
$('#ftOff').innerHTML = CONFIG.units.map((u) => `<li>${u.city}<small>${u.address}</small></li>`).join('');

const ICONS = {
  linkedin: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/>',
  instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15 2 14.7 2 12 2z"/>',
  youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/>',
  facebook: '<path d="M14 8V6c0-.9.2-1.4 1.6-1.4H18V1h-3.3C10.8 1 9.9 3.4 9.9 6v2H7v3.8h2.9V23H14V11.8h3.3l.5-3.8z"/>',
};
$('#social').innerHTML = Object.entries(CONFIG.social).map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24">${ICONS[k]}</svg></a>`).join('');
$('#waPanel').innerHTML = `<p>${L.wa.pick}</p>` + CONFIG.units.filter((u) => u.phone).map((u) => `<a href="${waLink(u.whatsapp, C.waHello)}" target="_blank" rel="noopener">${u.city}<span>${u.whatsappLabel}</span></a>`).join('');

/* ---------------- Imagens sob demanda ---------------- */
const io = new IntersectionObserver((entries) => entries.forEach(({ isIntersecting, target }) => {
  if (!isIntersecting) return;
  const w = +target.dataset.w || Math.min(2400, Math.round((target.parentElement.clientWidth || 1200) * Math.min(devicePixelRatio, 2)));
  target.src = img(target.dataset.src, w);
  io.unobserve(target);
}), { rootMargin: '800px 0px' });
$$('img[data-src]').forEach((i) => io.observe(i));

/* ---------------- Rolagem ---------------- */
let lenis;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  if (import.meta.env.DEV) window.__lenis = lenis;
}
const scrollTo = (target) => (lenis ? lenis.scrollTo(target, { duration: 1.6 }) : $(target)?.scrollIntoView({ behavior: 'smooth' }));

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2 || !$(id)) return;
  e.preventDefault();
  if (a.dataset.interest) preselect(a.dataset.interest);
  closeDrawer();
  scrollTo(id);
});

/* ---------------- Header ---------------- */
const hd = $('#hd');
let lastY = 0;
const heroH = () => $('.hero').offsetHeight - 80;
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: (s) => {
    const y = s.scroll();
    hd.classList.toggle('is-solid', y > heroH());
    hd.classList.toggle('is-hidden', y > 300 && y > lastY && !document.body.classList.contains('drawer-open'));
    lastY = y;
  },
});
NAV.forEach(([h]) => {
  const sec = $(h);
  if (!sec) return;
  ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: ({ isActive }) => $$(`.hd__nav a[href="${h}"]`).forEach((a) => a.classList.toggle('is-active', isActive)) });
});

const burger = $('.hd__burger'), drawer = $('#drawer');
function closeDrawer() {
  drawer.classList.remove('is-open'); document.body.classList.remove('drawer-open');
  burger.setAttribute('aria-expanded', false); drawer.setAttribute('aria-hidden', true); lenis?.start();
}
burger.addEventListener('click', () => {
  const open = !drawer.classList.contains('is-open');
  if (!open) return closeDrawer();
  drawer.classList.add('is-open'); document.body.classList.add('drawer-open');
  burger.setAttribute('aria-expanded', true); drawer.setAttribute('aria-hidden', false); lenis?.stop();
});

/* Troca de idioma: cortina fecha, recarrega no outro idioma e abre de novo */
$$('[data-setlang]').forEach((b) => b.addEventListener('click', () => {
  const next = b.dataset.setlang;
  if (next === lang) return;
  localStorage.setItem('infis-lang', next);
  sessionStorage.setItem('infis-y', String(scrollY));
  const url = new URL(location.href);
  url.searchParams.set('lang', next);
  const curtain = $('#curtain');
  curtain.style.display = 'grid';
  gsap.fromTo(curtain, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power4.inOut', onComplete: () => location.replace(url) });
}));

/* ---------------- Clientes ---------------- */
$('#clientFilters').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  $$('#clientFilters button').forEach((x) => x.setAttribute('aria-selected', x === b));
  const k = b.dataset.sector;
  $('#clientDesc').textContent = k === 'all' ? L.clients.allDesc : L.clients.desc[k];
  const items = $$('.logo');
  gsap.to(items, {
    opacity: 0, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      items.forEach((i) => (i.hidden = k !== 'all' && i.dataset.sector !== k));
      const shown = items.filter((i) => !i.hidden);
      gsap.fromTo(shown, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.025, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() });
    },
  });
});

/* ---------------- Soluções ---------------- */
$('#index').addEventListener('click', (e) => {
  const row = e.target.closest('.ix__row');
  if (!row) return;
  const item = row.parentElement;
  const open = !item.classList.contains('is-open');
  $$('.ix').forEach((x) => { x.classList.remove('is-open'); $('.ix__row', x).setAttribute('aria-expanded', false); });
  if (open) { item.classList.add('is-open'); row.setAttribute('aria-expanded', true); }
  setTimeout(() => ScrollTrigger.refresh(), 850);
});

/* Inclinação 3D que acompanha o cursor */
if (fine && !reduced) {
  $$('.tilt, .value').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    const glare = $('.tilt__glare', card);
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      gsap.set(card, { transformPerspective: 900 });
      rx(-y * 7); ry(x * 9);
      if (glare) gsap.set(glare, { opacity: 1, background: `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(245,130,31,.16), transparent 55%)` });
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); if (glare) gsap.to(glare, { opacity: 0, duration: 0.5 }); });
  });
}

/* ---------------- Setores ---------------- */
function setSector(k) {
  $$('.sector').forEach((s) => s.classList.toggle('is-on', s.dataset.sector === k));
  $$('#sectorMedia img').forEach((i) => {
    const on = i.dataset.sector === k;
    if (on && !i.src) i.src = img(i.dataset.src, 2000);
    i.classList.toggle('is-on', on);
  });
}
$$('.sector').forEach((s) => {
  $('button', s).addEventListener('click', () => setSector(s.dataset.sector));
  if (fine) $('button', s).addEventListener('pointerenter', () => setSector(s.dataset.sector));
});

/* ---------------- Mapa ---------------- */
const map = $('#map');
$('#offices-list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-map]');
  if (!b) return;
  map.hidden = false;
  $('iframe', map).src = `https://www.google.com/maps?q=${encodeURIComponent(b.dataset.map)}&hl=${lang === 'en' ? 'en' : 'pt-BR'}&output=embed`;
  ScrollTrigger.refresh();
  scrollTo('#map');
});
$('.map__close').addEventListener('click', () => { map.hidden = true; $('iframe', map).src = 'about:blank'; ScrollTrigger.refresh(); });

/* ---------------- WhatsApp ---------------- */
const waBtn = $('.wa__btn'), waPanel = $('#waPanel');
waBtn.addEventListener('click', () => { waPanel.hidden = !waPanel.hidden; waBtn.setAttribute('aria-expanded', !waPanel.hidden); });
document.addEventListener('click', (e) => { if (!e.target.closest('.wa')) { waPanel.hidden = true; waBtn.setAttribute('aria-expanded', false); } });

$('#faqWa').href = waLink(CONFIG.units[0].whatsapp, C.waHello);

/* ---------------- Formulários ---------------- */
function preselect(name) {
  const box = $$('#form [name=interesse]').find((i) => i.value === name);
  if (box) box.checked = true;
}
async function postJSON(url, data) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
  if (!r.ok) throw new Error(String(r.status));
}
const form = $('#form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('.msg', form);
  let ok = true;
  $$('[required]', form).forEach((f) => {
    const bad = f.type === 'checkbox' ? !f.checked : !f.value.trim() || !f.checkValidity();
    (f.type === 'checkbox' ? f.closest('.consent') : f).classList.toggle('is-invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.className = 'msg err'; msg.textContent = C.errors; return; }
  const fd = new FormData(form);
  const data = Object.fromEntries(fd);
  data.interesse = fd.getAll('interesse').join(', ');
  data.idioma = lang;
  data.origem = location.href;
  const unit = CONFIG.units.find((u) => u.id === data.unidade);
  const btn = $('button[type=submit]', form);
  btn.disabled = true;
  try {
    if (CONFIG.formEndpoint) {
      await postJSON(CONFIG.formEndpoint, data);
      msg.className = 'msg ok'; msg.textContent = C.sent; form.reset();
    } else {
      window.open(waLink(unit.whatsapp, C.waText(data)), '_blank', 'noopener');
      msg.className = 'msg ok'; msg.textContent = C.wa(unit.city);
    }
    track('generate_lead', { unidade: data.unidade, idioma: lang });
  } catch {
    msg.className = 'msg err'; msg.textContent = C.fail;
  } finally { btn.disabled = false; }
});
form.addEventListener('input', (e) => (e.target.type === 'checkbox' ? e.target.closest('.consent') : e.target)?.classList.remove('is-invalid'));

$('#newsletter').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget, input = $('input', f), msg = $('.msg', f);
  if (!input.value || !input.checkValidity()) { input.classList.add('is-invalid'); msg.className = 'msg err'; msg.textContent = ins.nl[5]; return; }
  input.classList.remove('is-invalid');
  try {
    if (!CONFIG.newsletterEndpoint) throw new Error('endpoint');
    await postJSON(CONFIG.newsletterEndpoint, { email: input.value, idioma: lang });
    msg.className = 'msg ok'; msg.textContent = ins.nl[4]; f.reset();
    track('sign_up', { method: 'newsletter' });
  } catch { msg.className = 'msg err'; msg.textContent = ins.nl[6]; }
});

/* ---------------- Cookies (LGPD) e GA4 ---------------- */
function track(name, params) { window.gtag?.('event', name, params); }
function loadGA() {
  if (!CONFIG.ga4Id || window.gtag) return;
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4Id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date()); window.gtag('config', CONFIG.ga4Id, { anonymize_ip: true });
}
const cookie = $('#cookie');
const consent = localStorage.getItem('infis-consent');
if (consent === 'allow') loadGA();
if (!consent) setTimeout(() => (cookie.hidden = false), 3000);
cookie.addEventListener('click', (e) => {
  const b = e.target.closest('[data-cookie]');
  if (!b) return;
  localStorage.setItem('infis-consent', b.dataset.cookie);
  cookie.hidden = true;
  if (b.dataset.cookie === 'allow') loadGA();
});
$('#cookiePrefs').addEventListener('click', () => (cookie.hidden = false));

/* ---------------- Hero ---------------- */
const ring = $('#ringProg');
let ringTween;
function slideChanged(i) {
  $('#slideNum').textContent = String(i + 1).padStart(2, '0');
  ringTween?.kill();
  ringTween = gsap.fromTo(ring, { strokeDashoffset: 603.2 }, { strokeDashoffset: 0, duration: 8.4, ease: 'none' });
}
async function bootHero() {
  const urls = HERO_SLIDES.map((id) => img(id, Math.min(2400, Math.round(innerWidth * Math.min(devicePixelRatio, 1.5)))));
  try {
    if (reduced) throw new Error('reduced');
    const { initHeroGL } = await import('./hero-gl.js');
    await initHeroGL($('#gl'), urls, { onChange: slideChanged });
  } catch {
    document.documentElement.classList.add('no-gl');
    const fb = $('#heroFallback');
    fb.innerHTML = urls.map((u, i) => `<img src="${u}" alt="" class="${i === 0 ? 'is-on' : ''}">`).join('');
    if (!reduced) {
      let i = 0;
      setInterval(() => { const im = $$('img', fb); im[i].classList.remove('is-on'); i = (i + 1) % im.length; im[i].classList.add('is-on'); slideChanged(i); }, 8400);
    }
  }
  slideChanged(0);
}

/* ---------------- Animações ---------------- */
function splitLines(el) {
  // quebra por linha visual: mede as palavras e agrupa pelo topo
  const html = el.innerHTML;
  const tmp = html.replace(/<br\s*\/?>/gi, '   ');
  const words = tmp.split(/\s+/).filter(Boolean);
  el.innerHTML = words.map((w) => (w === ' ' ? '<br>' : `<span class="wm">${w}</span>`)).join(' ');
  const lines = [];
  let top = null;
  $$('.wm', el).forEach((s) => {
    const y = s.offsetTop;
    if (top === null || Math.abs(y - top) > 4) { lines.push([]); top = y; }
    lines[lines.length - 1].push(s.innerHTML);
  });
  el.innerHTML = lines.map((l) => `<span class="split-line"><span>${l.join(' ')}</span></span>`).join('');
  // tags <em> abertas em uma linha e fechadas em outra são reequilibradas pelo navegador
  return $$('.split-line > span', el);
}
function splitWords(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  return $$('.w', el);
}

function animate() {
  const heroLines = splitLines($('.hero__title'));
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .fromTo(heroLines, { yPercent: 105 }, { yPercent: 0, duration: 1.5, stagger: 0.1 })
    .fromTo('.hero .kicker, .hero__lead, .hero__actions', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, '-=1.2')
    .fromTo('.fact', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, '-=1')
    .fromTo('.hero__ring', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.4 }, '-=1.2')
    .fromTo('.hd', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=1.4');

  gsap.to('.hero__grid', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  $$('[data-split]').forEach((h) => {
    const lines = splitLines(h);
    gsap.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 86%' } });
  });

  const words = splitWords($('[data-words]'));
  gsap.to(words, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: '[data-words]', start: 'top 78%', end: 'bottom 50%', scrub: true } });

  $$('.parallax').forEach((im) => gsap.fromTo(im, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.img-mask').forEach((m) => gsap.fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: m, start: 'top 88%' } }));
  $$('.cinema__bg img, .contact__bg img').forEach((im) => gsap.fromTo(im, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: im.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));

  const reveal = '.lead, .why__lead, .filters, .logo, .ix, .figure, .step, .team__list li, .office, .news__list li, .news__bar, .news__nl, .direct li, .form > *, .sector, .faq__item';
  gsap.set(reveal, { opacity: 0, y: 30 });
  ScrollTrigger.batch(reveal, {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', overwrite: true, clearProps: 'transform' }),
  });

  const cards3d = '.tilt, .value';
  gsap.set(cards3d, { opacity: 0, y: 60, rotationX: -16, transformPerspective: 1000, transformOrigin: '50% 100%' });
  ScrollTrigger.batch(cards3d, {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, rotationX: 0, duration: 1.3, stagger: 0.09, ease: 'expo.out', overwrite: true }),
  });
  $$('.tilt-media').forEach((fig) => gsap.fromTo(fig, { rotationY: -8, rotationX: 4, transformPerspective: 1200 }, {
    rotationY: 6, rotationX: -3, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
  }));
  const run = $('#newsTicker');
  if (run?.children.length) {
    const loop = gsap.to(run, { xPercent: -50, duration: run.children.length * 4, ease: 'none', repeat: -1 });
    run.parentElement.addEventListener('pointerenter', () => gsap.to(loop, { timeScale: 0, duration: 0.5 }));
    run.parentElement.addEventListener('pointerleave', () => gsap.to(loop, { timeScale: 1, duration: 0.5 }));
  }

  $$('[data-count]').forEach((el) => ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.count, duration: 2.2, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)) }); },
  }));

  const mm = gsap.matchMedia();
  mm.add('(min-width: 721px)', () => {
    const track = $('#years');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.reforma', start: 'top top', end: () => `+=${dist() + innerHeight * 0.4}`, pin: '.reforma__pin', scrub: 0.8, invalidateOnRefresh: true } });
    gsap.to('#railFill', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.reforma', start: 'top top', end: () => `+=${dist() + innerHeight * 0.4}`, scrub: true } });
  });
  $$('.yr').forEach((y) => ScrollTrigger.create({ trigger: '.reforma', start: 'top top', end: 'bottom bottom', onUpdate: () => {
    const r = y.getBoundingClientRect();
    y.classList.toggle('is-on', r.left < innerWidth * 0.75 && r.top < innerHeight * 0.85);
  } }));
}

/* ---------------- Entrada ---------------- */
async function start() {
  document.body.classList.add('is-locked');
  const line = $('.curtain__line span');
  const heroReady = bootHero();
  await Promise.all([document.fonts?.ready, gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: reduced ? 0.01 : 1.1, ease: 'power2.inOut' })]);
  await Promise.race([heroReady, new Promise((r) => setTimeout(r, 2500))]);
  document.body.classList.remove('is-locked');
  const y = +sessionStorage.getItem('infis-y');
  sessionStorage.removeItem('infis-y');
  if (y) { if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y); }
  if (reduced) {
    $('#curtain').style.display = 'none';
    $$('[data-count]').forEach((el) => (el.textContent = el.dataset.count));
    $$('.yr').forEach((el) => el.classList.add('is-on'));
    return;
  }
  gsap.to('#curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut', onComplete: () => { $('#curtain').style.display = 'none'; } });
  animate();
}
start();
