#!/usr/bin/env python3
"""Recolour the DayFlow logos to the current theme, then rebuild every size made from them.

Colours come from shared/theme/theme.css (repo root): the accent is --chart-1, the ink is --foreground for that theme.
Both themes are built from the dark masters, whose edges are clean, so the two logos match exactly.
Each pixel is split into accent and ink coverage and rebuilt from those. Safe to run again: the
accent is read as accent.

Writes apps/web/design/brand/logo-{light,dark}[-icon].png (masters), dayflow-logo-{light,dark}.png and
apps/web/public/logo-{light,dark}-icon.webp and favicon*.ico (shipped).
Run apps/mobile/scripts/generate-brand-assets.py afterwards for the mobile icons.
"""

import colorsys
import math
import re
from pathlib import Path

from PIL import Image

WEB = Path(__file__).resolve().parents[1]
THEME = WEB.parents[1] / "shared" / "theme" / "theme.css"
BRAND = WEB / "design" / "brand"
PUBLIC = WEB / "public"

MARK_WEBP_SIZE = 160
FAVICON_SIZES = [(16, 16), (32, 32), (48, 48)]
PRESENTATION_SIZE = (1672, 941)
# Hues the accent can be, old gold or current coral.
ACCENT_HUES = (5 / 360, 65 / 360)
# Chroma range over which a pixel goes from ink to accent. Chroma rather than HSV saturation, which
# reads near-black as highly saturated and would tint the ink.
ACCENT_CHROMA = (0.15, 0.35)
# Brightness at which a master's ink counts as fully solid.
SOLID_INK_VALUE = 0.75


def oklch_to_rgb(lightness: float, chroma: float, hue: float) -> tuple[int, int, int]:
    a = chroma * math.cos(math.radians(hue))
    b = chroma * math.sin(math.radians(hue))
    l_ = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m_ = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s_ = (lightness - 0.0894841775 * a - 1.2914855480 * b) ** 3
    linear = (
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_,
    )

    def encode(value: float) -> int:
        value = min(1.0, max(0.0, value))
        srgb = 12.92 * value if value <= 0.0031308 else 1.055 * value ** (1 / 2.4) - 0.055
        return round(srgb * 255)

    return encode(linear[0]), encode(linear[1]), encode(linear[2])


def theme_color(block: str, token: str) -> tuple[int, int, int]:
    match = re.search(rf"--{token}:\s*oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)", block)
    if not match:
        raise SystemExit(f"--{token} not found in {THEME}")
    return oklch_to_rgb(*(float(value) for value in match.groups()))


def recolor(source: Image.Image, accent: tuple[int, int, int], ink: tuple[int, int, int]) -> Image.Image:
    result = source.convert("RGBA")
    pixels = result.load()
    for y in range(result.height):
        for x in range(result.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue
            hue, _, value = colorsys.rgb_to_hsv(red / 255, green / 255, blue / 255)
            chroma = (max(red, green, blue) - min(red, green, blue)) / 255
            low, high = ACCENT_CHROMA
            in_accent_hue = ACCENT_HUES[0] <= hue <= ACCENT_HUES[1]
            accent_share = min(1.0, max(0.0, (chroma - low) / (high - low))) if in_accent_hue else 0.0
            # The dark masters have pale ink, so brightness is how solid the ink is.
            ink_strength = min(1.0, value / SOLID_INK_VALUE)
            accent_alpha = accent_share
            ink_alpha = (1 - accent_share) * ink_strength
            total = accent_alpha + ink_alpha
            if total == 0:
                pixels[x, y] = (0, 0, 0, 0)
                continue
            mixed = [round((a * accent_alpha + i * ink_alpha) / total) for a, i in zip(accent, ink)]
            pixels[x, y] = (*mixed, round(alpha * min(1.0, total)))
    return result


def favicon_frame(mark: Image.Image) -> Image.Image:
    """Crops to the artwork and centres it on a square, since tiny sizes can't spare the master's margin."""
    box = mark.getchannel("A").point(lambda alpha: 255 if alpha > 16 else 0).getbbox()
    glyph = mark.crop(box)
    side = round(max(glyph.size) * 1.08)
    frame = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    frame.alpha_composite(glyph, ((side - glyph.width) // 2, (side - glyph.height) // 2))
    return frame


def presentation_logo(lockup: Image.Image, background: tuple[int, int, int]) -> Image.Image:
    """The lockup centred on the theme background, for use outside the app."""
    width = round(PRESENTATION_SIZE[0] * 0.6)
    scaled = lockup.resize((width, round(lockup.height * width / lockup.width)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", PRESENTATION_SIZE, (*background, 255))
    canvas.alpha_composite(scaled, ((canvas.width - scaled.width) // 2, (canvas.height - scaled.height) // 2))
    return canvas.convert("RGB")


def main() -> None:
    css = THEME.read_text()
    # Anchored to line starts, because the file's header comment also mentions these selectors.
    root, dark, theme_inline = (re.search(pattern, css, re.M).start() for pattern in (r"^:root \{", r"^\.dark \{", r"^@theme"))
    light_block = css[root:dark]
    dark_block = css[dark:theme_inline]
    accent = theme_color(light_block, "chart-1")

    # Load first: the dark masters are also written to in this loop.
    lockup = Image.open(BRAND / "logo-dark.png").convert("RGBA")
    icon = Image.open(BRAND / "logo-dark-icon.png").convert("RGBA")

    for theme, block in (("light", light_block), ("dark", dark_block)):
        ink = theme_color(block, "foreground")
        recolor(lockup, accent, ink).save(BRAND / f"logo-{theme}.png", optimize=True)
        recolor(icon, accent, ink).save(BRAND / f"logo-{theme}-icon.png", optimize=True)
        presentation_logo(recolor(lockup, accent, ink), theme_color(block, "background")).save(
            BRAND / f"dayflow-logo-{theme}.png", optimize=True
        )
        print(f"{theme}: accent {accent}, ink {ink}")

        mark = Image.open(BRAND / f"logo-{theme}-icon.png")
        mark.resize((MARK_WEBP_SIZE, MARK_WEBP_SIZE), Image.Resampling.LANCZOS).save(
            PUBLIC / f"logo-{theme}-icon.webp", quality=92, method=6
        )
        favicon_frame(mark).save(PUBLIC / f"favicon-{theme}.ico", sizes=FAVICON_SIZES)

    favicon_frame(Image.open(BRAND / "logo-light-icon.png")).save(PUBLIC / "favicon.ico", sizes=FAVICON_SIZES)


if __name__ == "__main__":
    main()
