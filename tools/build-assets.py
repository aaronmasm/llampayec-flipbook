#!/usr/bin/env python3
"""
Llampayec · build-assets.py
Genera lo que usa el visor a partir de los PNG de Canva (assets/pages):
  - assets/web/pNN.webp      páginas en WebP (con las franjas grises de borde ya quitadas)
  - assets/thumbs/pNN.jpg    miniaturas del índice
  - assets/web/pNN-text.webp capa transparente con el título de las páginas 9, 15 y 22
                             (para que el título quede ENCIMA de la foto que se coloque)
Los PNG originales NUNCA se modifican.

Franjas grises (#C8D1D9, ~58 px): están en el diseño de Canva, en la capa de fondo. Se reconstruye el
papel que hay debajo con el consenso de las otras páginas que comparten el mismo fondo; donde no hay
donantes (p.ej. página 26, de color plano) se usa inpainting.

Requisitos:  pip install numpy opencv-python-headless pillow
Uso:         python3 tools/build-assets.py                    (todo)
             python3 tools/build-assets.py --debug-dir /ruta  (además guarda comparaciones antes/después)
"""
import argparse, sys
from pathlib import Path
import numpy as np, cv2
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGES, WEB, THUMBS = ROOT/"assets/pages", ROOT/"assets/web", ROOT/"assets/thumbs"
N = 33
STRIP_COLOR = np.array([200, 209, 217]); STRIP_TOL = 14
STRIP_PAGES = [3, 10, 11, 12, 13, 26, 28, 29, 30, 31, 32, 33]     # páginas con franja (la 27 es una foto: no tocar)
REFLECT_PAGES = {30, 31, 32, 33}                     # fondo con motivos y sin donantes limpios: se refleja el papel contiguo
REFLECT_AXIS = 60                                    # px desde el borde donde se espeja
REFLECT_BAND = 36                                    # ancho del papel contiguo que se usa como origen (antes del texto/tarjetas)
SKIP_DONORS = {1, 2, 4, 7, 9, 15, 22, 27}            # portada, placeholders y foto: no sirven de donantes
BAND = 90                                            # px de borde que se examinan
TITLE_PAGES = [9, 15, 22]
TITLE_BG = np.array([136, 162, 1]); TITLE_INK = np.array([12, 12, 12])

def load(n):
    return np.asarray(Image.open(PAGES/f"p{n:02d}.png").convert("RGB"))

