import { useState } from "react";

const STORAGE_KEY = "DF-sidebar-collapsed";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Remembers the desktop sidebar state per browser; falls back to expanded when storage is blocked. */
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(readStored);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // The toggle still works for this visit.
    }
  }

  return { collapsed, toggle };
}
