/* EJDER Studio – 3D background for every page: golden embers (like the sparks in the EJDER artwork)
   floating in real 3D depth (perspective projection, mouse and scroll parallax).
   Pure canvas, no library, no images; it never draws over the site's own images. */
(() => {
'use strict';
const host = document.getElementById('bg3d');
if (!host) return;
const canvas = document.createElement('canvas');
canvas.setAttribute('aria-hidden', 'true');
host.appendChild(canvas);
const ctx = canvas.getContext('2d');
if (!ctx) return;
const reduceMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } })();
const TAU = Math.PI * 2;
const COLORS = ['255,226,166', '244,184,96', '232,132,60', '255,211,138'];
/* soft glowing dot sprites, one per colour */
const sprites = COLORS.map(rgb => {
  const s = document.createElement('canvas'); s.width = s.height = 64;
  const g = s.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, `rgba(${rgb},1)`); r.addColorStop(.25, `rgba(${rgb},.55)`); r.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  return s;
});
let W = 0, H = 0, focal = 1, halfW = 1, halfH = 1, n = 0, pts = [];
let mx = 0, my = 0, camX = 0, camY = 0, time = 0, last = performance.now();
/* positions are world units; the visible area at depth z is ±halfW·z by ±halfH·z around the camera */
function spawn(p, anywhere) {
  p.z = .6 + Math.random() * 3.6;                    // depth (camera at z = 0)
  p.x = camX + (Math.random() * 2 - 1) * (halfW + .15) * p.z;
  p.y = camY + (anywhere ? (Math.random() * 2 - 1) * (halfH + .1) : halfH + .08) * p.z;
  p.v = .05 + Math.random() * .1;                    // rising speed (world units / s)
  p.r = .006 + Math.random() * .014;                 // radius in world units
  p.c = (Math.random() * sprites.length) | 0;
  p.ph = Math.random() * TAU;
  return p;
}
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  W = window.innerWidth || 1; H = window.innerHeight || 1;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  focal = Math.min(W, H) * .9; halfW = W / 2 / focal; halfH = H / 2 / focal;
  const want = Math.round(Math.min(320, Math.max(110, W * H / 5200)));
  while (pts.length < want) pts.push(spawn({}, true));
  pts.length = want; n = want;
}
window.addEventListener('pointermove', e => { mx = e.clientX / (W || 1) - .5; my = e.clientY / (H || 1) - .5; }, { passive: true });
function draw(dt) {
  const scroll = (window.scrollY || 0) / Math.max(1, document.documentElement.scrollHeight - H);
  camX += (mx * .3 - camX) * Math.min(1, dt * 3);
  camY += (my * .12 + scroll * .6 - camY) * Math.min(1, dt * 3);
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    if (!reduceMotion) {
      p.y -= p.v * dt;
      p.x += Math.sin(time * .6 + p.ph) * dt * .03;
    }
    // keep the field full whatever the camera does (wrap in camera space)
    const ry = (p.y - camY) / p.z, rx = (p.x - camX) / p.z;
    if (ry < -(halfH + .08)) spawn(p, false);
    else if (ry > halfH + .12) p.y = camY - (halfH + .06) * p.z;
    if (rx > halfW + .2) p.x -= 2 * (halfW + .18) * p.z; else if (rx < -(halfW + .2)) p.x += 2 * (halfW + .18) * p.z;
    const f = focal / p.z;
    const sx = W / 2 + (p.x - camX) * f, sy = H / 2 + (p.y - camY) * f;
    if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
    const size = Math.max(1.2, p.r * f * 2);
    const flicker = .65 + .35 * Math.sin(time * 2.4 + p.ph * 3);
    ctx.globalAlpha = Math.min(.85, (.18 + .55 / p.z)) * flicker;
    ctx.drawImage(sprites[p.c], sx - size, sy - size, size * 2, size * 2);
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (document.hidden) return;
  time += dt; draw(dt);
}
resize();
window.addEventListener('resize', resize);
if (reduceMotion) { draw(1); window.addEventListener('scroll', () => draw(1), { passive: true }); window.addEventListener('resize', () => draw(1)); }
else requestAnimationFrame(tick);
})();
