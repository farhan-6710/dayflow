module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@dayflow/brand": "../../shared/brand",
            "@notifications": "./src/notifications",
            "@services": "./src/services",
            "@types": "./src/types",
            "@assets": "./assets",
            "@": "./src",
          },
        },
      ],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
