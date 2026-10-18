#!/usr/bin/env python3
"""
Rebrand DayFlow logos from the processed dark source (white / cyan / orange)
into honey-gold light + dark variants, plus square icons.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

WEB_ROOT = Path(__file__).resolve().parent.parent
PUBLIC = WEB_ROOT / "public"
MOBILE_BRAND = WEB_ROOT.parent / "mobile" / "assets" / "brand"
MOBILE_ICONS = WEB_ROOT.parent / "mobile" / "assets" / "icons"
MOBILE_ASSETS = WEB_ROOT.parent / "mobile" / "assets"

# Source palette in logo-dark.png / logo-dark-icon.png (pre-rebrand)
SOURCE_PAPER = (237, 237, 237)
SOURCE_CYAN = (0, 169, 203)
SOURCE_ORANGE = (246, 96, 19)
SOURCE_HAIRLINE = (47, 47, 47)

# Dark UI — cream ink + honey gold
DARK_PAPER = (243, 239, 228)  # --ink / cream
DARK_GOLD = (233, 191, 85)  # --primary #e9bf55
DARK_ACCENT = (240, 207, 122)  # --accent #f0cf7a
DARK_HAIRLINE = (107, 98, 73)  # muted gold-brown

# Light UI — chocolate ink + honey gold
LIGHT_PAPER = (28, 26, 23)  # --foreground #1c1a17
LIGHT_GOLD = (233, 191, 85)  # --primary
LIGHT_ACCENT = (217, 169, 58)  # --accent #d9a93a
LIGHT_HAIRLINE = (125, 118, 104)  # --muted-foreground-ish

SOURCE_COLORS = {
    "paper": SOURCE_PAPER,
    "cyan": SOURCE_CYAN,
    "orange": SOURCE_ORANGE,
    "hairline": SOURCE_HAIRLINE,
}

DARK_TARGETS = {
    "paper": DARK_PAPER,
    "cyan": DARK_GOLD,
    "orange": DARK_ACCENT,
    "hairline": DARK_HAIRLINE,
}

LIGHT_TARGETS = {
    "paper": LIGHT_PAPER,
    "cyan": LIGHT_GOLD,
    "orange": LIGHT_ACCENT,
    "hairline": LIGHT_HAIRLINE,
}


def luminance(r: int, g: int, b: int) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


PAPER_LUMINANCE = max(luminance(*SOURCE_PAPER), 1.0)


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(3)))


def nearest_region(r: int, g: int, b: int) -> str:
    return min(
        SOURCE_COLORS,
        key=lambda name: color_distance((r, g, b), SOURCE_COLORS[name]),
    )


def scale_to_target(
    r: int,
    g: int,
    b: int,
    source: tuple[int, int, int],
    target: tuple[int, int, int],
) -> tuple[int, int, int]:
    source_lum = max(luminance(*source), 1.0)
    pixel_lum = luminance(r, g, b)
    t = max(0.0, min(1.0, pixel_lum / source_lum))
    return tuple(int(target[i] * t) for i in range(3))  # type: ignore[return-value]


def remap_pixel(
    r: int,
    g: int,
    b: int,
    a: int,
    targets: dict[str, tuple[int, int, int]],
) -> tuple[int, int, int, int]:
    if a < 8:
        return (0, 0, 0, 0)

    # Treat near-black as transparent (icon masters often have black mats)
    if max(r, g, b) < 18:
        return (0, 0, 0, 0)

    region = nearest_region(r, g, b)
    source = SOURCE_COLORS[region]
    target = targets[region]

    if region == "paper":
        t = max(0.0, min(1.0, luminance(r, g, b) / PAPER_LUMINANCE))
        mapped = tuple(int(target[i] * t) for i in range(3))
    else:
        mapped = scale_to_target(r, g, b, source, target)

    return (*mapped, a)  # type: ignore[return-value]


def remap_image(
    image: Image.Image,
    targets: dict[str, tuple[int, int, int]],
) -> Image.Image:
    out = image.convert("RGBA")
    pixels = out.load()
    width, height = out.size
    for y in range(height):
        for x in range(width):
            pixels[x, y] = remap_pixel(*pixels[x, y], targets)
    return out


def crop_to_content(image: Image.Image, padding: int = 12) -> Image.Image:
    alpha = image.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return image
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding)
    bottom = min(image.height, bottom + padding)
    return image.crop((left, top, right, bottom))


def extract_mark_icon(logo: Image.Image, padding: int = 10) -> Image.Image:
    """Crop the DF mark left of the vertical hairline."""
    rgba = logo.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    hairline_x = None

    for x in range(int(width * 0.18), int(width * 0.58)):
        opaque = 0
        dark = 0
        for y in range(height):
            r, g, b, a = pixels[x, y]
            if a < 24:
                continue
            opaque += 1
            if max(r, g, b) < 110 and abs(r - g) < 24 and abs(g - b) < 24:
                dark += 1
        if opaque > height * 0.25 and dark >= opaque * 0.65:
            hairline_x = x
            break

    if hairline_x is None:
        hairline_x = min(width, height + padding * 2)

    mark = rgba.crop((0, 0, max(1, hairline_x - 2), height))
    return crop_to_content(mark, padding=padding)


def fit_square(image: Image.Image, size: int, pad_ratio: float = 0.12) -> Image.Image:
    """Center mark on a transparent square canvas."""
    mark = crop_to_content(image.convert("RGBA"), padding=0)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    max_inner = int(size * (1 - pad_ratio * 2))
    scale = min(max_inner / mark.width, max_inner / mark.height)
    new_size = (max(1, int(mark.width * scale)), max(1, int(mark.height * scale)))
    resized = mark.resize(new_size, Image.Resampling.LANCZOS)
    ox = (size - resized.width) // 2
    oy = (size - resized.height) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)
    try:
        label = path.relative_to(WEB_ROOT.parent.parent)
    except ValueError:
        label = path
    print(f"{label}: {image.width}x{image.height}")


def compose_on_background(
    mark: Image.Image,
    size: int,
    background: tuple[int, int, int],
    pad_ratio: float = 0.18,
) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (*background, 255))
    fitted = fit_square(mark, size, pad_ratio=pad_ratio)
    canvas.alpha_composite(fitted)
    return canvas.convert("RGBA")


def main() -> None:
    source_logo_path = PUBLIC / "logo-dark.png"
    if not source_logo_path.exists():
        raise SystemExit(f"Missing {source_logo_path}; run process-logos.py first")

    source_logo = Image.open(source_logo_path).convert("RGBA")

    # Prefer dedicated icon master if it still looks like the cyan palette
    icon_master_path = PUBLIC / "logo-dark-icon.png"
    if icon_master_path.exists():
        icon_master = Image.open(icon_master_path).convert("RGBA")
        # Heuristic: original icon has strong cyan channel dominance in mid tones
        cyanish = 0
        for r, g, b, a in icon_master.get_flattened_data():
            if a > 200 and b > 140 and g > 100 and r < 80:
                cyanish += 1
        if cyanish < 200:
            icon_master = extract_mark_icon(source_logo)
    else:
        icon_master = extract_mark_icon(source_logo)

    dark_logo = remap_image(source_logo, DARK_TARGETS)
    light_logo = remap_image(source_logo, LIGHT_TARGETS)
    dark_icon = fit_square(remap_image(icon_master, DARK_TARGETS), 512)
    light_icon = fit_square(remap_image(icon_master, LIGHT_TARGETS), 512)

    save(dark_logo, PUBLIC / "logo-dark.png")
    save(light_logo, PUBLIC / "logo-light.png")
    save(dark_icon, PUBLIC / "logo-dark-icon.png")
    save(light_icon, PUBLIC / "logo-light-icon.png")

    # Mobile brand marks
    save(dark_icon, MOBILE_BRAND / "logo-dark-icon.png")
    save(light_icon, MOBILE_BRAND / "logo-light-icon.png")

    # App / splash style icons on brand surfaces
    cream = (246, 243, 234)  # --background light #f6f3ea
    obsidian = (11, 11, 11)  # --background dark #0b0b0b
    app_light = compose_on_background(light_icon, 1024, cream)
    app_dark = compose_on_background(dark_icon, 1024, obsidian)
    app_tinted = compose_on_background(dark_icon, 1024, (233, 191, 85))  # gold

    save(app_light, MOBILE_ASSETS / "icon.png")
    save(app_light, MOBILE_ICONS / "ios-light.png")
    save(app_dark, MOBILE_ICONS / "ios-dark.png")
    save(app_tinted, MOBILE_ICONS / "ios-tinted.png")
    save(app_light, MOBILE_ICONS / "adaptive-icon.png")
    save(app_light, MOBILE_ASSETS / "adaptive-icon.png")
    save(app_light, MOBILE_ICONS / "splash-icon.png")
    save(app_light, MOBILE_ICONS / "splash-icon-light.png")
    save(app_dark, MOBILE_ICONS / "splash-icon-dark.png")
    save(fit_square(light_icon, 48), MOBILE_ASSETS / "favicon.png")

    # Staging icon for `bunx tauri icon <path>` (solid cream plate + mark)
    tauri_source = compose_on_background(light_icon, 1024, cream, pad_ratio=0.16)
    staging_dir = WEB_ROOT / "scripts" / ".cache"
    staging = staging_dir / "tauri-icon-source.png"
    save(tauri_source, staging)
    print(f"Tauri icon source ready: {staging}")
    print("Refresh desktop icons with: bunx tauri icon scripts/.cache/tauri-icon-source.png")


if __name__ == "__main__":
    main()
