"""Draws the DayFlow icons, with small sizes redrawn on the pixel grid.

Shrinking artwork to 16 or 32px leaves grey, blurry stems, whatever the resampling. So small sizes are not
shrunk: they are made the way small icons are made by hand.
  * 16 and 32px are pixel maps: every pixel is solid charcoal, solid coral or the tile.
  * 48 and 64px are hinted artwork: stems and serifs land on whole pixels, and only curves get soft pixels.
  * From 128px up there is room for the real artwork, so the logo master is used.
The charcoal and coral parts always keep a clean gap, so they never blur together.

Used by generate-tauri-icon.py and recolor-logos.py (favicons). Needs Pillow.
"""

import io
import json
import struct
from pathlib import Path

from PIL import Image, ImageDraw

WEB = Path(__file__).resolve().parents[1]
BRAND = WEB / "design" / "brand"
PUBLIC = WEB / "public"
THEME = WEB.parents[1] / "shared" / "brand" / "theme.json"

# The mark's heavy "D" sits on the left, so on a tile it is moved right by this share of its own width.
SHIFT = 0.10

# Hinted artwork in pixels on its own grid, placed as it sits in the tile (the shift is already in it).
# Rects (x0, y0, x1, y1) are snapped to whole pixels at every size. Polygons are the diagonals and curves.
ART_32 = {
    "ink_rects": [
        (8, 5, 11, 24),  # D stem
        (7, 5, 15, 6),  # top serif and bar
        (7, 23, 13, 24),  # bottom serif
    ],
    "ink_polys": [
        [(15, 5), (17, 5.1), (19.5, 5.9), (21.6, 7.2), (23.1, 8.9), (24, 10.7), (21.9, 12.2), (20.7, 10), (19.2, 8.2), (17.2, 6.8), (15, 6)],  # D bowl
    ],
    "accent_rects": [
        (14, 14, 16, 27),  # F stem
        (12, 14, 16, 15),  # F top serif
        (12, 26, 18, 27),  # F foot
        (16, 20, 20, 21),  # F bar
    ],
    "accent_polys": [
        [(19.2, 20), (21.2, 18.8), (19.4, 23.2)],  # F bar flourish
        [(17, 14), (19.6, 14), (19.9, 14.4), (29.2, 7), (29.8, 8), (19.3, 17.4)],  # check
        [(25.2, 13.2), (25.6, 15.4), (24.9, 18.2), (21.2, 22), (22.2, 18.4), (22.4, 15.2)],  # D crescent
    ],
}

# Pixel maps: row -> spans of (first x, last x, colour). "i" is charcoal, "a" is coral.
_STEM_16 = [(3, 4, "i")]
PIXELS_16 = {
    2: [(2, 8, "i")],
    3: [*_STEM_16, (8, 10, "i"), (14, 14, "a")],
    4: [*_STEM_16, (10, 11, "i"), (13, 14, "a")],
    5: [*_STEM_16, (12, 13, "a")],
    6: [*_STEM_16, (11, 12, "a")],
    7: [*_STEM_16, (6, 8, "a"), (10, 11, "a"), (13, 13, "a")],
    8: [*_STEM_16, (7, 8, "a"), (10, 10, "a"), (13, 13, "a")],
    9: [*_STEM_16, (7, 8, "a"), (12, 13, "a")],
    10: [*_STEM_16, (7, 10, "a"), (12, 12, "a")],
    11: [(2, 5, "i"), (7, 8, "a"), (11, 11, "a")],
    12: [(7, 8, "a")],
    13: [(6, 9, "a")],
}

