import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import "./index.css";

// Set the saved theme before first paint so dark users don't get a light flash.
try {
  document.documentElement.classList.add(localStorage.getItem("DF-theme") === "dark" ? "dark" : "light");
} catch {
  document.documentElement.classList.add("light");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
