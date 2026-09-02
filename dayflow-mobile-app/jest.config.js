module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gorhom/bottom-sheet)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/", "/.expo/"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
    "!**/*.config.js",
    "!**/app.json",
    "!**/eas.json",
    "!**/app/_layout.tsx", // Expo Router entry
    "!**/assets/**",
    "!**/__tests__/**",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx|js)"],
  globals: {
    __DEV__: true,
  },
};
