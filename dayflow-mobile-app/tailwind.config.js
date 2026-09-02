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
        // Light Mode Colors
        background: "#ffffff",
        foreground: "#0a0a0a",
        card: "#fafafa",
        border: "#ebebeb",
        muted: "#eeeeee",
        "muted-foreground": "#717171",
        primary: "#ff7a1a",

        // Dark Mode Colors
        "background-dark": "#070707",
        "foreground-dark": "#eeeeee",
        "card-dark": "#0f0f0f",
        "border-dark": "#222222",
        "muted-dark": "#222222",
        "muted-foreground-dark": "#9e9e9e",
      },
      borderRadius: {
        DEFAULT: "0.6rem",
      },
      spacing: {
        DEFAULT: "0.25rem",
      },
    },
  },
  plugins: [],
};
