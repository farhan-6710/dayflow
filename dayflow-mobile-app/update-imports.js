const fs = require("fs");
const path = require("path");

// Import mapping rules
const importMappings = [
  // Features to root mappings
  { from: "@features/reminders/components", to: "@components" },
  { from: "@features/auth/components", to: "@components" },
  { from: "@features/reminders/hooks", to: "@hooks" },
  { from: "@features/auth/hooks", to: "@hooks" },
  { from: "@features/reminders/utils", to: "@utils" },
  { from: "@features/auth/utils", to: "@utils" },
  { from: "@features/notifications", to: "@notifications" },

  // Shared to root mappings
  { from: "@shared/components", to: "@components" },
  { from: "@shared/hooks", to: "@hooks" },
  { from: "@shared/utils", to: "@utils" },
  { from: "@shared/constants", to: "@constants" },
  { from: "@shared/types", to: "@types" },
  { from: "@shared/styles", to: "@styles" },

  // Core to root mappings
  { from: "@core/store", to: "@stores" },
  { from: "@core/api", to: "@api" },
  { from: "@core/config", to: "@config" },
  { from: "@core/errors", to: "@api/errors" },
];

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    importMappings.forEach(({ from, to }) => {
      const regex = new RegExp(
        from.replace(/\//g, "\\/").replace(/\*/g, "\\*"),
        "g"
      );
      if (content.match(regex)) {
        content = content.replace(regex, to);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, fileCallback) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (!["node_modules", ".git", ".expo", "dist", "build"].includes(file)) {
        walkDirectory(filePath, fileCallback);
      }
    } else if (stat.isFile()) {
      // Process TypeScript and JavaScript files
      if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        fileCallback(filePath);
      }
    }
  });
}

// Main execution
const projectRoot = __dirname;
const srcDir = path.join(projectRoot, "src");
const appDir = path.join(projectRoot, "app");

console.log("🔄 Starting import updates...\n");

let updatedCount = 0;

// Update imports in src directory
console.log("📁 Updating src directory...");
walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    updatedCount++;
  }
});

// Update imports in app directory
console.log("\n📁 Updating app directory...");
walkDirectory(appDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\n✨ Complete! Updated ${updatedCount} files.`);
