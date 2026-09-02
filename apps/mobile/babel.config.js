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
          root: ["./ "],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@types": "./src/types",
            "@stores": "./src/stores",
            "@redux": "./src/redux",
            "@styles": "./src/styles",
            "@api": "./src/api",
            "@config": "./src/config",
            "@notifications": "./src/notifications",
            "@providers": "./src/providers",
            "@lib": "./src/lib",
            "@services": "./src/services",
            "@schemas": "./src/schemas",
            "@assets": "./assets",
            "@app": "./app",
          },
        },
      ],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
