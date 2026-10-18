#!/usr/bin/env python3
"""Build DayFlow mobile icons and splash screens from the web brand logo marks.

Source of truth (do not overwrite):
  apps/web/public/logo-light-icon.png
  apps/web/public/logo-dark-icon.png
"""

from pathlib import Path
from shutil import copy2

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WEB_PUBLIC = ROOT.parent / "web" / "public"
ASSETS = ROOT / "assets"
BRAND = ASSETS / "brand"
ICONS = ASSETS / "icons"

LIGHT_SRC = WEB_PUBLIC / "logo-light-icon.png"
DARK_SRC = WEB_PUBLIC / "logo-dark-icon.png"

# Match apps/mobile/app.json splash / adaptive plates.
LIGHT_BG = (246, 243, 234, 255)  # #f6f3ea
DARK_BG = (11, 11, 11, 255)  # #0b0b0b
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def load_master(src: Path) -> Image.Image:
    return Image.open(src).convert("RGBA")


def resize_master(src: Path, size: int) -> Image.Image:
    """Scale the full master square — preserves polished framing and edges."""
    return load_master(src).resize((size, size), Image.Resampling.LANCZOS)


def on_background(src: Path, size: int, background) -> Image.Image:
    mark = resize_master(src, size)
    if background == TRANSPARENT:
        return mark
    canvas = Image.new("RGBA", (size, size), background)
    canvas.alpha_composite(mark)
    return canvas


def crop_glyph(logo: Image.Image) -> Image.Image:
    bbox = logo.split()[-1].getbbox()
    if not bbox:
        return logo
    return logo.crop(bbox)


def place_inset(src: Path, size: int, background, pad_ratio: float) -> Image.Image:
    """Place cropped mark with extra inset (Android adaptive safe zone)."""
    logo = crop_glyph(load_master(src))
    inner = max(1, int(size * (1 - 2 * pad_ratio)))
    scale = min(inner / logo.width, inner / logo.height)
    new_size = (max(1, round(logo.width * scale)), max(1, round(logo.height * scale)))
    resized = logo.resize(new_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), background)
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def tinted_template(src: Path, size: int) -> Image.Image:
    """iOS tinted / Android monochrome: white glyph from master alpha."""
    mark = resize_master(src, size)
    glyph = Image.new("RGBA", mark.size, (255, 255, 255, 255))
    glyph.putalpha(mark.split()[-1])
    return glyph


def main() -> None:
    if not LIGHT_SRC.exists() or not DARK_SRC.exists():
        raise SystemExit(f"Missing web logos at {WEB_PUBLIC}")

    BRAND.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)

    # Keep mobile brand copies identical to the polished masters.
    copy2(LIGHT_SRC, BRAND / "logo-light-icon.png")
    copy2(DARK_SRC, BRAND / "logo-dark-icon.png")

    # iOS / store: full 1024 canvas visible (corners round only).
    on_background(LIGHT_SRC, 1024, WHITE).save(ASSETS / "icon.png", "PNG")
    on_background(LIGHT_SRC, 192, WHITE).save(ASSETS / "favicon.png", "PNG")
    on_background(LIGHT_SRC, 1024, WHITE).save(ICONS / "ios-light.png", "PNG")
    on_background(DARK_SRC, 1024, DARK_BG).save(ICONS / "ios-dark.png", "PNG")
    tinted_template(LIGHT_SRC, 1024).save(ICONS / "ios-tinted.png", "PNG")

    # Android adaptive: light mark on white, extra inset for the ~67% safe zone.
    adaptive = place_inset(LIGHT_SRC, 1024, WHITE, pad_ratio=0.32)
    adaptive.save(ICONS / "adaptive-icon.png", "PNG")
    copy2(ICONS / "adaptive-icon.png", ASSETS / "adaptive-icon.png")

    # Splash PNGs (Expo sizes image via imageWidth; keep square masters scaled up).
    on_background(LIGHT_SRC, 1284, LIGHT_BG).save(ICONS / "splash-icon-light.png", "PNG")
    on_background(DARK_SRC, 1284, DARK_BG).save(ICONS / "splash-icon-dark.png", "PNG")
    copy2(ICONS / "splash-icon-light.png", ICONS / "splash-icon.png")

    print("Wrote brand logos, app icons, and splash images from polished masters.")


if __name__ == "__main__":
    main()
