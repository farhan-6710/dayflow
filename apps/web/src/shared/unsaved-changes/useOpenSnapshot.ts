import { useEffect, useRef, useState } from "react";

/**
 * Captures a baseline value the moment a dialog/page becomes active (`open` true).
 * Used to compute dirty state without resetting while the user edits.
 */
export function useOpenSnapshot<T>(open: boolean, current: T): T | null {
  const [baseline, setBaseline] = useState<T | null>(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  useEffect(() => {
    if (!open) {
      setBaseline(null);
      return;
    }
    setBaseline(currentRef.current);
  }, [open]);

  return baseline;
}
