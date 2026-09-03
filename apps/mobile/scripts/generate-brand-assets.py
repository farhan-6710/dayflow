#!/usr/bin/env python3
"""Build DayFlow mobile icons and splash screens from the web brand logos."""

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

LIGHT_BG = (244, 247, 247, 255)  # web light background
DARK_BG = (18, 18, 18, 255)  # web dark background
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)

# DF mark is left-heavy (thick D stem vs thin check). Extra optical nudge after
# alpha-centroid centering, as a fraction of canvas size (~12px right / 6px down
# at 1024, which reads as a couple of pixels on a launcher icon).
OPTICAL_NUDGE = (0.012, 0.006)


def crop_glyph(logo: Image.Image) -> Image.Image:
    """Trim transparent (or near-empty) padding so the mark can fill the canvas."""
    alpha = logo.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return logo
    return logo.crop(bbox)


def alpha_centroid(logo: Image.Image) -> tuple[float, float]:
    """Return the alpha-weighted visual center of an RGBA glyph."""
    alpha = logo.split()[-1]
    w, h = logo.size
    data = alpha.tobytes()
    sx = sy = total = 0
    for i, a in enumerate(data):
        if a:
            sx += (i % w) * a
            sy += (i // w) * a
            total += a
    if not total:
        return (w / 2, h / 2)
    return (sx / total, sy / total)


def scaled_glyph(src: Path, size: int, pad_ratio: float) -> Image.Image:
    logo = crop_glyph(Image.open(src).convert("RGBA"))
    inner = max(1, int(size * (1 - 2 * pad_ratio)))
    scale = min(inner / logo.width, inner / logo.height)
    new_size = (max(1, round(logo.width * scale)), max(1, round(logo.height * scale)))
    return logo.resize(new_size, Image.Resampling.LANCZOS)


def place_glyph(logo: Image.Image, size: int, background) -> Image.Image:
    """Paste the glyph so its visual center sits on the canvas center, then nudge."""
    canvas = Image.new("RGBA", (size, size), background)
    cx, cy = alpha_centroid(logo)
    x = round(size / 2 - cx + size * OPTICAL_NUDGE[0])
    y = round(size / 2 - cy + size * OPTICAL_NUDGE[1])
    canvas.paste(logo, (x, y), logo)
    return canvas


def fit_on_canvas(src: Path, size: int, background, pad_ratio: float = 0.18) -> Image.Image:
    return place_glyph(scaled_glyph(src, size, pad_ratio), size, background)


def tinted_template(src: Path, size: int, pad_ratio: float = 0.22) -> Image.Image:
    """iOS tinted icon: white glyph using the logo alpha."""
    logo = scaled_glyph(src, size, pad_ratio)
    glyph = Image.new("RGBA", logo.size, (255, 255, 255, 255))
    glyph.putalpha(logo.split()[-1])
    return place_glyph(glyph, size, TRANSPARENT)


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

    # iOS / store: full 1024 canvas is visible (only corners round).
    fit_on_canvas(LIGHT_SRC, 1024, WHITE, 0.24).save(ASSETS / "icon.png", "PNG")
    fit_on_canvas(LIGHT_SRC, 192, WHITE, 0.22).save(ASSETS / "favicon.png", "PNG")

    # Android adaptive: only the center 72/108 (~67%) shows in the squircle.
    # 0.32 pad → ~36% of the 108 layer ≈ 54% of the visible icon (Expo Go-like).
    fit_on_canvas(LIGHT_SRC, 1024, TRANSPARENT, 0.32).save(
        ICONS / "adaptive-icon.png", "PNG"
    )
    copy2(ICONS / "adaptive-icon.png", ASSETS / "adaptive-icon.png")

    fit_on_canvas(LIGHT_SRC, 1024, WHITE, 0.24).save(ICONS / "ios-light.png", "PNG")
    fit_on_canvas(DARK_SRC, 1024, DARK_BG, 0.24).save(ICONS / "ios-dark.png", "PNG")
    tinted_template(LIGHT_SRC, 1024, 0.24).save(ICONS / "ios-tinted.png", "PNG")

    # Splash PNG: extra inset; display size is Expo's default 200 in app.json
    fit_on_canvas(LIGHT_SRC, 1284, LIGHT_BG, 0.28).save(
        ICONS / "splash-icon-light.png", "PNG"
    )
    fit_on_canvas(DARK_SRC, 1284, DARK_BG, 0.28).save(
        ICONS / "splash-icon-dark.png", "PNG"
    )

    print("Wrote brand logos, app icons, and splash images.")


if __name__ == "__main__":
    main()
