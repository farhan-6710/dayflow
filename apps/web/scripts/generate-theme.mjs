#!/usr/bin/env node
// Generates shared/brand/theme.css and theme.ts from shared/brand/theme.json.
// Usage: bun run theme:generate   (write)
//        node scripts/generate-theme.mjs --check  (exit 1 if outputs are stale)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BRAND = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "shared", "brand");
const SOURCE = join(BRAND, "theme.json");
const OUT_DIR = BRAND;
const CHECK = process.argv.includes("--check");

const theme = JSON.parse(readFileSync(SOURCE, "utf8"));
const { light, dark, shared } = theme;

const declarations = (entries) => Object.entries(entries).map(([name, value]) => `  --${name}: ${value};`);
const shadowEntries = (shadows) =>
  Object.fromEntries(Object.entries(shadows).map(([name, value]) => [name === "DEFAULT" ? "shadow" : `shadow-${name}`, value]));
const colorNames = Object.keys(light.colors);
const shadowNames = Object.keys(shadowEntries(light.shadows));

const css = `/* Generated from shared/brand/theme.json by apps/web/scripts/generate-theme.mjs. Do not edit. */

:root {
${declarations(light.colors).join("\n")}
${declarations(shadowEntries(light.shadows)).join("\n")}
  --font-sans: ${shared.fonts.sans};
  --font-heading: ${shared.fonts.heading};
  --font-serif: ${shared.fonts.serif};
  --font-mono: ${shared.fonts.mono};
  --radius: ${shared.radius};
  --tracking-normal: ${shared.tracking};
  --spacing: ${shared.spacing};
}

.dark {
${declarations(dark.colors).join("\n")}
${declarations(shadowEntries(dark.shadows)).join("\n")}
}

@theme inline {
${colorNames.map((name) => `  --color-${name}: var(--${name});`).join("\n")}

  --font-sans: var(--font-sans);
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

${shadowNames.map((name) => `  --${name}: var(--${name});`).join("\n")}

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}
`;

const { $comment, ...tokens } = theme;
const ts = `// Generated from shared/brand/theme.json by apps/web/scripts/generate-theme.mjs. Do not edit.
// Colours are hex, so React Native and CSS read the same values.

export const themeTokens = ${JSON.stringify(tokens, null, 2)} as const;

export type ThemeMode = "light" | "dark";
`;

const outputs = { "theme.css": css, "theme.ts": ts };
let stale = [];
for (const [file, content] of Object.entries(outputs)) {
  const path = join(OUT_DIR, file);
  if (CHECK) {
    // Git on Windows checks these files out with CRLF, which isn't a real change.
    if (!existsSync(path) || readFileSync(path, "utf8").replaceAll("\r\n", "\n") !== content) stale.push(path);
  } else {
    writeFileSync(path, content);
    console.log(`wrote ${path}`);
  }
}
if (CHECK) {
  if (stale.length) {
    console.error(`Stale theme outputs, run bun run theme:generate: ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log("theme outputs are up to date");
}
