#!/usr/bin/env python3
"""
Recolor legacy cyan/orange public brand assets to the honey-gold theme.

Reads untouched masters from scripts/.cache/masters/ and writes themed
PNGs into apps/web/public/. Safe to re-run.
"""

from __future__ import annotations

import colorsys
from pathlib import Path

from PIL import Image

WEB_ROOT = Path(__file__).resolve().parent.parent
PUBLIC = WEB_ROOT / "public"
MASTERS = WEB_ROOT / "scripts" / "masters"

# Brand targets (match index.css)
GOLD = (233, 191, 85)  # --primary #e9bf55
GOLD_LIGHT = (240, 207, 122)  # --accent dark #f0cf7a
GOLD_DEEP = (217, 169, 58)  # --accent light #d9a93a
INK_LIGHT = (28, 26, 23)  # --foreground on light UI
INK_DARK = (243, 239, 228)  # cream ink on dark UI


def luminance(r: int, g: int, b: int) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


def classify_accent(r: int, g: int, b: int) -> str | None:
    """
    Return remap class:
      - cyan_bright: logo F / UI primary → gold
      - cyan_ink: dark teal wordmark ink on light masters → chocolate
      - orange: checkmark / accents → gold accent
      - None: leave unchanged
    """
    mx, mn = max(r, g, b), min(r, g, b)
    chroma = mx - mn
    if chroma < 22:
        return None

    h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
    hue = h * 360.0
    sat = s
    val = v

    # Skip plant greens / status greens
    if 85.0 <= hue <= 155.0 and sat > 0.25:
        return None

    is_cyan_hue = 165.0 <= hue <= 215.0
    is_cyan_rgb = b > r + 20 and g > r + 8
    # Pale UI chip fills (low sat, high value) still read as brand cyan.
    if (is_cyan_hue or is_cyan_rgb) and (
        sat >= 0.2 or (sat >= 0.08 and val >= 0.82 and b >= r + 6)
    ):
        # Light-logo masters paint the D/wordmark as dark teal, not charcoal.
        if val < 0.38:
            return "cyan_ink"
        if val >= 0.38 and (b >= 90 or chroma >= 20):
            return "cyan_bright"

    # Orange brand accents (checkmark, underline, sticky notes)
    is_orange_hue = (hue <= 38.0) or (hue >= 345.0)
    is_orange_rgb = r > g + 20 and r > b + 40 and g > b and r >= 120
    if sat >= 0.28 and val >= 0.25 and (is_orange_hue or is_orange_rgb):
        # Avoid warm wood / skin that is low-chroma orange-brown
        if chroma < 45 and val < 0.55:
            return None
        return "orange"

    return None


def map_accent(
    r: int,
    g: int,
    b: int,
    kind: str,
    theme: str,
) -> tuple[int, int, int]:
    src_lum = max(luminance(r, g, b), 1.0)

    if kind == "cyan_ink":
        target = INK_LIGHT if theme == "light" else INK_DARK
    elif kind == "cyan_bright":
        # Soft fills stay soft (warm cream); saturated accents become gold.
        if src_lum > 200:
            target = (246, 236, 210) if theme == "light" else (58, 48, 28)
        else:
            target = GOLD
    else:
        target = GOLD_LIGHT if theme == "dark" else GOLD_DEEP

    tgt_lum = max(luminance(*target), 1.0)
    scale = min(1.35, max(0.35, src_lum / tgt_lum))
    return tuple(max(0, min(255, int(target[i] * scale))) for i in range(3))  # type: ignore[return-value]


def rebrand_image(image: Image.Image, theme: str) -> Image.Image:
    out = image.convert("RGBA")
    pixels = out.load()
    width, height = out.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a < 8:
                continue
            kind = classify_accent(r, g, b)
            if kind is None:
                continue
            nr, ng, nb = map_accent(r, g, b, kind, theme)
            pixels[x, y] = (nr, ng, nb, a)
    return out


def ensure_masters() -> None:
    MASTERS.mkdir(parents=True, exist_ok=True)
    for name in (
        "dayflow-logo-dark.png",
        "dayflow-logo-light.png",
        "brand-promotion-banner-dark.png",
        "brand-promotion-banner-light.png",
        "brand-promotion-banner-img-dark.png",
    ):
        dest = MASTERS / name
        src = PUBLIC / name
        if not dest.exists() and src.exists():
            dest.write_bytes(src.read_bytes())
            print(f"cached master: {name}")


def convert(name: str, theme: str) -> None:
    master = MASTERS / name
    if not master.exists():
        raise SystemExit(f"Missing master {master}; restore cyan original first")
    out = rebrand_image(Image.open(master), theme=theme)
    dest = PUBLIC / name
    out.save(dest, format="PNG", optimize=True)
    print(f"{name}: rebranded ({theme})")


def main() -> None:
    ensure_masters()
    convert("dayflow-logo-dark.png", "dark")
    convert("dayflow-logo-light.png", "light")
    convert("brand-promotion-banner-dark.png", "dark")
    convert("brand-promotion-banner-light.png", "light")
    convert("brand-promotion-banner-img-dark.png", "dark")


if __name__ == "__main__":
    main()
