const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const brandRoot = path.resolve(workspaceRoot, "shared/brand");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders ?? []), brandRoot];
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules ?? {}),
    "@dayflow/brand": brandRoot,
  },
};

module.exports = withNativeWind(config, {
  input: "./src/styles/global.css",
});
