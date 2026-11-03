import { useEffect, useRef, useState } from "react";

/** A plain stopwatch. It keeps correct time even if the browser throttles the tab, as it measures from a start stamp. */
export function useTimeTracker() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAtRef = useRef(0);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) {
      return;
    }
    startedAtRef.current = Date.now();
    const intervalId = window.setInterval(() => {
      setElapsedMs(baseRef.current + Date.now() - startedAtRef.current);
    }, 250);
    return () => {
      baseRef.current += Date.now() - startedAtRef.current;
      window.clearInterval(intervalId);
    };
  }, [running]);

  function reset() {
    setRunning(false);
    baseRef.current = 0;
    setElapsedMs(0);
  }

  return { elapsedMs, running, toggle: () => setRunning(!running), reset };
}
