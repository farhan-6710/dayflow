import { useState } from "react";

/** Captures a baseline the moment a dialog or page becomes active, to compute dirty state against. */
export function useOpenSnapshot<T>(open: boolean, current: T): T | null {
  const [wasOpen, setWasOpen] = useState(false);
  const [baseline, setBaseline] = useState<T | null>(null);

  if (open !== wasOpen) {
    setWasOpen(open);
    setBaseline(open ? current : null);
  }

  return baseline;
}
