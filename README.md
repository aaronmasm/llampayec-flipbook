# Llampayec · Interactive magazine (flipbook)

Interactive version of the magazine **Llampayec, Issue No. 01 (November 2026)**, built from the Canva design without modifying it.
The original Canva design was not touched: this repository only contains exported pages.

Made for the Faculty of Communication Sciences of Universidad San Martín de Porres (USMP).

## Viewing the magazine
Open `index.html` by double-clicking it (works without a server), or publish the whole folder on any static hosting service.
Controls: keyboard arrows or drag to turn pages · `I` index · `Z` zoom · `F` fullscreen · direct link to a page: `index.html#p=12`.

## Placing images and videos in the slots
1. Copy the file into `assets/media/`.
2. Open `viewer/js/media.config.js`, find the slot in `slots` and set its path in `src`
   (image `.jpg/.png/.webp` or video `.mp4/.webm`; for videos you can add a `poster`).
   Optional per-slot settings: `fit` (`cover`/`contain`), `pos` (crop position, e.g. `'44% 50%'`), `radius`, `textLayer` and `textLight` (white title with shadow over dark/busy photos).
3. Reload. If `src` is `null`, the slot is invisible and the page looks identical to Canva.

To see all slots highlighted: `index.html?slots=1`. To preview them filled with sample images: `index.html?demo=1`.

| Slot | Page | What it is |
|---|---|---|
| p02-pagina-completa | 2 | Full-page image |
| p04-pagina-completa | 4 | Full-page image |
| p05-criollismo | 5 | Vertical image |
| p06-criollismo | 6 | Horizontal image |
| p07-pagina-completa | 7 | Full-page image |
| p09-takahashi | 9 | Cover photo of Luis Abelardo Takahashi Núñez (title over the photo) — filled |
| p15-escajadillo | 15 | Cover photo of José Escajadillo Farro (title over the photo) — filled |
| p22-mochicas | 22 | Cover photo of Los Mochicas (title over the photo) |
| p26-mochica | 26 | Vertical image |
| p31-checo | 31 | Photo of the "checo" in the oval (arch-shaped slot; ideal: cut-out PNG, `fit: 'contain'`) |

Titles over photos (pages 9, 15 and 22): the title was extracted as a transparent text layer (`assets/web/pNN-text.webp`) and is already configured in `textLayer`. When the slot receives its photo or video, the title is drawn on top automatically.

## Regenerating images (`tools/build-assets.py`)
Builds `assets/web`, `assets/thumbs` and the title layers from the original PNG files (which are never modified). It also removes the gray side strips from pages 3, 10–13 and 26–33 (pages 30–33 have no clean sibling pages, so the adjacent paper is mirrored). Requires `numpy`, `opencv-python-headless` and `pillow`: `python3 tools/build-assets.py`.
If you fix the strips in Canva and export again, the script keeps working.

## Folders
- `index.html`, `viewer/`, `vendor/`: the viewer (StPageFlip, MIT license).
- `assets/pages/`: original Canva PNG exports, 1398×2000 (source; not loaded by the web page; ignored by Git).
- `assets/web/`: WebP pages used by the viewer. `assets/thumbs/`: index thumbnails.
- `assets/source/REVISTA.zip`: the original Canva download (ignored by Git). `assets/media/`: your images and videos go here.

## If the design changes in Canva
Download all pages again as PNG, replace `assets/pages/pNN.png` and regenerate `assets/web` and `assets/thumbs`
(`convert pNN.png -quality 88 ../web/pNN.webp` and `convert pNN.png -resize 260x -quality 80 ../thumbs/pNN.jpg`).

## Note on `vendor/page-flip.browser.js`
The original library forces the cover and back cover to be rigid pages when `showCover` is enabled. It was patched (by removing those two `setDensity("hard")` calls in `createSpread`) so they fold like paper sheets, just like the inner pages. When updating the library, repeat that change.

## Deployment and version control
- This is a static site: Netlify publishes the project root (no build step) on every `git push` to `main`.
- `assets/pages/` and `assets/source/` are in `.gitignore` (heavy Canva originals). Only what the website uses is versioned: `index.html`, `viewer/`, `vendor/`, `assets/web`, `assets/thumbs`, `assets/media`, `tools/`.
- Work done for the Llampayec magazine of the Faculty of Communication Sciences, Universidad San Martín de Porres. All rights reserved on design, texts and images (no open-source license).