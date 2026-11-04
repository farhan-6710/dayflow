import { ChevronLeft, ChevronRight } from "lucide-react";

import { CALENDAR_VIEWS } from "@/features/workspace/tasks/constants/calendar";
import type { TasksCalendarToolbarProps } from "@/features/workspace/tasks/types/components";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

/** Title on its own row on phones, with the arrows and view tabs sharing the row below. */
export function TasksCalendarToolbar({ title, view, onViewChange, onPrevious, onNext, onToday }: TasksCalendarToolbarProps) {
  return (
    <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-x-2 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <div className="col-start-1 row-start-2 flex items-center gap-1 sm:row-start-1">
        <Button variant="outline" size="icon" aria-label="Previous" onClick={onPrevious}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Next" onClick={onNext}>
          <ChevronRight aria-hidden="true" />
        </Button>
        {onToday ? (
          <Button variant="outline" className="ml-1 hidden min-[400px]:inline-flex" onClick={onToday}>
            Today
          </Button>
        ) : null}
      </div>
      <h2 aria-live="polite" className="col-span-2 truncate text-center text-xl sm:col-span-1 sm:col-start-2 sm:text-2xl">
        {title}
      </h2>
      <Tabs
        value={view}
        onValueChange={(next) => onViewChange(next as typeof view)}
        className="col-start-2 row-start-2 min-w-0 justify-self-end gap-0 sm:col-start-3 sm:row-start-1"
      >
        <TabsList aria-label="Calendar view" variant="solid" size="default">
          {CALENDAR_VIEWS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
