import { useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";

import type { ShellNavItem } from "@/shared/types/components";

export function useShellNavSearch(nav: ShellNavItem[]) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const needle = query.trim().toLowerCase();
  const results = useMemo(
    () => nav.filter((item) => item.label.toLowerCase().includes(needle)),
    [nav, needle],
  );
  const open = focused && needle.length > 0;

  function close() {
    setFocused(false);
    setQuery("");
    setActiveIndex(0);
  }

  function go(item: ShellNavItem) {
    close();
    void navigate(item.to);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      close();
    } else if (open && results.length > 0) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((activeIndex + step + results.length) % results.length);
      } else if (event.key === "Enter") {
        const item = results[activeIndex];
        if (item) {
          go(item);
        }
      }
    }
  }

  function onQueryChange(next: string) {
    setQuery(next);
    setFocused(true);
    setActiveIndex(0);
  }

  return { query, results, open, activeIndex, setFocused, close, go, onKeyDown, onQueryChange };
}
