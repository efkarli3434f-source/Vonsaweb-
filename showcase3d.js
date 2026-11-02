/* EJDER Studio – 3D product showcase built from the REAL product photographs.
   The cards are plain <a>/<img> elements placed in CSS 3D space, so every photo is shown
   exactly as delivered (no stretching, no filters, no placeholders) and it also works offline
   and when index.html is opened straight from disk (file://). */
(() => {
'use strict';
const reduceMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } })();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let active = null;

function mount(root, opts = {}) {
  if (!root) return null;
  if (active && active.root === root) { active.opts = opts; return active; }
  const ring = root.querySelector('.ring'), cards = [...root.querySelectorAll('.ring-card')];
  if (!ring || !cards.length) return null;
  const n = cards.length, step = 360 / n;
  const s = active = {
    root, ring, cards, n, step, opts, pair: n <= 3,
    rot: 0, target: 0, time: 0, idleUntil: 0, hover: false, drag: null, justDragged: false,
    front: -1, tiltX: 0, tiltY: 0, wantX: 0, wantY: 0, radius: 0
  };
  root.style.setProperty('--n', n);
  cards.forEach((c, i) => c.style.setProperty('--i', i));
  root.classList.toggle('is-pair', s.pair);
  layout(s);
  if (typeof ResizeObserver === 'function') { s.ro = new ResizeObserver(() => layout(s)); s.ro.observe(root); }
  else window.addEventListener('resize', () => layout(s));

  /* drag to rotate (horizontal), tap/click opens the product in the studio */
  root.addEventListener('pointerdown', ev => {
    if (ev.button !== 0 || ev.target.closest('button')) return;
    s.drag = { x: ev.clientX, y: ev.clientY, id: ev.pointerId, moved: 0, captured: false };
  });
  root.addEventListener('pointermove', ev => {
    const r = root.getBoundingClientRect();
    if (ev.pointerType === 'mouse') { s.wantY = ((ev.clientX - r.left) / r.width - .5) * 16; s.wantX = -((ev.clientY - r.top) / r.height - .5) * 8; }
    const d = s.drag; if (!d || d.id !== ev.pointerId) return;
    const dx = ev.clientX - d.x; d.x = ev.clientX; d.moved += Math.abs(dx) + Math.abs(ev.clientY - d.y); d.y = ev.clientY;
    if (d.moved > 6 && !d.captured) { d.captured = true; root.classList.add('dragging'); try { root.setPointerCapture(ev.pointerId); } catch {} }
    if (d.captured && !s.pair) { s.target += dx / Math.max(80, s.radius) * 57.3; s.rot = s.target; }
    if (d.captured && s.pair) s.wantY = clamp(s.wantY + dx * .15, -25, 25);
    s.idleUntil = s.time + 5;
  });
  const end = ev => {
    const d = s.drag; if (!d || d.id !== ev.pointerId) return;
    s.drag = null; root.classList.remove('dragging');
    if (d.captured) { s.justDragged = true; setTimeout(() => { s.justDragged = false; }, 0); if (!s.pair) s.target = Math.round(s.target / step) * step; }
  };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  root.addEventListener('click', ev => { if (s.justDragged) { ev.preventDefault(); ev.stopPropagation(); } }, true);
  root.addEventListener('pointerenter', ev => { if (ev.pointerType === 'mouse') s.hover = true; });
  root.addEventListener('pointerleave', () => { s.hover = false; s.wantX = s.wantY = 0; });
  /* keyboard: focusing a card brings it to the front */
  root.addEventListener('focusin', ev => {
    const c = ev.target.closest('.ring-card'); if (!c) return;
    const i = cards.indexOf(c);
    if (s.pair) { setFront(s, i); return; }
    bringToFront(s, i);
  });
  root.addEventListener('keydown', ev => {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      ev.preventDefault();
      const next = (((s.front < 0 ? 0 : s.front) + (ev.key === 'ArrowRight' ? 1 : -1)) % n + n) % n;
      cards[next].focus({ preventScroll: true });
    }
  });
  cards.forEach((c, i) => c.addEventListener('pointerenter', () => { if (s.pair) setFront(s, i); }));

  let last = performance.now();
  const tick = now => {
    if (active !== s || !root.isConnected) { s.ro?.disconnect(); if (active === s) active = null; return; }
    requestAnimationFrame(tick);
    const dt = Math.min(.05, (now - last) / 1000); last = now; s.time += dt;
    if (document.hidden) return;
    const r = root.getBoundingClientRect(); if (r.bottom < 0 || r.top > (window.innerHeight || 800)) return;
    if (!s.pair) {
      if (!reduceMotion && !s.hover && !s.drag && s.time > s.idleUntil) s.target -= dt * 9;
      s.rot += (s.target - s.rot) * (1 - Math.exp(-dt * 7));
      ring.style.setProperty('--rot', s.rot.toFixed(3) + 'deg');
      setFront(s, ((Math.round(-s.rot / step) % n) + n) % n);
    } else {
      const sway = reduceMotion ? 0 : Math.sin(s.time * .6) * 4;
      s.tiltX += (s.wantX - s.tiltX) * (1 - Math.exp(-dt * 5));
      s.tiltY += ((s.hover || s.drag ? s.wantY : sway) - s.tiltY) * (1 - Math.exp(-dt * 5));
      ring.style.setProperty('--tilt-x', s.tiltX.toFixed(2) + 'deg');
      ring.style.setProperty('--tilt-y', s.tiltY.toFixed(2) + 'deg');
      if (s.front < 0) setFront(s, 0);
    }
  };
  requestAnimationFrame(tick);
  return s;
}
function layout(s) {
  const W = s.root.clientWidth || 600, H = s.root.clientHeight || 360;
  let cw;
  if (s.pair) cw = clamp(Math.min(W / (s.n * 1.22 + .7), (H * .66) / .6917), 130, 340);
  else cw = clamp(Math.min(W * .3, (H * .62) / .6917), 120, 270);
  s.radius = s.pair ? 0 : (cw / 2) / Math.tan(Math.PI / s.n) * 1.1;
  s.root.style.setProperty('--cw', cw.toFixed(1) + 'px');
  s.root.style.setProperty('--r', s.radius.toFixed(1) + 'px');
}
function bringToFront(s, i) {
  const want = -i * s.step, cur = s.target;
  const delta = ((want - cur) % 360 + 540) % 360 - 180;
  s.target = cur + delta; s.idleUntil = s.time + 6;
}
function setFront(s, i) {
  if (i === s.front) return;
  s.cards[s.front]?.classList.remove('is-front');
  s.front = i; s.cards[i]?.classList.add('is-front');
  s.opts.onFront?.(s.cards[i]?.dataset.product, i);
}
function rotate(dir) {
  const s = active; if (!s) return;
  if (s.pair) { const i = (((s.front < 0 ? 0 : s.front) + dir) % s.n + s.n) % s.n; setFront(s, i); s.wantY = (i - (s.n - 1) / 2) * -10; return; }
  s.target = Math.round(s.target / s.step) * s.step - dir * s.step; s.idleUntil = s.time + 6;
}
window.EJDERRing = { mount, rotate };
})();
