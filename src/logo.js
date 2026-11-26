let uid = 0;

// Proporções medidas no manual: base do "in" a ~0,57r abaixo do centro do círculo, de modo que
// a perna direita do "n" só tangencia a borda. O clip garante que nada branco escape do círculo.
const IN_PATHS = `<circle cx="77" cy="40" r="15"/>
    <rect x="63" y="66" width="28" height="105" rx="2"/>
    <path d="M104 171V66h28v12c8-10 19-15 32-15c22 0 32 16 32 40v68h-28v-62c0-13-5-20-16-20c-12 0-20 8-20 23v59z"/>`;

const FIS_PATHS = `<path d="M213 171V88h-13V66h13V52c0-27 15-42 42-42c8 0 14 1 19 3l-3 23c-4-1-7-1-11-1c-12 0-19 6-19 19v12h28v22h-28v83z"/>
    <circle cx="298" cy="40" r="15"/>
    <rect x="284" y="66" width="28" height="105" rx="2"/>
    <path transform="translate(20 -3) scale(.84)" d="M364 191l13-24c13 9 28 14 41 14 12 0 18-4 18-11 0-19-68-8-68-56 0-25 20-41 50-41 17 0 33 4 46 12l-12 24c-11-6-23-10-34-10-10 0-16 4-16 10 0 20 68 7 68 56 0 25-21 42-53 42-20 0-40-6-53-16z"/>`;

const defs = (id) => `<defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5821F"/><stop offset=".55" stop-color="#EE5A2A"/><stop offset="1" stop-color="#E5343B"/></linearGradient>
    <clipPath id="${id}c"><circle cx="112" cy="112" r="104"/></clipPath>
  </defs>
  <circle cx="112" cy="112" r="104" fill="url(#${id}g)"/>
  <g fill="#fff" clip-path="url(#${id}c)">${IN_PATHS}</g>`;

export function logoSVG({ dark = false, tagline = true, className = '' } = {}) {
  const id = `lg${uid++}`;
  const fis = dark ? '#FFFFFF' : '#706F6F';
  const tag = dark ? 'rgba(255,255,255,.72)' : '#706F6F';
  return `<svg class="${className}" viewBox="0 0 428 222" role="img" aria-label="INFIS inteligência fiscal" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  <g fill="${fis}" transform="translate(7 0)">${FIS_PATHS}</g>
  ${tagline ? `<text x="421" y="213" text-anchor="end" font-family="Roboto, Arial, sans-serif" font-weight="300" font-size="25" fill="${tag}">inteligência fiscal</text>` : ''}
</svg>`;
}

export function markSVG(className = '') {
  const id = `mk${uid++}`;
  return `<svg class="${className}" viewBox="0 0 224 224" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${defs(id)}</svg>`;
}
