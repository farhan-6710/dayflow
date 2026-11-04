const { light } = require("../../shared/brand/theme.json");

/** Every colour is a CSS variable set by ThemeProvider from shared/brand/theme.ts, so light and dark share one class. */
const colors = Object.fromEntries(Object.keys(light.colors).map((name) => [name, `var(--${name})`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["Ovo_400Regular"],
        heading: ["YoungSerif_400Regular"],
        serif: ["Merriweather_400Regular"],
        "serif-bold": ["Merriweather_700Bold"],
      },
    },
  },
  plugins: [],
};
