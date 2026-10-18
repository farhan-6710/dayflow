#!/usr/bin/env python3
"""Remove background from the cyan dayflow logo master and crop to logo-dark.png."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

WEB_ROOT = Path(__file__).resolve().parent.parent
PUBLIC = WEB_ROOT / "public"
# Cyan master kept outside public so public dayflow-logo-* can stay gold-themed.
MASTER = WEB_ROOT / "scripts" / "masters" / "dayflow-logo-dark.png"
FALLBACK_SOURCE = PUBLIC / "dayflow-logo-dark.png"
OUTPUT = "logo-dark.png"
BG_RGB = (21, 22, 21)
# Soft matte: fully transparent inside HARD, fully opaque outside SOFT.
HARD_TOLERANCE = 16
SOFT_TOLERANCE = 52


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def remove_background(
    image: Image.Image,
    bg_rgb: tuple[int, int, int],
    hard_tol: float,
    soft_tol: float,
) -> Image.Image:
    """Cut out the dark plate with a soft alpha edge (keeps anti-aliasing)."""
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    span = max(soft_tol - hard_tol, 1.0)

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            dist = color_distance((r, g, b), bg_rgb)
            if dist <= hard_tol:
                pixels[x, y] = (r, g, b, 0)
                continue
            if dist >= soft_tol:
                # Decontaminate mild bg bleed on near-opaque ink.
                continue

            t = (dist - hard_tol) / span
            new_a = int(round(a * t))
            if new_a < 1:
                pixels[x, y] = (0, 0, 0, 0)
                continue

            # Pull fringe color away from the background toward pure ink.
            pull = 1.0 - t
            nr = max(0, min(255, int(round(r + (r - bg_rgb[0]) * pull * 0.85))))
            ng = max(0, min(255, int(round(g + (g - bg_rgb[1]) * pull * 0.85))))
            nb = max(0, min(255, int(round(b + (b - bg_rgb[2]) * pull * 0.85))))
            pixels[x, y] = (nr, ng, nb, new_a)

    # Tiny alpha blur restores continuous coverage after matte.
    r_ch, g_ch, b_ch, a_ch = rgba.split()
    a_ch = a_ch.filter(ImageFilter.GaussianBlur(radius=0.45))
    return Image.merge("RGBA", (r_ch, g_ch, b_ch, a_ch))


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


def main() -> None:
    source_path = MASTER if MASTER.exists() else FALLBACK_SOURCE
    if not source_path.exists():
        raise SystemExit(f"Missing logo master at {MASTER} or {FALLBACK_SOURCE}")

    output_path = PUBLIC / OUTPUT
    image = Image.open(source_path)
    transparent = remove_background(image, BG_RGB, HARD_TOLERANCE, SOFT_TOLERANCE)
    cropped = crop_to_content(transparent)
    cropped.save(output_path, format="PNG", optimize=True)

    print(
        f"{OUTPUT}: {cropped.width}x{cropped.height} "
        f"(from {image.width}x{image.height}, aspect {cropped.width / cropped.height:.2f})"
    )


if __name__ == "__main__":
    main()
