# Llampayec · Interactive magazine (flipbook)

Interactive version of the magazine **Llampayec, Issue No. 01 (November 2026)**, built from the final Canva export (56 pages).

Made for the Faculty of Communication Sciences of Universidad San Martín de Porres (USMP).

## Viewing the magazine
Open `index.html` by double-clicking it (works without a server), or publish the whole folder on any static hosting service.
Controls: keyboard arrows or drag to turn pages · `I` index · `Z` zoom · `F` fullscreen · direct link to a page: `index.html#p=12`.

## If the design changes in Canva
1. Download all pages as PNG (named `1.png` ... `N.png`) and copy them to a folder.
2. Run `python3 tools/build-assets.py <folder-with-the-pngs>`. It copies the originals to `assets/pages/pNN.png` and builds `assets/web` (WebP pages) and `assets/thumbs` (index thumbnails). Requires `pillow`.
3. Update `viewer/js/media.config.js`: `pageCount`, `pageTitles` and `sections` (the index), and the `max` of the slider in `index.html` if the number of pages changed.

## Images and videos on top of pages (optional)
All images are already inside the final pages. `slots` in `viewer/js/media.config.js` is empty, but the mechanism remains:
add `{ id, page, rect: [x, y, w, h], label, src: 'assets/media/file.jpg' }` to overlay an image or `.mp4` on a page
(`rect` is measured on the 1398×2000 page). Open the magazine with `?slots=1` to see the slots highlighted.

## Folders
- `index.html`, `viewer/`, `vendor/`: the viewer (StPageFlip, MIT license).
- `assets/pages/`: original PNG exports, 1398×2000 (source; not loaded by the web page; ignored by Git).
- `assets/web/`: WebP pages used by the viewer. `assets/thumbs/`: index thumbnails.
- `assets/media/`: optional images and videos for slots. `tools/build-assets.py`: asset builder.

## Note on `vendor/page-flip.browser.js`
The original library forces the cover and back cover to be rigid pages when `showCover` is enabled. It was patched (by removing those two `setDensity("hard")` calls in `createSpread`) so they fold like paper sheets, just like the inner pages. When updating the library, repeat that change.

## Deployment and version control
- This is a static site: Netlify publishes the project root (no build step) on every `git push` to `main`.
- `assets/pages/` and `assets/source/` are in `.gitignore` (heavy originals). Only what the website uses is versioned: `index.html`, `viewer/`, `vendor/`, `assets/web`, `assets/thumbs`, `assets/media`, `tools/`.
- Work done for the Llampayec magazine of the Faculty of Communication Sciences, Universidad San Martín de Porres. All rights reserved on design, texts and images (no open-source license).