_STEM_32 = [(8, 10, "i")]
_F_STEM = [(14, 15, "a")]
PIXELS_32 = {
    5: [(7, 15, "i")],
    6: [*_STEM_32, (15, 18, "i")],
    7: [*_STEM_32, (17, 20, "i"), (28, 29, "a")],
    8: [*_STEM_32, (19, 21, "i"), (27, 28, "a")],
    9: [*_STEM_32, (20, 22, "i"), (26, 28, "a")],
    10: [*_STEM_32, (21, 23, "i"), (25, 27, "a")],
    11: [*_STEM_32, (22, 22, "i"), (24, 26, "a")],
    12: [*_STEM_32, (23, 25, "a")],
    13: [*_STEM_32, (21, 24, "a"), (26, 26, "a")],
    14: [*_STEM_32, (12, 15, "a"), (17, 22, "a"), (25, 26, "a")],
    15: [*_STEM_32, *_F_STEM, (18, 21, "a"), (24, 26, "a")],
    16: [*_STEM_32, *_F_STEM, (18, 20, "a"), (24, 26, "a")],
    17: [*_STEM_32, *_F_STEM, (19, 19, "a"), (24, 25, "a")],
    18: [*_STEM_32, *_F_STEM, (23, 25, "a")],
    19: [*_STEM_32, *_F_STEM, (20, 20, "a"), (23, 24, "a")],
    20: [*_STEM_32, *_F_STEM, (16, 20, "a"), (22, 24, "a")],
    21: [*_STEM_32, *_F_STEM, (19, 20, "a"), (22, 23, "a")],
    22: [*_STEM_32, *_F_STEM, (19, 19, "a"), (21, 22, "a")],
    23: [(7, 12, "i"), *_F_STEM],
    24: _F_STEM,
    25: _F_STEM,
    26: [(12, 17, "a")],
}

# Pixel-map tiles: map, tile inset in pixels.
PIXEL_TILE = {16: (PIXELS_16, 0), 32: (PIXELS_32, 1)}
# Hinted tiles: pixels per grid unit, tile inset in pixels.
HINTED_TILE = {48: (1.5, 2), 64: (2, 2)}
# The grid area the mark uses in ART_32, for favicons.
ART_32_BOUNDS = (7, 5, 30, 27)
FAVICON_SIZES = (16, 32, 48)
SUPERSAMPLE = 16


def hex_rgb(value: str) -> tuple[int, int, int]:
    return tuple(int(value[i : i + 2], 16) for i in (1, 3, 5))


def theme_colors(mode: str) -> dict[str, tuple[int, int, int]]:
    colors = json.loads(THEME.read_text())[mode]["colors"]
    return {"background": hex_rgb(colors["background"]), "ink": hex_rgb(colors["foreground"]), "accent": hex_rgb(colors["chart-1"])}


def _draw_art(canvas: Image.Image, art: dict, scale: float, offset: tuple[float, float], ink, accent) -> None:
    """Rects snap to whole pixels, then the supersampling adds soft pixels only along diagonals and curves."""
    draw = ImageDraw.Draw(canvas)
    ox, oy = offset

    def rect(box, fill):
        x0, y0, x1, y1 = (round((v + o) * scale) for v, o in zip(box, (ox, oy, ox, oy)))
        draw.rectangle(
            (x0 * SUPERSAMPLE, y0 * SUPERSAMPLE, max(x1, x0 + 1) * SUPERSAMPLE - 1, max(y1, y0 + 1) * SUPERSAMPLE - 1), fill=(*fill, 255)
        )

    def poly(points, fill):
        draw.polygon([((x + ox) * scale * SUPERSAMPLE, (y + oy) * scale * SUPERSAMPLE) for x, y in points], fill=(*fill, 255))

    for shape in art["ink_polys"]:
        poly(shape, ink)
    for box in art["ink_rects"]:
        rect(box, ink)
    for shape in art["accent_polys"]:
        poly(shape, accent)
    for box in art["accent_rects"]:
        rect(box, accent)


def _tile_canvas(size: int, inset: int, background) -> Image.Image:
    """The rounded tile, at supersampled size."""
    canvas = Image.new("RGBA", (size * SUPERSAMPLE, size * SUPERSAMPLE), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).rounded_rectangle(
        (inset * SUPERSAMPLE, inset * SUPERSAMPLE, (size - inset) * SUPERSAMPLE - 1, (size - inset) * SUPERSAMPLE - 1),
        radius=(size - 2 * inset) * 0.22 * SUPERSAMPLE,
        fill=(*background, 255),
    )
    return canvas


def _stamp_pixels(image: Image.Image, pixel_map: dict, colors: dict, offset: tuple[int, int] = (0, 0)) -> None:
    """Sets every mapped pixel to a solid colour, with no blending."""
    fills = {"i": (*colors["ink"], 255), "a": (*colors["accent"], 255)}
    pixels = image.load()
    for y, spans in pixel_map.items():
        for first, last, colour in spans:
            for x in range(first, last + 1):
                pixels[x + offset[0], y + offset[1]] = fills[colour]


def _pixel_tile(size: int, colors: dict) -> Image.Image:
    pixel_map, inset = PIXEL_TILE[size]
    image = _tile_canvas(size, inset, colors["background"]).resize((size, size), Image.Resampling.BOX)
    _stamp_pixels(image, pixel_map, colors)
    return image


