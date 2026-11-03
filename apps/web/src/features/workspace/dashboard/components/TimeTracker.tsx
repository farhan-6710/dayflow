import { Pause, Play, RotateCcw } from "lucide-react";

import { useTimeTracker } from "@/features/workspace/dashboard/hooks/useTimeTracker";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function TimeTracker() {
  const { elapsedMs, running, toggle, reset } = useTimeTracker();
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const display = `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor(totalSeconds / 60) % 60)}:${pad(totalSeconds % 60)}`;

  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Time tracker</h2>
      <p className="mt-3 font-mono text-4xl tabular-nums" role="timer" aria-label={`Elapsed time ${display}`}>
        {display}
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="lg" onClick={toggle}>
          {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {running ? "Pause" : elapsedMs > 0 ? "Resume" : "Start"}
        </Button>
        <Button variant="outline" size="lg" disabled={elapsedMs === 0} onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Reset
        </Button>
      </div>
    </section>
  );
}