def strip_mask(a):
    H, W, _ = a.shape
    m = np.abs(a.astype(int) - STRIP_COLOR).max(axis=2) <= STRIP_TOL
    band = np.zeros((H, W), bool); band[:, :BAND] = True; band[:, W-BAND:] = True
    m &= band
    k, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), connectivity=8)
    keep = np.zeros_like(m)
    for i in range(1, k):
        if st[i, cv2.CC_STAT_AREA] >= 400: keep |= (lab == i)
    return (cv2.dilate(keep.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)

def donor_fill(n, pages, mask, side):
    """Rellena la franja del lado `side` con el consenso de páginas que comparten el fondo
    (incluye variantes volteadas horizontalmente: algunas páginas tienen el fondo espejado)."""
    H, W, _ = pages[n].shape
    cols = slice(0, BAND) if side == "L" else slice(W-BAND, W)
    ref = slice(60, 200) if side == "L" else slice(W-200, W-60)
    variants = []
    for d, a in pages.items():
        if d == n or d in SKIP_DONORS: continue
        for flip in (False, True):
            arr = a[:, ::-1] if flip else a
            sim = (np.abs(arr[:, ref].astype(int) - pages[n][:, ref].astype(int)).max(axis=2) <= 3).mean()
            if sim >= 0.35: variants.append((d, flip, arr[:, cols]))
    out = pages[n][:, cols].copy(); resolved = np.zeros((H, BAND), bool)
    names = [f"{d}{'↔' if fl else ''}" for d, fl, _ in variants]
    if len(variants) < 3: return out, resolved, names
    stack = np.stack([v for _, _, v in variants]).astype(np.float32)
    bad = np.abs(stack - STRIP_COLOR).max(axis=3) <= STRIP_TOL          # donante con franja en ese píxel
    stack[bad] = np.nan
    with np.errstate(all="ignore"):
        med = np.nanmedian(stack, axis=0)
    agree = (np.abs(stack - med[None]).max(axis=3) <= 3) & ~bad
    valid = (~bad).sum(axis=0)
    ok = agree.sum(axis=0) >= np.maximum(3, np.ceil(0.5 * valid))
    use = mask[:, cols] & ok
    out[use] = np.clip(np.rint(med[use]), 0, 255).astype(np.uint8)
    return out, use, names

def replicate_edge(a, unresolved):
    """Fondo plano (p.ej. página 26): extiende hacia el borde el color del píxel contiguo a la franja,
    fila por fila. Devuelve lo que no pudo resolver."""
    H, W, _ = a.shape; left = unresolved.copy()
    for y in range(H):
        row = unresolved[y]
        if row[0]:
            xb = int(np.argmin(row[:BAND+2]))                    # primer píxel no enmascarado desde la izquierda
            if 0 < xb < BAND + 2 and not row[xb]: a[y, :xb] = a[y, xb]; left[y, :xb] = False
        if row[W-1]:
            seg = row[W-BAND-2:][::-1]; xb = int(np.argmin(seg))
            if 0 < xb < BAND + 2 and not seg[xb]: a[y, W-xb:] = a[y, W-1-xb]; left[y, W-xb:] = False
    return left

def reflect_fill(a, unresolved):
    """Páginas sin donantes limpios (todas sus hermanas también tienen la franja): espeja hacia el borde
    el papel contiguo a la franja. Continúa el motivo y el grano del papel sin estrías. Solo se usan
    píxeles de origen que sean papel (sin texto, bordes ni colores fuertes); el resto lo resuelve
    la extensión del borde."""
    H, W, _ = a.shape
    med = cv2.medianBlur(a, 21)
    content = (np.abs(a.astype(int) - med.astype(int)).max(axis=2) > 9) | (a.min(axis=2) < 150)
    content = cv2.dilate(content.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
    left = unresolved.copy(); xs = np.arange(REFLECT_AXIS)
    for side in ("L", "R"):
        A = a if side == "L" else a[:, ::-1]; U = left if side == "L" else left[:, ::-1]
        C = content if side == "L" else content[:, ::-1]
        d = REFLECT_AXIS - xs; t = d % (2 * REFLECT_BAND)        # espejo repetido (onda triangular) dentro de la banda
        src = REFLECT_AXIS + np.where(t < REFLECT_BAND, t, 2 * REFLECT_BAND - t)
        take = U[:, :REFLECT_AXIS] & ~C[:, src]
        blk = A[:, :REFLECT_AXIS]; blk[take] = A[:, src][take]
        U[:, :REFLECT_AXIS] &= ~take
    return left

def remove_strips(n, pages, debug):
    a = pages[n].copy(); m = strip_mask(a)
    if not m.any(): return a
    H, W, _ = a.shape; unresolved = m.copy(); info = []
    for side in ("L", "R"):
        cols = slice(0, BAND) if side == "L" else slice(W-BAND, W)
        if not m[:, cols].any(): continue
        fill, used, donors = donor_fill(n, pages, m, side)
        a[:, cols][used] = fill[used]; unresolved[:, cols] &= ~used
        info.append(f"{side}: {int(used.sum())} px por consenso ({len(donors)} donantes)")
    if n in REFLECT_PAGES and unresolved.any():
        n0 = int(unresolved.sum()); unresolved = reflect_fill(a, unresolved)
        info.append(f"{n0 - int(unresolved.sum())} px por reflejo del papel")
    if unresolved.any():
        n0 = int(unresolved.sum()); unresolved = replicate_edge(a, unresolved)
        info.append(f"{n0 - int(unresolved.sum())} px por extensión del borde")
    if unresolved.any():
        bgr = cv2.cvtColor(a, cv2.COLOR_RGB2BGR)
        bgr = cv2.inpaint(bgr, (unresolved * 255).astype(np.uint8), 5, cv2.INPAINT_TELEA)
        a = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB); info.append(f"{int(unresolved.sum())} px por inpainting")
    print(f"  p{n:02d} franja quitada · " + " · ".join(info))
    return a

def title_layer(a):
    """Texto negro sobre verde sólido -> RGBA con alfa exacto (sin halos)."""
    H, W, _ = a.shape
    dark = a[1300:].sum(axis=2) < 200
    ys, xs = np.where(dark)
    y0, y1, x0, x1 = ys.min()+1300-30, ys.max()+1300+30, max(0, xs.min()-30), min(W, xs.max()+30)
    reg = a[y0:y1, x0:x1].astype(np.float32)
    aR = (TITLE_BG[0] - reg[..., 0]) / (TITLE_BG[0] - TITLE_INK[0])
    aG = (TITLE_BG[1] - reg[..., 1]) / (TITLE_BG[1] - TITLE_INK[1])
    alpha = np.clip((aR + aG) / 2, 0, 1)
    alpha[alpha < 0.03] = 0
    out = np.zeros((H, W, 4), np.uint8); out[..., :3] = TITLE_INK
    out[y0:y1, x0:x1, 3] = np.rint(alpha * 255).astype(np.uint8)
    return out

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--debug-dir"); args = ap.parse_args()
    WEB.mkdir(parents=True, exist_ok=True); THUMBS.mkdir(parents=True, exist_ok=True)
    pages = {n: load(n) for n in range(1, N+1)}
    print("Quitando franjas grises…"); clean = dict(pages)
    for n in STRIP_PAGES:
        clean[n] = remove_strips(n, pages, args.debug_dir)
        if args.debug_dir:
            d = Path(args.debug_dir); d.mkdir(parents=True, exist_ok=True)
            cv2.imwrite(str(d/f"p{n:02d}-antes-despues.jpg"),
                        cv2.cvtColor(np.hstack([pages[n], clean[n]])[::2, ::2], cv2.COLOR_RGB2BGR))
    print("Escribiendo WebP y miniaturas…")
    for n in range(1, N+1):
        im = Image.fromarray(clean[n])
        im.save(WEB/f"p{n:02d}.webp", "WEBP", quality=88, method=4)
        im.resize((260, round(260 * im.height / im.width)), Image.LANCZOS).save(THUMBS/f"p{n:02d}.jpg", quality=80)
    print("Capas de título…")
    for n in TITLE_PAGES:
        Image.fromarray(title_layer(pages[n]), "RGBA").save(WEB/f"p{n:02d}-text.webp", "WEBP", lossless=True, method=4)
        print(f"  p{n:02d}-text.webp")
    print("Listo.")

if __name__ == "__main__":
    main()
