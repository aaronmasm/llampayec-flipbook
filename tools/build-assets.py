"""Build the flipbook assets from the Canva PNG export.

Usage: python3 tools/build-assets.py <folder-with-1.png-2.png-...>

For every page N it writes (never touching the original PNGs):
  assets/pages/pNN.png    copy of the original (git-ignored)
  assets/web/pNN.webp     page shown by the viewer
  assets/thumbs/pNN.jpg   thumbnail for the index
Requires: pillow
"""
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAGE_SIZE = (1398, 2000)
THUMB_SIZE = (260, 372)


def main(src: Path) -> None:
    pngs = sorted(src.glob("*.png"), key=lambda p: int(p.stem))
    if not pngs:
        sys.exit(f"No numbered PNG files found in {src}")
    for d in ("pages", "web", "thumbs"):
        (ROOT / "assets" / d).mkdir(parents=True, exist_ok=True)
    for png in pngs:
        name = f"p{int(png.stem):02d}"
        im = Image.open(png).convert("RGB")
        if im.size != PAGE_SIZE:
            print(f"warning: {png.name} is {im.size}, expected {PAGE_SIZE}")
        shutil.copyfile(png, ROOT / "assets/pages" / f"{name}.png")
        im.save(ROOT / "assets/web" / f"{name}.webp", quality=88, method=4)
        im.resize(THUMB_SIZE, Image.LANCZOS).save(ROOT / "assets/thumbs" / f"{name}.jpg", quality=80)
    print(f"Built {len(pngs)} pages. Remember to update pageCount/sections in viewer/js/media.config.js")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))