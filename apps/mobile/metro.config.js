const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const brandRoot = path.resolve(projectRoot, "../../shared/brand");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders ?? []), brandRoot];

module.exports = withNativeWind(config, {
  input: "./src/theme/global.css",
  inlineRem: 16,
});
