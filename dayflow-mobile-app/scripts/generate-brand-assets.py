#!/usr/bin/env python3
"""Build DayFlow mobile icons and splash screens from the web brand logos."""

from pathlib import Path
from shutil import copy2

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WEB_PUBLIC = ROOT.parent / "public"
ASSETS = ROOT / "assets"
BRAND = ASSETS / "brand"
ICONS = ASSETS / "icons"

LIGHT_SRC = WEB_PUBLIC / "logo-light-icon.png"
DARK_SRC = WEB_PUBLIC / "logo-dark-icon.png"

LIGHT_BG = (244, 247, 247, 255)  # web light background
DARK_BG = (18, 18, 18, 255)  # web dark background
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def fit_on_canvas(src: Path, size: int, background, pad_ratio: float = 0.16) -> Image.Image:
    logo = Image.open(src).convert("RGBA")
    canvas = Image.new("RGBA", (size, size), background)
    inner = int(size * (1 - 2 * pad_ratio))
    logo.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    x = (size - logo.width) // 2
    y = (size - logo.height) // 2
    canvas.paste(logo, (x, y), logo)
    return canvas


def tinted_template(src: Path, size: int) -> Image.Image:
    """iOS tinted icon: white glyph using the logo alpha."""
    logo = Image.open(src).convert("RGBA")
    inner = int(size * 0.68)
    logo.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    glyph = Image.new("RGBA", logo.size, (255, 255, 255, 255))
    glyph.putalpha(logo.split()[-1])
    canvas = Image.new("RGBA", (size, size), TRANSPARENT)
    x = (size - glyph.width) // 2
    y = (size - glyph.height) // 2
    canvas.paste(glyph, (x, y), glyph)
    return canvas


def save_rgb(image: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if image.mode == "RGBA":
        bg = Image.new("RGB", image.size, (255, 255, 255))
        bg.paste(image, mask=image.split()[-1])
        bg.save(dest, "PNG")
    else:
        image.convert("RGB").save(dest, "PNG")


def main() -> None:
    if not LIGHT_SRC.exists() or not DARK_SRC.exists():
        raise SystemExit(f"Missing web logos at {WEB_PUBLIC}")

    BRAND.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)

    copy2(LIGHT_SRC, BRAND / "logo-light-icon.png")
    copy2(DARK_SRC, BRAND / "logo-dark-icon.png")

    # App / Play icon (light logo on white)
    fit_on_canvas(LIGHT_SRC, 1024, WHITE, 0.14).save(ASSETS / "icon.png", "PNG")
    fit_on_canvas(LIGHT_SRC, 192, WHITE, 0.12).save(ASSETS / "favicon.png", "PNG")

    # Adaptive / notification foreground (transparent)
    fit_on_canvas(LIGHT_SRC, 1024, TRANSPARENT, 0.18).save(
        ICONS / "adaptive-icon.png", "PNG"
    )
    copy2(ICONS / "adaptive-icon.png", ASSETS / "adaptive-icon.png")

    # iOS appearance icons
    fit_on_canvas(LIGHT_SRC, 1024, WHITE, 0.14).save(ICONS / "ios-light.png", "PNG")
    fit_on_canvas(DARK_SRC, 1024, DARK_BG, 0.14).save(ICONS / "ios-dark.png", "PNG")
    tinted_template(LIGHT_SRC, 1024).save(ICONS / "ios-tinted.png", "PNG")

    # Splash: logo on brand surfaces
    fit_on_canvas(LIGHT_SRC, 1284, LIGHT_BG, 0.28).save(
        ICONS / "splash-icon-light.png", "PNG"
    )
    fit_on_canvas(DARK_SRC, 1284, DARK_BG, 0.28).save(
        ICONS / "splash-icon-dark.png", "PNG"
    )

    print("Wrote brand logos, app icons, and splash images.")


if __name__ == "__main__":
    main()
