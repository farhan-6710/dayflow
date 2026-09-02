const fs = require("fs");
const path = require("path");

// Import mapping rules for lib reorganization
const importMappings = [
  // Moved to lib
  { from: "@api/axiosInstance", to: "@lib/axios" },
  { from: "@api/client", to: "@lib/api-client" },
  { from: "@utils/supabase", to: "@lib/supabase" },

  // Moved to services
  { from: "@api/services/reminderService", to: "@services/reminderService" },
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
      console.warn(`✅ Updated: ${filePath}`);
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
      if (!["node_modules", ".git", ".expo", "dist", "build"].includes(file)) {
        walkDirectory(filePath, fileCallback);
      }
    } else if (stat.isFile()) {
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

console.warn("🔄 Updating imports for lib reorganization...\n");

let updatedCount = 0;

walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    updatedCount++;
  }
});

walkDirectory(appDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    updatedCount++;
  }
});

console.warn(`\n✨ Complete! Updated ${updatedCount} files.`);
