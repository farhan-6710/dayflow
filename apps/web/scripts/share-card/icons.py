"""Builds the PNG favicons and the apple-touch icon from the logo mark masters.

Outputs (apps/web/public):
  favicon-light.png      192px, transparent, ink + coral mark for light browser UI
  favicon-dark.png       192px, transparent, cream + coral mark for dark browser UI
  apple-touch-icon.png   180px, light mark on the cream brand tile (opaque)
The hand-hinted favicon*.ico files (16/32/48) already exist: brand_icon.py makes them, so they are not redrawn here.
Run through scripts/share-card/render.sh or: python3 scripts/share-card/icons.py
"""
from pathlib import Path

from PIL import Image

WEB = Path(__file__).resolve().parents[2]
BRAND = WEB / "design" / "brand"
PUBLIC = WEB / "public"
FAVICON_SIZE = 192
APPLE_SIZE = 180
FAVICON_PADDING = 0.04
APPLE_PADDING = 0.16
CREAM = (233, 228, 216, 255)  # light theme background


def square(master: str, size: int, padding: float, background=(0, 0, 0, 0)) -> Image.Image:
    """Trims the master to the mark and centres it on a square canvas with even padding."""
    mark = Image.open(BRAND / master).convert("RGBA")
    mark = mark.crop(mark.getchannel("A").getbbox())
    inner = size * (1 - 2 * padding)
    scale = inner / max(mark.size)
    mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), background)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return canvas


square("logo-light-icon.png", FAVICON_SIZE, FAVICON_PADDING).save(PUBLIC / "favicon-light.png", optimize=True)
square("logo-dark-icon.png", FAVICON_SIZE, FAVICON_PADDING).save(PUBLIC / "favicon-dark.png", optimize=True)
square("logo-light-icon.png", APPLE_SIZE, APPLE_PADDING, CREAM).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
print("Wrote favicon-light.png, favicon-dark.png, apple-touch-icon.png")
