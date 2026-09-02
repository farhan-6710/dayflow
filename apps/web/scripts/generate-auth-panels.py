#!/usr/bin/env python3
"""Generate auth split-screen brand panels (admin + client, light + dark)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

PUBLIC = Path(__file__).resolve().parent.parent / "public"
WIDTH = 960
HEIGHT = 1280

THEMES = {
    "light": {
        "bg_top": (247, 250, 250),
        "bg_mid": (232, 242, 244),
        "bg_bottom": (216, 228, 231),
        "mesh_primary": (2, 133, 149),
        "mesh_accent": (226, 87, 31),
        "mesh_soft": (180, 215, 220),
        "grid_dot": (2, 133, 149, 22),
        "card_fill": (255, 255, 255, 215),
        "card_fill_alt": (248, 252, 252, 190),
        "card_border": (2, 133, 149, 42),
        "card_shadow": (26, 45, 48, 30),
        "text_strong": (26, 45, 48),
        "text_muted": (92, 108, 114),
        "text_faint": (130, 145, 150),
        "primary": (2, 133, 149),
        "accent": (226, 87, 31),
        "bar_track": (228, 236, 238),
        "bar_fill": (2, 133, 149),
        "badge_bg": (2, 133, 149, 34),
        "badge_text": (2, 101, 114),
        "logo": "logo-light.png",
        "logo_icon": "logo-light-icon.png",
    },
    "dark": {
        "bg_top": (22, 24, 26),
        "bg_mid": (16, 18, 20),
        "bg_bottom": (10, 11, 12),
        "mesh_primary": (0, 182, 207),
        "mesh_accent": (226, 87, 31),
        "mesh_soft": (40, 90, 100),
        "grid_dot": (0, 182, 207, 20),
        "card_fill": (32, 36, 38, 220),
        "card_fill_alt": (40, 44, 46, 200),
        "card_border": (0, 182, 207, 48),
        "card_shadow": (0, 0, 0, 90),
        "text_strong": (242, 245, 245),
        "text_muted": (170, 178, 182),
        "text_faint": (120, 128, 132),
        "primary": (0, 182, 207),
        "accent": (226, 87, 31),
        "bar_track": (52, 58, 62),
        "bar_fill": (0, 182, 207),
        "badge_bg": (0, 182, 207, 42),
        "badge_text": (180, 240, 248),
        "logo": "logo-dark.png",
        "logo_icon": "logo-dark-icon.png",
    },
}

PORTALS = {
    "admin": {
        "label": "Admin Portal",
        "headline": "Run your studio\nwith clarity.",
        "subline": "Tasks, projects, clients, and reminders — orchestrated in one workspace.",
        "features": ["Task boards", "Client CRM", "Analytics"],
    },
    "client": {
        "label": "Client Portal",
        "headline": "Your projects,\nalways in sync.",
        "subline": "Track progress, review updates, and stay aligned with your team.",
        "features": ["Live updates", "Project hub", "Activity feed"],
    },
}


def lerp_color(a: tuple[int, ...], b: tuple[int, ...], t: float) -> tuple[int, ...]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def load_sans(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return load_font(size, bold)


def mesh_gradient(size: tuple[int, int], theme: dict) -> Image.Image:
    base = Image.new("RGB", size, theme["bg_bottom"])
    draw = ImageDraw.Draw(base)
    height = size[1]
    for y in range(height):
        t = y / max(height - 1, 1)
        if t < 0.55:
            local = t / 0.55
            color = lerp_color(theme["bg_top"], theme["bg_mid"], local)
        else:
            local = (t - 0.55) / 0.45
            color = lerp_color(theme["bg_mid"], theme["bg_bottom"], local)
        draw.line([(0, y), (size[0], y)], fill=color)
    return base


def add_orb(
    base: Image.Image,
    center: tuple[float, float],
    radius: int,
    color: tuple[int, int, int],
    alpha: int,
) -> Image.Image:
    rgba = base.convert("RGBA")
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    cx = int(base.width * center[0])
    cy = int(base.height * center[1])
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(*color, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(radius // 2))
    return Image.alpha_composite(rgba, glow)


def add_dot_grid(base: Image.Image, theme: dict, spacing: int = 28) -> Image.Image:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    dot_r = 1
    for y in range(0, base.height, spacing):
        for x in range(0, base.width, spacing):
            draw.ellipse([x - dot_r, y - dot_r, x + dot_r, y + dot_r], fill=theme["grid_dot"])
    return Image.alpha_composite(base.convert("RGBA"), overlay)


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int, int] | None = None,
    outline: tuple[int, int, int, int] | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_glass_card(
    base: Image.Image,
    box: tuple[int, int, int, int],
    theme: dict,
    radius: int = 24,
    fill_key: str = "card_fill",
) -> None:
    x1, y1, x2, y2 = box
    pad = 14
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        [x1 + 4, y1 + 10, x2 + 4, y2 + 10],
        radius=radius,
        fill=theme["card_shadow"],
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    base.alpha_composite(shadow)

    card = Image.new("RGBA", base.size, (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card)
    rounded_rect(card_draw, box, radius, fill=theme[fill_key], outline=theme["card_border"], width=1)
    base.alpha_composite(card)


def paste_image(
    base: Image.Image,
    path: Path,
    xy: tuple[int, int],
    max_width: int | None = None,
    max_height: int | None = None,
) -> tuple[int, int, int, int]:
    img = Image.open(path).convert("RGBA")
    if max_width is not None:
        scale = max_width / img.width
        img = img.resize((max_width, int(img.height * scale)), Image.Resampling.LANCZOS)
    if max_height is not None and img.height > max_height:
        scale = max_height / img.height
        img = img.resize((int(img.width * scale), max_height), Image.Resampling.LANCZOS)
    base.alpha_composite(img, xy)
    return (xy[0], xy[1], xy[0] + img.width, xy[1] + img.height)


def draw_text_bar(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    height: int,
    color: tuple[int, int, int],
) -> None:
    draw.rounded_rectangle([x, y, x + width, y + height], radius=height // 2, fill=color)


def draw_admin_mock_ui(base: Image.Image, theme: dict) -> None:
    draw = ImageDraw.Draw(base)

    # Tasks card
    draw_glass_card(base, (72, 200, 520, 430), theme)
    draw = ImageDraw.Draw(base)
    draw.text((104, 228), "Today's tasks", font=load_sans(22, bold=True), fill=theme["text_strong"])
    draw.text((104, 258), "4 due · 2 in progress", font=load_sans(16), fill=theme["text_muted"])

    task_rows = [
        (theme["primary"], 0.78),
        (theme["accent"], 0.55),
        (theme["primary"], 0.62),
        (theme["bar_track"][:3], 0.48),
    ]
    row_y = 296
    for color, width_ratio in task_rows:
        draw.ellipse([104, row_y + 4, 124, row_y + 24], outline=theme["card_border"][:3], width=2)
        if color != theme["bar_track"][:3]:
            draw.ellipse([108, row_y + 8, 120, row_y + 20], fill=color)
        draw_text_bar(draw, 140, row_y + 8, int(320 * width_ratio), 14, theme["bar_track"][:3])
        row_y += 42

    # Stats card
    draw_glass_card(base, (420, 470, 860, 620), theme, fill_key="card_fill_alt")
    draw = ImageDraw.Draw(base)
    draw.text((452, 498), "This week", font=load_sans(20, bold=True), fill=theme["text_strong"])
    stats = [("12", "Tasks"), ("5", "Projects"), ("98%", "On track")]
    stat_x = 452
    for value, label in stats:
        draw.text((stat_x, 548), value, font=load_sans(34, bold=True), fill=theme["primary"])
        draw.text((stat_x, 592), label, font=load_sans(15), fill=theme["text_muted"])
        stat_x += 128

    # Chart card
    draw_glass_card(base, (120, 660, 780, 860), theme)
    draw = ImageDraw.Draw(base)
    draw.text((152, 688), "Completion trend", font=load_sans(20, bold=True), fill=theme["text_strong"])
    chart_left, chart_bottom = 152, 820
    bar_width, gap = 44, 18
    heights = [0.35, 0.52, 0.48, 0.72, 0.66, 0.88, 0.78]
    for index, ratio in enumerate(heights):
        x = chart_left + index * (bar_width + gap)
        bar_h = int(110 * ratio)
        y = chart_bottom - bar_h
        color = theme["accent"] if index == len(heights) - 1 else theme["bar_fill"]
        draw.rounded_rectangle([x, y, x + bar_width, chart_bottom], radius=10, fill=color)


def draw_client_mock_ui(base: Image.Image, theme: dict) -> None:
    draw = ImageDraw.Draw(base)

    # Project card
    draw_glass_card(base, (88, 210, 560, 420), theme)
    draw = ImageDraw.Draw(base)
    draw.text((120, 238), "Website redesign", font=load_sans(22, bold=True), fill=theme["text_strong"])
    draw.text((120, 268), "Phase 2 · In progress", font=load_sans(16), fill=theme["text_muted"])
    track_x, track_y, track_w = 120, 312, 380
    draw.rounded_rectangle([track_x, track_y, track_x + track_w, track_y + 12], radius=6, fill=theme["bar_track"][:3])
    progress_w = int(track_w * 0.68)
    draw.rounded_rectangle(
        [track_x, track_y, track_x + progress_w, track_y + 12],
        radius=6,
        fill=theme["bar_fill"],
    )
    draw.text((120, 346), "68% complete", font=load_sans(15, bold=True), fill=theme["primary"])

    milestones = ["Discovery", "Design", "Build", "Launch"]
    mx = 120
    for idx, label in enumerate(milestones):
        dot_color = theme["primary"] if idx < 3 else theme["bar_track"][:3]
        draw.ellipse([mx, 382, mx + 14, 396], fill=dot_color)
        draw.text((mx - 4, 404), label[:3], font=load_sans(11), fill=theme["text_faint"])
        mx += 92

    # Activity card
    draw_glass_card(base, (380, 450, 880, 680), theme, fill_key="card_fill_alt")
    draw = ImageDraw.Draw(base)
    draw.text((412, 478), "Recent activity", font=load_sans(20, bold=True), fill=theme["text_strong"])

    activities = [
        (theme["primary"], "Design mockups approved", "2h ago"),
        (theme["accent"], "New comment on homepage", "5h ago"),
        (theme["primary"], "Milestone marked complete", "Yesterday"),
    ]
    ay = 520
    for dot_color, title, time_label in activities:
        draw.ellipse([412, ay + 4, 428, ay + 20], fill=dot_color)
        draw.text((444, ay), title, font=load_sans(15), fill=theme["text_strong"])
        draw.text((444, ay + 22), time_label, font=load_sans(13), fill=theme["text_muted"])
        ay += 56

    # Status pills card
    draw_glass_card(base, (140, 720, 820, 850), theme)
    draw = ImageDraw.Draw(base)
    draw.text((172, 748), "Project health", font=load_sans(20, bold=True), fill=theme["text_strong"])
    pills = [("On schedule", theme["primary"]), ("3 updates", theme["accent"]), ("2 open items", theme["text_faint"])]
    px = 172
    for label, color in pills:
        font = load_sans(14, bold=True)
        bbox = draw.textbbox((0, 0), label, font=font)
        text_w = bbox[2] - bbox[0]
        pad_x = 16
        pill_w = text_w + pad_x * 2
        pill_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
        pill_draw = ImageDraw.Draw(pill_layer)
        pill_draw.rounded_rectangle([px, 796, px + pill_w, 836], radius=999, fill=(*color[:3], 38))
        base.alpha_composite(pill_layer)
        draw = ImageDraw.Draw(base)
        draw.text((px + pad_x, 806), label, font=font, fill=color[:3])
        px += pill_w + 14


def draw_header_brand(base: Image.Image, theme: dict, portal_label: str) -> None:
    paste_image(base, PUBLIC / theme["logo"], (56, 52), max_width=240)
    draw = ImageDraw.Draw(base)
    font = load_sans(14, bold=True)
    bbox = draw.textbbox((0, 0), portal_label.upper(), font=font)
    text_w = bbox[2] - bbox[0]
    pad_x, pad_y = 14, 7
    badge_x, badge_y = 56, 118
    badge_w = text_w + pad_x * 2
    badge_h = (bbox[3] - bbox[1]) + pad_y * 2
    badge = Image.new("RGBA", base.size, (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badge)
    badge_draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=999,
        fill=theme["badge_bg"],
    )
    base.alpha_composite(badge)
    draw = ImageDraw.Draw(base)
    draw.text((badge_x + pad_x, badge_y + pad_y - 1), portal_label.upper(), font=font, fill=theme["badge_text"])


def draw_footer_copy(base: Image.Image, theme: dict, portal_cfg: dict) -> None:
    draw = ImageDraw.Draw(base)
    headline_font = load_font(52, bold=True)
    subline_font = load_sans(20)
    feature_font = load_sans(14, bold=True)

    headline_y = 930
    for line in portal_cfg["headline"].split("\n"):
        draw.text((56, headline_y), line, font=headline_font, fill=theme["text_strong"])
        headline_y += 58

    subline = portal_cfg["subline"]
    draw.text((56, headline_y + 8), subline, font=subline_font, fill=theme["text_muted"])

    pill_y = headline_y + 52
    px = 56
    for feature in portal_cfg["features"]:
        bbox = draw.textbbox((0, 0), feature, font=feature_font)
        text_w = bbox[2] - bbox[0]
        pad_x = 16
        pill_w = text_w + pad_x * 2
        pill = Image.new("RGBA", base.size, (0, 0, 0, 0))
        pill_draw = ImageDraw.Draw(pill)
        pill_draw.rounded_rectangle([px, pill_y, px + pill_w, pill_y + 36], radius=999, fill=(*theme["primary"][:3], 30))
        base.alpha_composite(pill)
        draw = ImageDraw.Draw(base)
        draw.text((px + pad_x, pill_y + 9), feature, font=feature_font, fill=theme["primary"][:3])
        px += pill_w + 12


def draw_accent_line(base: Image.Image, theme: dict) -> None:
    line = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(line)
    draw.rounded_rectangle([0, 900, 8, HEIGHT], radius=4, fill=(*theme["accent"][:3], 200))
    base.alpha_composite(line)


def generate_panel(portal: str, theme_name: str) -> None:
    theme = THEMES[theme_name]
    portal_cfg = PORTALS[portal]

    canvas = mesh_gradient((WIDTH, HEIGHT), theme)
    canvas = add_orb(canvas, (0.08, 0.12), 320, theme["mesh_primary"], 55)
    canvas = add_orb(canvas, (0.92, 0.18), 260, theme["mesh_accent"], 45)
    canvas = add_orb(canvas, (0.55, 0.55), 360, theme["mesh_soft"], 38)
    canvas = add_dot_grid(canvas, theme)

    draw_accent_line(canvas, theme)
    draw_header_brand(canvas, theme, portal_cfg["label"])

    if portal == "admin":
        draw_admin_mock_ui(canvas, theme)
    else:
        draw_client_mock_ui(canvas, theme)

    draw_footer_copy(canvas, theme, portal_cfg)

    output = PUBLIC / f"auth-panel-{portal}-{theme_name}.png"
    canvas.convert("RGB").save(output, format="PNG", optimize=True)
    print(f"Wrote {output.name} ({WIDTH}x{HEIGHT})")


def main() -> None:
    for portal in PORTALS:
        for theme_name in THEMES:
            generate_panel(portal, theme_name)


if __name__ == "__main__":
    main()
