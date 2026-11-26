// Busca os posts mais recentes do blog oficial e grava em src/blog.json.
// Roda antes de cada build; se o blog estiver fora do ar, mantém o arquivo anterior.
// O blog não libera CORS, por isso a leitura acontece no build e não no navegador.
import { readFile, writeFile } from 'node:fs/promises';

const SITE = 'https://infisconsultoria.com.br';
const LISTS = { pt: '/blog-pt-br', en: '/blog-en' };
const LIMIT = 9;
const OUT = new URL('../src/blog.json', import.meta.url);
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (site-build)' };

const get = async (url) => {
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.text();
};

const postUrls = (html) => [...new Set([...html.matchAll(/href="(https:\/\/infisconsultoria\.com\.br\/post\/[^"#?]+)"/g)].map((m) => m[1]))];

// O conteúdo de cada post vem serializado pelo Nuxt: um array em que os campos apontam para índices.
async function readPost(url) {
  const html = await get(url);
  const raw = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!raw) return null;
  const a = JSON.parse(raw[1]);
  const at = (i) => (typeof i === 'number' ? a[i] : i);
  const o = a.find((x) => x && typeof x === 'object' && !Array.isArray(x) && 'publishedAt' in x && 'canonicalLink' in x);
  if (!o) return null;
  const author = at(o.author);
  const cats = at(o.categories);
  const clean = (s) => String(s || '').replace(/\s*[—–]\s*/g, ', ').trim();
  return {
    url,
    title: clean(at(o.title)),
    summary: clean(at(o.description)),
    date: at(o.publishedAt),
    author: author && typeof author === 'object' ? at(author.name) : '',
    category: Array.isArray(cats) ? cats.map((i) => { const c = at(i); return c && typeof c === 'object' ? at(c.label) : c; }).filter(Boolean)[0] || '' : '',
    minutes: at(o.readTimeInMinutes) || null,
  };
}

let previous = null;
try { previous = JSON.parse(await readFile(OUT, 'utf8')); } catch {}

try {
  const data = { updated: new Date().toISOString() };
  for (const [lang, path] of Object.entries(LISTS)) {
    const urls = postUrls(await get(SITE + path)).slice(0, LIMIT);
    const posts = (await Promise.all(urls.map((u) => readPost(u).catch(() => null)))).filter((p) => p && p.title && p.date);
    if (!posts.length) throw new Error(`nenhum post encontrado em ${lang}`);
    data[lang] = posts.sort((x, y) => y.date.localeCompare(x.date));
  }
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`blog: ${data.pt.length} posts em português, ${data.en.length} em inglês`);
} catch (e) {
  if (!previous) throw e;
  console.warn(`blog: não foi possível atualizar (${e.message}); mantendo a versão anterior`);
}
