/* Llampayec · visor flipbook. Usa StPageFlip (MIT). Sin dependencias adicionales. */
(() => {
  'use strict';
  const C = window.LLAMPAYEC;
  const N = C.pageCount;
  const $ = (s, r = document) => r.querySelector(s);
  const pad = n => String(n).padStart(2, '0');
  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('slots');
  const DEMO = params.has('demo');           // solo para probar: rellena huecos con imágenes de muestra
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isVideo = src => /\.(mp4|webm|ogv|m4v|mov)(\?|#|$)/i.test(src || '');

  function demoSrc(s) {
    const [, , w, h] = s.rect, k = 600 / Math.max(w, h);
    const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, c.width, c.height);
    gr.addColorStop(0, '#5b3a8c'); gr.addColorStop(1, '#e0793b'); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#fff'; g.font = `700 ${Math.max(14, c.width / 12)}px sans-serif`; g.textAlign = 'center';
    g.fillText('DEMO', c.width / 2, c.height / 2); g.font = `${Math.max(12, c.width / 20)}px sans-serif`; g.fillText(s.id, c.width / 2, c.height / 2 + c.width / 12);
    return c.toDataURL('image/jpeg', .85);
  }
  const slots = C.slots.map(s => ({ ...s, src: s.src || (DEMO ? demoSrc(s) : null) }));
  const pct = (v, t) => (v / t * 100).toFixed(4) + '%';
  const place = (el, r) => {
    const [x, y, w, h] = r, { w: W, h: H } = C.pageSize;
    el.style.cssText += `left:${pct(x, W)};top:${pct(y, H)};width:${pct(w, W)};height:${pct(h, H)};`;
  };

  /* ---------- páginas ---------- */
  function buildSlot(s) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'slot'; b.setAttribute('aria-label', s.label || 'Ampliar');
    place(b, s.rect);
    if (s.radius) b.style.borderRadius = s.radius;          // p.ej. hueco con forma de arco
    if (s.pos) b.style.setProperty('--pos', s.pos);          // encuadre (object-position), p. ej. '44% 50%'
    if (s.fit) b.style.setProperty('--fit', s.fit);          // 'cover' (por defecto) o 'contain' (recorte con fondo transparente)
    if (s.fit === 'contain') b.style.background = 'transparent';
    if (isVideo(s.src)) {
      if (s.poster) { const im = new Image(); im.src = s.poster; im.alt = ''; b.appendChild(im); }
      else { const v = document.createElement('video'); v.muted = true; v.preload = 'metadata'; v.src = s.src + (s.src.includes('#') ? '' : '#t=0.1'); b.appendChild(v); }
      const p = document.createElement('span'); p.className = 'play'; b.appendChild(p);
    } else {
      const im = new Image(); im.alt = s.label || ''; im.src = s.src; im.draggable = false; b.appendChild(im);
    }
    b.addEventListener('click', () => openMedia(s));
    return b;
  }

  function buildPage(i) {
    const n = i + 1, el = document.createElement('div');
    el.className = 'page';
    const img = document.createElement('img');
    img.className = 'pg'; img.draggable = false; img.alt = `Página ${n}: ${C.pageTitles[n] || ''}`;
    img.dataset.src = C.pageImage(pad(n));
    el.appendChild(img);
    slots.filter(s => s.page === n).forEach(s => {
      if (s.src) {
        el.appendChild(buildSlot(s));
        if (s.textLayer) { const t = new Image(); t.className = 'textlayer' + (s.textLight ? ' light' : ''); t.alt = ''; t.src = s.textLayer; el.appendChild(t); }
      } else if (DEBUG) {
        const d = document.createElement('div'); d.className = 'debug-slot'; d.textContent = s.id; place(d, s.rect); el.appendChild(d);
      }
    });
    return el;
  }

  const bookEl = $('#book');
  const pageEls = Array.from({ length: N }, (_, i) => buildPage(i));
  pageEls.forEach(p => bookEl.appendChild(p));

  const loaded = new Set();
  function ensure(i) {
    if (i < 0 || i >= N || loaded.has(i)) return;
    const img = pageEls[i].querySelector('.pg'); img.src = img.dataset.src; loaded.add(i);
  }
  const ensureAround = i => { for (let k = i - 3; k <= i + 5; k++) ensure(k); };

  /* ---------- flipbook ---------- */
  const hashPage = () => { const m = /[#&]p=(\d+)/.exec(location.hash); return m ? Math.min(N, Math.max(1, +m[1])) - 1 : 0; };
  const start = hashPage();
  ensureAround(start);

  const flip = new St.PageFlip(bookEl, {
    width: 699, height: 1000, size: 'stretch',
    minWidth: 240, maxWidth: 900, minHeight: 343, maxHeight: 1288,
    showCover: true, usePortrait: true, startPage: start,
    drawShadow: true, maxShadowOpacity: .45, flippingTime: reduceMotion ? 250 : 750,
    mobileScrollSupport: false, clickEventForward: true, useMouseEvents: true,
    swipeDistance: 30, showPageCorners: true, startZIndex: 0, autoSize: true
  });
  flip.loadFromHTML(pageEls);

  /* ---------- interfaz ---------- */
  const label = $('#page-label'), slider = $('#slider');
  slider.max = N;
  const portrait = () => flip.getOrientation() === 'portrait';
  function spread(idx) {
    if (portrait() || idx === 0) return [idx];
    const l = idx % 2 === 1 ? idx : idx - 1;
    return l + 1 < N ? [l, l + 1] : [l];
  }
  function update(idx) {
    ensureAround(idx);
    const pages = spread(idx).map(i => i + 1);
    label.textContent = pages.length === 2 ? `Páginas ${pages[0]}–${pages[1]} de ${N}`
      : pages[0] === 1 ? 'Portada' : pages[0] === N ? `Página ${N} de ${N}` : `Página ${pages[0]} de ${N}`;
    const atStart = pages[0] === 1, atEnd = pages[pages.length - 1] === N;
    slider.value = atEnd ? N : pages[0];                    // en el último pliego la barra llega al extremo
    ['#btn-first', '#btn-prev', '#nav-prev'].forEach(s => $(s).disabled = atStart);
    ['#btn-last', '#btn-next', '#nav-next'].forEach(s => $(s).disabled = atEnd);
    document.querySelectorAll('.thumb').forEach(t => t.classList.toggle('current', pages.includes(+t.dataset.page)));
    history.replaceState(null, '', '#p=' + pages[0]);
  }
  /* flechas laterales centradas respecto al libro real (no al contenedor) */
  const stageEl = $('#stage');
  function centerArrows() {
    const blk = bookEl.querySelector('.stf__block'); if (!blk) return;
    const r = blk.getBoundingClientRect(), st = stageEl.getBoundingClientRect();
    if (r.height > 0) stageEl.style.setProperty('--nav-top', (r.top - st.top + r.height / 2) + 'px');
  }
  new ResizeObserver(centerArrows).observe(stageEl);
  addEventListener('resize', centerArrows);
  flip.on('flip', e => { update(e.data); centerArrows(); });
  flip.on('changeOrientation', () => update(flip.getCurrentPageIndex()));
  update(start); centerArrows(); setTimeout(centerArrows, 300);

  const go = n => { flip.turnToPage(Math.min(N, Math.max(1, n)) - 1); update(flip.getCurrentPageIndex()); };
  const next = () => flip.flipNext(), prev = () => flip.flipPrev();
  $('#btn-next').onclick = $('#nav-next').onclick = next;
  $('#btn-prev').onclick = $('#nav-prev').onclick = prev;
  $('#btn-first').onclick = () => go(1);
  $('#btn-last').onclick = () => go(N);
  let sliderTimer;
  slider.addEventListener('input', () => { clearTimeout(sliderTimer); sliderTimer = setTimeout(() => go(+slider.value), 120); });

  /* ---------- índice ---------- */
  const toc = $('#toc'), tocBody = $('#toc-body'), btnToc = $('#btn-toc');
  C.sections.forEach(sec => {
    const h = document.createElement('h3'); h.textContent = sec.title; tocBody.appendChild(h);
    const g = document.createElement('div'); g.className = 'grid';
    sec.pages.forEach(n => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'thumb'; b.dataset.page = n;
      b.title = C.pageTitles[n] || ''; b.setAttribute('aria-label', `Ir a la página ${n}: ${C.pageTitles[n] || ''}`);
      const im = new Image(); im.loading = 'lazy'; im.alt = ''; im.src = C.thumbImage(pad(n));
      const sp = document.createElement('span'); sp.textContent = n;
      b.append(im, sp); b.onclick = () => { go(n); setToc(false); }; g.appendChild(b);
    });
    tocBody.appendChild(g);
  });
  function setToc(open) {
    toc.hidden = !open; btnToc.setAttribute('aria-expanded', String(open));
    if (open) { update(flip.getCurrentPageIndex()); toc.querySelector('.current')?.scrollIntoView({ block: 'center' }); $('#toc-close').focus(); }
    else btnToc.focus();
  }
  btnToc.onclick = () => setToc(toc.hidden);
  $('#toc-close').onclick = () => setToc(false);

  /* ---------- ampliación y video ---------- */
  const lb = $('#lightbox'), lbc = $('#lb-content'); let lastFocus = null;
  function openLightbox(nodes, cls = '') {
    lastFocus = document.activeElement; lbc.className = cls; lbc.replaceChildren(...nodes);
    lb.hidden = false; document.body.classList.add('lb-open'); $('#lb-close').focus();
  }
  function closeLightbox() {
    lb.hidden = true; lbc.replaceChildren(); lbc.className = ''; document.body.classList.remove('lb-open'); lastFocus?.focus?.();
  }
  function openMedia(s) {
    if (isVideo(s.src)) {
      const v = document.createElement('video'); v.src = s.src; v.controls = true; v.autoplay = true; v.playsInline = true;
      if (s.poster) v.poster = s.poster; openLightbox([v]);
    } else { const im = new Image(); im.src = s.src; im.alt = s.label || ''; openLightbox([im]); }
  }
  function zoomPages() {
    const ims = spread(flip.getCurrentPageIndex()).map(i => { const im = new Image(); im.src = C.pageImage(pad(i + 1)); im.alt = `Página ${i + 1}`; return im; });
    openLightbox(ims);
  }
  lbc.addEventListener('click', e => { if (e.target.tagName === 'IMG') lbc.classList.toggle('actual'); else if (e.target === lbc) closeLightbox(); });
  $('#lb-close').onclick = closeLightbox;
  $('#btn-zoom').onclick = zoomPages;

  const fsBtn = $('#btn-full');
  fsBtn.onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  if (!document.documentElement.requestFullscreen) fsBtn.hidden = true;

  /* ---------- teclado ---------- */
  addEventListener('keydown', e => {
    if (e.target.matches?.('input,textarea')) { if (e.key !== 'Escape') return; }
    if (e.key === 'Escape') { if (!lb.hidden) closeLightbox(); else if (!toc.hidden) setToc(false); return; }
    if (!lb.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
    else if (e.key === 'Home') go(1); else if (e.key === 'End') go(N);
    else if (e.key === 'i' || e.key === 'I') setToc(toc.hidden);
    else if (e.key === 'f' || e.key === 'F') fsBtn.click();
    else if (e.key === 'z' || e.key === 'Z') zoomPages();
  });
  addEventListener('hashchange', () => { const p = hashPage(); if (!spread(flip.getCurrentPageIndex()).includes(p)) go(p + 1); });
})();
