// Sequência de fotos do hero em WebGL: transição por deslocamento suave, zoom lento
// e paralaxe de profundidade com o mouse. Sem WebGL, cai para crossfade em CSS.
const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;

const FRAG = `precision highp float;
varying vec2 v;
uniform sampler2D t0, t1;
uniform vec2 r0, r1, res, mouse;
uniform float prog, time, zoom;

vec2 cover(vec2 uv, vec2 img){
  float s = max(res.x/img.x, res.y/img.y);
  vec2 size = img*s;
  return (uv*res - (res-size)*.5)/size;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
void main(){
  vec2 uv = v; uv.y = 1. - uv.y;
  vec2 c = uv - .5;
  // profundidade: o centro desloca menos que as bordas
  vec2 par = mouse * .018 * (.6 + length(c));
  float n = noise(uv*3.2 + time*.05);
  float edge = smoothstep(prog - .22, prog + .22, n*.55 + (1.-uv.x)*.45);
  float k = 1. - edge;
  vec2 d = vec2(.06, .02);
  vec2 a = .5 + c/(zoom + prog*.04) + par - d*prog*k;
  vec2 b = .5 + c/(1.10 - (1.-prog)*.04) + par + d*(1.-prog)*edge;
  vec4 A = texture2D(t0, cover(a, r0));
  vec4 B = texture2D(t1, cover(b, r1));
  vec3 col = mix(A.rgb, B.rgb, k);
  float g = luminance(col);
  col = mix(col, vec3(g), .25);
  col *= 1. - .35*length(c*vec2(1.2,1.));
  col += (hash(uv*res + time) - .5) * .035;
  gl_FragColor = vec4(col, 1.);
}`.replace('luminance(col)', 'dot(col, vec3(.299,.587,.114))');

function loadImage(src) {
  return new Promise((ok, fail) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.onload = () => ok(im);
    im.onerror = fail;
    im.src = src;
  });
}

export async function initHeroGL(canvas, urls, { onChange } = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('webgl');

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const u = { t0: U('t0'), t1: U('t1'), r0: U('r0'), r1: U('r1'), res: U('res'), mouse: U('mouse'), prog: U('prog'), time: U('time'), zoom: U('zoom') };

  const images = await Promise.all(urls.map(loadImage));
  const textures = images.map((im) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
    return t;
  });

  let cur = 0, next = 1, p = 0, transitioning = false, start = 0, slideStart = performance.now();
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; }, { passive: true });

  function resize() {
    const dpr = Math.min(devicePixelRatio, 1.5);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  addEventListener('resize', resize);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const HOLD = 6500, DUR = 1900;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  function go(i) {
    if (transitioning || i === cur) return;
    next = i; transitioning = true; start = performance.now();
    onChange?.(i);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (!transitioning && now - slideStart > HOLD) go((cur + 1) % textures.length);
    if (transitioning) {
      p = ease(Math.min(1, (now - start) / DUR));
      if (p >= 1) { cur = next; p = 0; transitioning = false; slideStart = now; }
    }
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    const t = now / 1000;
    const hold = Math.min(1, (now - slideStart) / (HOLD + DUR));
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[cur]); gl.uniform1i(u.t0, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[transitioning ? next : cur]); gl.uniform1i(u.t1, 1);
    gl.uniform2f(u.r0, images[cur].width, images[cur].height);
    const ni = transitioning ? next : cur;
    gl.uniform2f(u.r1, images[ni].width, images[ni].height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform2f(u.mouse, mouse.x, mouse.y);
    gl.uniform1f(u.prog, p);
    gl.uniform1f(u.time, t);
    gl.uniform1f(u.zoom, 1.06 + (transitioning ? 0.04 : hold * 0.04));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);
  return { go, get index() { return transitioning ? next : cur; } };
}
