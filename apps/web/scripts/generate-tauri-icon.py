#!/usr/bin/env python3
"""Build the DayFlow desktop (Tauri) icons from the brand logo mark.

The light logo on a cream rounded tile, moved right by 10% of its width. Small sizes are drawn on the
pixel grid (see brand_icon.py), so they stay sharp, and the .ico and .icns files are written directly.
Writes the six files the desktop app uses into src-tauri/icons/.

The mobile icons use the same placement: apps/mobile/scripts/generate-brand-assets.py.
Needs Pillow. Run from anywhere: python3 apps/web/scripts/generate-tauri-icon.py
"""

from brand_icon import WEB, render_tile, write_icns, write_ico

ICONS = WEB / "src-tauri" / "icons"

SIZES = [16, 32, 48, 64, 128, 256, 512, 1024]
ICO_SIZES = [16, 32, 48, 64, 128, 256]


def main() -> None:
    images = {size: render_tile(size) for size in SIZES}

    ICONS.mkdir(exist_ok=True)
    for old in ICONS.iterdir():
        old.unlink()
    images[32].save(ICONS / "32x32.png")
    images[128].save(ICONS / "128x128.png")
    images[256].save(ICONS / "128x128@2x.png")
    images[512].save(ICONS / "icon.png")
    write_ico({size: images[size] for size in ICO_SIZES}, ICONS / "icon.ico")
    write_icns(images, ICONS / "icon.icns")
    print(f"Wrote the desktop icons to {ICONS}")


if __name__ == "__main__":
    main()
