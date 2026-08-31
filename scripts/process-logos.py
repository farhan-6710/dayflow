#!/usr/bin/env python3
"""Remove background from dayflow-logo-dark.png and crop to logo-dark.png."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "public"

SOURCE = "dayflow-logo-dark.png"
OUTPUT = "logo-dark.png"
BG_RGB = (21, 22, 21)
TOLERANCE = 28


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def remove_background(image: Image.Image, bg_rgb: tuple[int, int, int], tolerance: float) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if color_distance((r, g, b), bg_rgb) <= tolerance:
                pixels[x, y] = (r, g, b, 0)

    return rgba


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
    source_path = PUBLIC / SOURCE
    output_path = PUBLIC / OUTPUT

    image = Image.open(source_path)
    transparent = remove_background(image, BG_RGB, TOLERANCE)
    cropped = crop_to_content(transparent)
    cropped.save(output_path, format="PNG", optimize=True)

    print(
        f"{OUTPUT}: {cropped.width}x{cropped.height} "
        f"(from {image.width}x{image.height}, aspect {cropped.width / cropped.height:.2f})"
    )


if __name__ == "__main__":
    main()
