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
        background: "#f4f7f7",
        foreground: "#1a2e31",
        card: "#ffffff",
        border: "#dce4e5",
        muted: "#eef2f2",
        "muted-foreground": "#5c6f72",
        primary: "#028595",
        "primary-dark": "#00b6cf",
        accent: "#e25505",
        destructive: "#c94141",

        "background-dark": "#121212",
        "foreground-dark": "#f2f2f2",
        "card-dark": "#0e0e0e",
        "border-dark": "#3d3d3d",
        "muted-dark": "#2a2a2a",
        "muted-foreground-dark": "#a6a6a6",
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