def _hinted_tile(size: int, colors: dict) -> Image.Image:
    scale, inset = HINTED_TILE[size]
    canvas = _tile_canvas(size, inset, colors["background"])
    _draw_art(canvas, ART_32, scale, (0, 0), colors["ink"], colors["accent"])
    return canvas.resize((size, size), Image.Resampling.BOX)


def _master_tile(size: int, logo: Path, background) -> Image.Image:
    ss = 4 if size <= 256 else 2
    canvas = Image.new("RGBA", (size * ss, size * ss), (0, 0, 0, 0))
    inset = int(size * 0.06)
    ImageDraw.Draw(canvas).rounded_rectangle(
        (inset * ss, inset * ss, (size - inset) * ss - 1, (size - inset) * ss - 1), radius=int(size * 0.2) * ss, fill=(*background, 255)
    )
    mark = Image.open(logo).convert("RGBA")
    mark = mark.crop(mark.getbbox())
    width = int(size * 0.56) * ss
    mark = mark.resize((width, round(mark.height * width / mark.width)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(mark, ((canvas.width - width) // 2 + round(width * SHIFT), (canvas.height - mark.height) // 2))
    return canvas.resize((size, size), Image.Resampling.BOX)


def render_tile(size: int) -> Image.Image:
    """The light mark on its cream tile, drawn for this size."""
    colors = theme_colors("light")
    if size in PIXEL_TILE:
        return _pixel_tile(size, colors)
    if size in HINTED_TILE:
        return _hinted_tile(size, colors)
    return _master_tile(size, BRAND / "logo-light-icon.png", colors["background"])


def render_favicon(size: int, mode: str) -> Image.Image:
    """The mark alone on transparent, centred and filling the canvas, for a browser tab."""
    colors = theme_colors(mode)
    if size == 16:
        image = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
        _stamp_pixels(image, PIXELS_16, colors, offset=(-1, 0))  # the map spans x 2 to 14
        return image
    x0, y0, x1, y1 = ART_32_BOUNDS
    scale = {32: 4 / 3, 48: 2.0}[size]
    ox = round((size / scale - (x1 - x0)) / 2 - x0)
    oy = round((size / scale - (y1 - y0)) / 2 - y0)
    canvas = Image.new("RGBA", (size * SUPERSAMPLE, size * SUPERSAMPLE), (0, 0, 0, 0))
    _draw_art(canvas, ART_32, scale, (ox, oy), colors["ink"], colors["accent"])
    return canvas.resize((size, size), Image.Resampling.BOX)


def _png(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, "PNG", optimize=True)
    return buffer.getvalue()


def write_ico(images: dict[int, Image.Image], path: Path) -> None:
    """A Windows icon with one PNG per size, each drawn for its size (Pillow would resize one image)."""
    blobs = [(size, _png(image)) for size, image in sorted(images.items())]
    offset = 6 + 16 * len(blobs)
    header = struct.pack("<HHH", 0, 1, len(blobs))
    entries, data = b"", b""
    for size, blob in blobs:
        entries += struct.pack("<BBBBHHII", size % 256, size % 256, 0, 0, 1, 32, len(blob), offset + len(data))
        data += blob
    path.write_bytes(header + entries + data)


# Mac icon slots: type, pixel size.
_ICNS_SLOTS = [
    ("icp4", 16), ("icp5", 32), ("icp6", 64), ("ic07", 128), ("ic08", 256), ("ic09", 512), ("ic10", 1024),
    ("ic11", 32), ("ic12", 64), ("ic13", 256), ("ic14", 512),
]


def write_icns(images: dict[int, Image.Image], path: Path) -> None:
    """A macOS icon with every slot filled from the image drawn for that pixel size."""
    body = b""
    for kind, size in _ICNS_SLOTS:
        blob = _png(images[size])
        body += kind.encode() + struct.pack(">I", len(blob) + 8) + blob
    path.write_bytes(b"icns" + struct.pack(">I", len(body) + 8) + body)


def write_favicons() -> None:
    """public/favicon*.ico: the light and dark marks, each size drawn for itself."""
    for name, mode in (("favicon", "light"), ("favicon-light", "light"), ("favicon-dark", "dark")):
        write_ico({size: render_favicon(size, mode) for size in FAVICON_SIZES}, PUBLIC / f"{name}.ico")


if __name__ == "__main__":
    write_favicons()
    print("Wrote public/favicon.ico, favicon-light.ico and favicon-dark.ico")
