/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Use class-based dark mode for better control
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel_700Bold"], // Add Cinzel as a Tailwind font-family
      },
      colors: {
        // Light — match web apps/web/src/index.css
        background: "#f6f3ea",
        foreground: "#1c1a17",
        card: "#fffdf8",
        border: "#d2d2d2",
        muted: "#f3efe4",
        "muted-foreground": "#7d7668",
        primary: "#e9bf55",
        "primary-dark": "#e9bf55",
        "primary-foreground": "#17140d",
        accent: "#d9a93a",
        destructive: "#c4553d",

        // Dark — match web .dark
        "background-dark": "#0b0b0b",
        "foreground-dark": "#f3f4f6",
        "card-dark": "#101010",
        "border-dark": "#2c2920",
        "muted-dark": "#292929",
        "muted-foreground-dark": "#a39a85",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      spacing: {
        DEFAULT: "0.25rem",
      },
    },
  },
  plugins: [],
};
