import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import "./index.css";

// Set the theme before first paint so dark users don't get a light flash: the saved choice, else the device's.
let isDark = matchMedia("(prefers-color-scheme: dark)").matches;
try {
  const saved = localStorage.getItem("DF-theme");
  // next-themes stores "system" until the user picks.
  isDark = saved === "dark" || saved === "light" ? saved === "dark" : isDark;
} catch {
  // Storage blocked: follow the device.
}
document.documentElement.classList.add(isDark ? "dark" : "light");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
