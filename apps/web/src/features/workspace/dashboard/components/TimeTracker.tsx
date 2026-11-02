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
    <DashboardPanel className="tone-primary px-5 pt-5 pb-6">
      <h3 className="pl-1 text-2xl leading-none font-bold">Time Tracker</h3>
      <p className="tabular mt-6 text-center font-heading text-5xl leading-none font-bold tracking-[0.04em] text-foreground sm:text-[3.5rem]">
        {formatElapsed(elapsedMs)}
      </p>

      <div className="mt-7 flex items-center justify-center gap-3">
        <Button
          type="button"
          size="icon"
          onClick={handleStartPause}
          aria-label={running ? "Pause stopwatch" : "Start stopwatch"}
          className="size-11 rounded-full"
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
          className="size-11 rounded-full"
        >
          <RotateCcw className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </DashboardPanel>
  );
}
