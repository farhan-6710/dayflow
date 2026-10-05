import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DashboardPanel } from "@/features/workspace/dashboard/components/DashboardPanel";
import { Button } from "@/shared/ui/button";

function formatElapsed(totalMs: number): string {
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((val) => String(val).padStart(2, "0"))
    .join(":");
}

export function TimeTracker() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const baseElapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const intervalId = window.setInterval(() => {
      if (startedAtRef.current == null) return;
      setElapsedMs(baseElapsedRef.current + (Date.now() - startedAtRef.current));
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [running]);

  function handleStartPause() {
    if (running) {
      if (startedAtRef.current != null) {
        baseElapsedRef.current += Date.now() - startedAtRef.current;
      }
      startedAtRef.current = null;
      setElapsedMs(baseElapsedRef.current);
      setRunning(false);
      return;
    }

    startedAtRef.current = Date.now();
    setRunning(true);
  }

  function handleReset() {
    startedAtRef.current = null;
    baseElapsedRef.current = 0;
    setElapsedMs(0);
    setRunning(false);
  }

  return (
    <DashboardPanel className="px-6 py-7">
      <p className="text-sm font-medium text-muted-foreground">Time Tracker</p>
      <p className="mt-6 text-center font-mono text-4xl font-semibold tracking-[0.08em] tabular-nums text-foreground sm:text-5xl">
        {formatElapsed(elapsedMs)}
      </p>

      <div className="mt-7 flex items-center justify-center gap-3">
        <Button
          type="button"
          size="icon"
          onClick={handleStartPause}
          aria-label={running ? "Pause stopwatch" : "Start stopwatch"}
          className="size-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {running ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current ml-0.5" />
          )}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={handleReset}
          aria-label="Reset stopwatch"
          className="size-11 rounded-full border-border/80 bg-background/50 hover:bg-muted"
        >
          <RotateCcw className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </DashboardPanel>
  );
}
