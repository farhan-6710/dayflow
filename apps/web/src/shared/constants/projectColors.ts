/**
 * Stored per project in `color_hex`: the one place hex values belong (see DESIGN.md).
 * The stored hex is only a key. It renders as the nearest theme token (`--project-*` in theme.json),
 * so shades follow light and dark mode and older saved colours match too, with no database change.
 */
export const PROJECT_COLOR_PRESETS = [
  "#ff7e21",
  "#e25505",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
] as const;

export const DEFAULT_PROJECT_COLOR = PROJECT_COLOR_PRESETS[0];

const PRESET_TOKENS: Record<(typeof PROJECT_COLOR_PRESETS)[number], string> = {
  "#ff7e21": "var(--project-tangerine)",
  "#e25505": "var(--project-rust)",
  "#3b82f6": "var(--project-blue)",
  "#10b981": "var(--project-emerald)",
  "#8b5cf6": "var(--project-violet)",
  "#ec4899": "var(--project-rose)",
  "#f59e0b": "var(--project-amber)",
};

const NEUTRAL_TOKEN = "var(--project-slate)";
/** Below this HSL saturation a colour reads as grey, so it takes the neutral shade. */
const NEUTRAL_SATURATION = 0.28;
/** How much a lightness gap counts against a hue gap (in degrees) when matching presets. */
const LIGHTNESS_WEIGHT = 120;
const HEX_PATTERN = /^#([0-9a-f]{6})$/;

type Hsl = { hue: number; saturation: number; lightness: number };

function hexToHsl(hex: string): Hsl | null {
  const match = HEX_PATTERN.exec(hex);
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { hue: 0, saturation: 0, lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const sector = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return { hue: (sector * 60 + 360) % 360, saturation, lightness };
}

function colorDistance(a: Hsl, b: Hsl): number {
  const hueGap = Math.min(Math.abs(a.hue - b.hue), 360 - Math.abs(a.hue - b.hue));
  return hueGap + Math.abs(a.lightness - b.lightness) * LIGHTNESS_WEIGHT;
}

function nearestToken(color: Hsl): string {
  if (color.saturation < NEUTRAL_SATURATION) return NEUTRAL_TOKEN;
  const ranked = PROJECT_COLOR_PRESETS.map((preset) => ({
    token: PRESET_TOKENS[preset],
    distance: colorDistance(color, hexToHsl(preset) as Hsl),
  })).sort((a, b) => a.distance - b.distance);
  return ranked[0].token;
}

/** The theme colour for a stored `color_hex`. A value that is not a 6-digit hex renders as stored. */
export function resolveProjectColor(colorHex: string | null | undefined): string {
  const stored = colorHex?.trim().toLowerCase() || DEFAULT_PROJECT_COLOR;
  if (stored in PRESET_TOKENS) return PRESET_TOKENS[stored as keyof typeof PRESET_TOKENS];
  const hsl = hexToHsl(stored);
  return hsl ? nearestToken(hsl) : stored;
}
