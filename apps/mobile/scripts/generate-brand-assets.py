#!/usr/bin/env python3
"""Build DayFlow mobile icons and splash images from the web brand logo marks.

Every image uses one placement: the mark cropped to its edges, centred on the canvas, then moved right
by 10% of its own width (the mark's heavy "D" sits on the left, so a bounding-box centre looks
left-leaning). The desktop icon uses the same placement: apps/web/scripts/generate-tauri-icon.py.

Sources (made by apps/web/scripts/recolor-logos.py) and colours (shared/brand/theme.json):
  apps/web/design/brand/logo-light-icon.png, logo-dark-icon.png

Needs Pillow. Run from anywhere: python3 apps/mobile/scripts/generate-brand-assets.py
"""

import json
from pathlib import Path
from shutil import copy2

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND_SRC = ROOT.parent / "web" / "design" / "brand"
THEME = ROOT.parents[1] / "shared" / "brand" / "theme.json"
ASSETS = ROOT / "assets"
BRAND = ASSETS / "brand"
ICONS = ASSETS / "icons"

LIGHT_SRC = BRAND_SRC / "logo-light-icon.png"
DARK_SRC = BRAND_SRC / "logo-dark-icon.png"

TRANSPARENT = (0, 0, 0, 0)
SHIFT = 0.10  # of the mark's own width, to the right
# Mark width as a share of the canvas.
FULL_BLEED = 0.635  # iOS and the store icon: the same share of the visible area as the desktop tile
ADAPTIVE = 0.44  # Android adaptive: the tip of the check stays inside the 66dp safe circle, so round launchers cut nothing
SPLASH = 0.702  # splash: the size the old splash used


def colour(hex_value: str) -> tuple[int, int, int, int]:
    return (*(int(hex_value[i : i + 2], 16) for i in (1, 3, 5)), 255)


def place_mark(src: Path, size: int, share: float, background, white: bool = False) -> Image.Image:
    """The mark at `share` of the canvas width, centred, then moved right by SHIFT of its width."""
    mark = Image.open(src).convert("RGBA")
    mark = mark.crop(mark.getbbox())
    scale = round(size * share) / mark.width
    mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.Resampling.LANCZOS)
    if white:
        glyph = Image.new("RGBA", mark.size, (255, 255, 255, 255))
        glyph.putalpha(mark.split()[-1])
        mark = glyph
    canvas = Image.new("RGBA", (size, size), background)
    x = (size - mark.width) // 2 + round(mark.width * SHIFT)
    canvas.alpha_composite(mark, (x, (size - mark.height) // 2))
    return canvas


def main() -> None:
    if not LIGHT_SRC.exists() or not DARK_SRC.exists():
        raise SystemExit(f"Missing web logos at {BRAND_SRC}")

    colors = json.loads(THEME.read_text())
    light_bg = colour(colors["light"]["colors"]["background"])
    dark_bg = colour(colors["dark"]["colors"]["background"])

    BRAND.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)

    # The logo masters the app shows on its own screens.
    copy2(LIGHT_SRC, BRAND / "logo-light-icon.png")
    copy2(DARK_SRC, BRAND / "logo-dark-icon.png")

    # iOS and the store: a full square, since the system rounds the corners.
    place_mark(LIGHT_SRC, 1024, FULL_BLEED, light_bg).save(ASSETS / "icon.png")
    place_mark(LIGHT_SRC, 1024, FULL_BLEED, light_bg).save(ICONS / "ios-light.png")
    place_mark(DARK_SRC, 1024, FULL_BLEED, dark_bg).save(ICONS / "ios-dark.png")
    place_mark(LIGHT_SRC, 1024, FULL_BLEED, TRANSPARENT, white=True).save(ICONS / "ios-tinted.png")
    place_mark(LIGHT_SRC, 192, FULL_BLEED, light_bg).save(ASSETS / "favicon.png")

    # Android adaptive: the mark alone on transparent. The plate colour is backgroundColor in app.json.
    place_mark(LIGHT_SRC, 1024, ADAPTIVE, TRANSPARENT).save(ICONS / "adaptive-icon.png")
    place_mark(LIGHT_SRC, 1024, ADAPTIVE, TRANSPARENT, white=True).save(ICONS / "adaptive-monochrome.png")
    copy2(ICONS / "adaptive-icon.png", ASSETS / "adaptive-icon.png")

    # Splash: the mark alone; its plate colour is backgroundColor in app.json.
    place_mark(LIGHT_SRC, 1284, SPLASH, TRANSPARENT).save(ICONS / "splash-icon-light.png")
    place_mark(DARK_SRC, 1284, SPLASH, TRANSPARENT).save(ICONS / "splash-icon-dark.png")
    copy2(ICONS / "splash-icon-light.png", ICONS / "splash-icon.png")

    print("Wrote the app icons, adaptive icons and splash images.")


if __name__ == "__main__":
    main()
