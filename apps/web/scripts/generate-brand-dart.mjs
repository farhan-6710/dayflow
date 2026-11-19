#!/usr/bin/env node
// Generates apps/mobile/lib/core/constants/brand_manifest.dart from shared/brand/brandManifest.json.
// Usage: bun run brand:generate   (write)
//        node scripts/generate-brand-dart.mjs --check  (exit 1 if output is stale)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const SOURCE = join(ROOT, "shared", "brand", "brandManifest.json");
const OUT_FILE = join(ROOT, "apps", "mobile", "lib", "core", "constants", "brand_manifest.dart");
const CHECK = process.argv.includes("--check");

const manifest = JSON.parse(readFileSync(SOURCE, "utf8"));

/** Dart string literal: JSON escaping is valid Dart here; `$` is escaped so Dart does not interpolate it. */
const dartString = (value) => JSON.stringify(value).replaceAll("$", "\\$");

const constants = [
  ["name", manifest.name],
  ["tagline", manifest.tagline],
  ["description", manifest.description],
  ["workspacePortalLabel", manifest.portals.workspace.label],
  ["clientPortalLabel", manifest.portals.client.label],
];

const dart = `// Generated from shared/brand/brandManifest.json by apps/web/scripts/generate-brand-dart.mjs. Do not edit.

/** Brand copy for the Flutter app. Edit shared/brand/brandManifest.json, then run bun run brand:generate. */
abstract final class BrandManifest {
${constants.map(([name, value]) => `  static const ${name} = ${dartString(value)};`).join("\n")}
}
`;

if (CHECK) {
  const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8").replaceAll("\r\n", "\n") : "";
  if (current !== dart) {
    console.error("Stale brand output, run bun run brand:generate");
    process.exit(1);
  }
  console.log("brand output is up to date");
} else {
  writeFileSync(OUT_FILE, dart);
  console.log(`wrote ${OUT_FILE}`);
}
