#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Color variable mapping from old names to new names
const colorMappings = [
  // Background colors - order matters! Do specific ones first
  { old: /bg-card/g, new: "bg-card" },
  { old: /bg-background/g, new: "bg-background" },
  { old: /bg-card-dark/g, new: "bg-card-dark" },
  { old: /bg-card-dark/g, new: "bg-card-dark" },
  { old: /bg-background-dark/g, new: "bg-background-dark" },

  // Text colors
  { old: /text-foreground/g, new: "text-foreground" },
  { old: /text-foreground-dark/g, new: "text-foreground-dark" },
  { old: /text-foreground/g, new: "text-foreground" },
  { old: /text-foreground-dark/g, new: "text-foreground-dark" },

  // Border colors
  { old: /border-border/g, new: "border-border" },
  { old: /border-border/g, new: "border-border" },
  { old: /border-border-dark/g, new: "border-border-dark" },
  { old: /border-border-dark/g, new: "border-border-dark" },

  // Active colors
  { old: /bg-muted/g, new: "bg-muted" },
  { old: /bg-muted-dark/g, new: "bg-muted-dark" },
  { old: /text-muted-foreground/g, new: "text-muted-foreground" },
  { old: /text-muted-foreground-dark/g, new: "text-muted-foreground-dark" },
];

// Non-Tailwind class mappings (for strings in TypeScript, etc.)
const stringMappings = [
  // Background colors
  { old: /"card"/g, new: '"card"' },
  { old: /'card'/g, new: "'card'" },
  { old: /card/g, new: "card" },

  { old: /"background"/g, new: '"background"' },
  { old: /'background'/g, new: "'background'" },

  { old: /"card-dark"/g, new: '"card-dark"' },
  { old: /'card-dark'/g, new: "'card-dark'" },

  { old: /"card-dark"/g, new: '"card-dark"' },
  { old: /'card-dark'/g, new: "'card-dark'" },

  { old: /"background-dark"/g, new: '"background-dark"' },
  { old: /'background-dark'/g, new: "'background-dark'" },

  // Text colors
  { old: /"foreground"/g, new: '"foreground"' },
  { old: /'foreground'/g, new: "'foreground'" },
  { old: /"foreground-dark"/g, new: '"foreground-dark"' },
  { old: /'foreground-dark'/g, new: "'foreground-dark'" },
  { old: /"foreground"/g, new: '"foreground"' },
  { old: /'foreground'/g, new: "'foreground'" },
  { old: /"foreground-dark"/g, new: '"foreground-dark"' },
  { old: /'foreground-dark'/g, new: "'foreground-dark'" },

  // Border colors
  { old: /"border"/g, new: '"border"' },
  { old: /'border'/g, new: "'border'" },
  { old: /"border"/g, new: '"border"' },
  { old: /'border'/g, new: "'border'" },
  { old: /"border-dark"/g, new: '"border-dark"' },
  { old: /'border-dark'/g, new: "'border-dark'" },
  { old: /"border-dark"/g, new: '"border-dark"' },
  { old: /'border-dark'/g, new: "'border-dark'" },

  // Active colors
  { old: /"muted"/g, new: '"muted"' },
  { old: /'muted'/g, new: "'muted'" },
  { old: /"muted-dark"/g, new: '"muted-dark"' },
  { old: /'muted-dark'/g, new: "'muted-dark'" },
];

function findFilesWithOldColors(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!["node_modules", ".git", "dist", "build"].includes(entry.name)) {
        files.push(...findFilesWithOldColors(fullPath));
      }
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (
        /backgroundLight|backgroundDark|textLight|textDark|headingLight|headingDark|borderLight|borderDark|activeLight|activeDark/.test(
          content
        )
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // Apply Tailwind class mappings
  for (const mapping of colorMappings) {
    if (mapping.old.test(content)) {
      content = content.replace(mapping.old, mapping.new);
      changed = true;
    }
  }

  // Apply non-Tailwind string mappings (but be more careful)
  // Only apply if not already done by Tailwind mappings
  for (const mapping of stringMappings) {
    if (mapping.old.test(content)) {
      content = content.replace(mapping.old, mapping.new);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }

  return false;
}

// Main execution
console.log("🔍 Finding files with old color variables...");
const clientDir = path.join(__dirname);
const files = findFilesWithOldColors(clientDir);

console.log(`📝 Found ${files.length} files to update`);

let updatedCount = 0;
for (const file of files) {
  if (updateFile(file)) {
    updatedCount++;
    console.log(`✅ Updated: ${path.relative(clientDir, file)}`);
  }
}

console.log(`\n✨ Done! Updated ${updatedCount} files`);
