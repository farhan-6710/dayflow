#!/usr/bin/env python3
"""Build logo-light.png from logo-dark.png with light-theme colors."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "public"

SOURCE_PAPER = (237, 237, 237)
SOURCE_CYAN = (0, 169, 203)
SOURCE_ORANGE = (246, 96, 19)
SOURCE_HAIRLINE = (47, 47, 47)

TARGET_INK = (26, 45, 48)
TARGET_CYAN = (0, 144, 160)
TARGET_ORANGE = (226, 87, 31)
TARGET_HAIRLINE = (107, 101, 89)

SOURCE_COLORS = {
    "paper": SOURCE_PAPER,
    "cyan": SOURCE_CYAN,
    "orange": SOURCE_ORANGE,
    "hairline": SOURCE_HAIRLINE,
}

TARGET_COLORS = {
    "paper": TARGET_INK,
    "cyan": TARGET_CYAN,
    "orange": TARGET_ORANGE,
    "hairline": TARGET_HAIRLINE,
}


def luminance(r: int, g: int, b: int) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


PAPER_LUMINANCE = luminance(*SOURCE_PAPER)


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
    return tuple(int(target[i] * t) for i in range(3))


def remap_pixel(r: int, g: int, b: int, a: int) -> tuple[int, int, int, int]:
    if a < 8:
        return (0, 0, 0, 0)

    if max(r, g, b) < 12:
        return (0, 0, 0, 0)

    region = nearest_region(r, g, b)
    source = SOURCE_COLORS[region]
    target = TARGET_COLORS[region]

    if region == "paper":
        t = max(0.0, min(1.0, luminance(r, g, b) / PAPER_LUMINANCE))
        mapped = tuple(int(target[i] * t) for i in range(3))
    else:
        mapped = scale_to_target(r, g, b, source, target)

    return (*mapped, a)


def generate_logo_light() -> None:
    source_path = PUBLIC / "logo-dark.png"
    output_path = PUBLIC / "logo-light.png"

    image = Image.open(source_path).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            pixels[x, y] = remap_pixel(*pixels[x, y])

    image.save(output_path, format="PNG", optimize=True)
    print(
        f"logo-light.png: {width}x{height} "
        f"(generated from logo-dark.png, aspect {width / height:.2f})"
    )


if __name__ == "__main__":
    generate_logo_light()
