import { m } from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChartColumn,
  Clock,
  Folder,
  ListChecks,
  MessagesSquare,
  NotebookPen,
  Sparkles,
  Users,
} from "lucide-react";

import type { FloatingIconItem, FloatingIconName } from "@/features/site/types/components";
import { cn } from "@/shared/lib/utils";

const ICONS: Record<FloatingIconName, typeof Bell> = {
  calendar: CalendarDays,
  clock: Clock,
  folder: Folder,
  notebook: NotebookPen,
  bell: Bell,
  users: Users,
  list: ListChecks,
  messages: MessagesSquare,
  chart: ChartColumn,
  sparkles: Sparkles,
};

/** Slow drift and tilt behind a section, desktop only. */
export function FloatingIcons({ items }: { items: FloatingIconItem[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        return (
          <m.div
            key={`${item.icon}-${index}`}
            className={cn("absolute text-foreground opacity-[0.12]", item.className)}
            animate={{ y: [0, -14, 0], x: [0, 6, 0], rotate: [item.rotate - 2, item.rotate + 2.5, item.rotate - 2] }}
            transition={{ duration: 8.5 + index * 0.5, delay: item.delay ?? 0, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon strokeWidth={1.2} className="h-auto w-full" />
          </m.div>
        );
      })}
    </div>
  );
}
