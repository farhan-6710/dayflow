import type { ReactNode } from "react";

import {
  CLIENTS_DIRECTORY_GRID_CLASS,
  CLIENTS_DIRECTORY_ROW_GRID_CLASS,
} from "@/features/workspace/clients-management/constants/clientsDirectory";
import {
  PROJECTS_DIRECTORY_GRID_CLASS,
  PROJECTS_DIRECTORY_ROW_GRID_CLASS,
} from "@/features/workspace/projects/constants/projectsDirectory";
import { tasksDirectoryConfig } from "@/features/workspace/tasks/constants/tasksDirectory";
import { StatCardSkeleton } from "@/shared/components/StatCardSkeleton";
import {
  DIRECTORY_TABLE_MIN_WIDTH_CLASS,
  TABLE_HORIZONTAL_SCROLL_CLASS,
} from "@/shared/constants/directoryTable";
import {
  containMinWidthClassName,
  glassPanelClassName,
} from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

type DirectoryPageSkeletonProps = {
  rows?: number;
  className?: string;
  /** Header + body column template (matches DirectoryTable `gridClass`). */
  gridClass: string;
  /** Column labels shown in the muted header row. */
  columns: { label: string; align?: "right" }[];
  /** Optional row renderer; defaults to simple text cells matching column count. */
  renderRow?: () => ReactNode;
  showFilters?: boolean;
};

/** Glass directory table shell — header / filters / column row / sized body rows. */
export function DirectoryPageSkeleton({
  rows = 7,
  className,
  gridClass,
  columns,
  renderRow,
  showFilters = true,
}: DirectoryPageSkeletonProps) {
  return (
    <div
      className={cn("w-full min-w-0", glassPanelClassName, className)}
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className={cn("min-w-0", containMinWidthClassName)}>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-1 h-3 w-64 max-w-full" />
        </div>
        {showFilters ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-full rounded-lg sm:w-[220px]" />
            <Skeleton className="h-9 w-full rounded-lg sm:w-40" />
          </div>
        ) : null}
      </div>

      <div
        className={cn(TABLE_HORIZONTAL_SCROLL_CLASS, "border-t border-border")}
      >
        <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
          <div
            className={cn(
              "grid w-full items-center gap-4 bg-muted px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden",
              gridClass,
            )}
          >
            {columns.map((column, index) => (
              <div
                key={`${column.label}-${index}`}
                className={column.align === "right" ? "text-right" : undefined}
              >
                {column.label ? (
                  <Skeleton
                    className={cn(
                      "h-3",
                      column.align === "right" ? "ml-auto w-14" : "w-20",
                    )}
                  />
                ) : (
                  <span className="block size-3" />
                )}
              </div>
            ))}
          </div>

          <div className="[&>*+*]:border-t [&>*+*]:border-border">
            {Array.from({ length: rows }).map((_, index) => (
              <div key={index}>
                {renderRow ? (
                  renderRow()
                ) : (
                  <div
                    className={cn(
                      "grid items-center gap-2 px-6 py-4 sm:gap-4",
                      gridClass,
                    )}
                  >
                    {columns.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className={
                          column.align === "right"
                            ? "flex justify-end"
                            : "min-w-0"
                        }
                      >
                        <Skeleton
                          className={cn(
                            "h-4",
                            column.align === "right" ? "size-8 rounded-lg" : "w-3/4 max-w-40",
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Projects Management — matches ProjectsTableRow (grip + folder + cells). */
export function ProjectsDirectoryPageSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <DirectoryPageSkeleton
      rows={rows}
      gridClass={PROJECTS_DIRECTORY_GRID_CLASS}
      columns={[
        { label: "" },
        { label: "PROJECT NAME" },
        { label: "PROJECT FOR" },
        { label: "STATUS" },
        { label: "ACTIONS", align: "right" },
      ]}
      renderRow={() => (
        <div
          className={cn(
            "grid items-center gap-2 px-6 py-4 sm:gap-4",
            PROJECTS_DIRECTORY_ROW_GRID_CLASS,
          )}
        >
          <div className="flex items-center justify-center">
            <Skeleton className="size-4 rounded-sm" />
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-xl" />
            <Skeleton className="h-4 w-36 max-w-full" />
          </div>
          <Skeleton className="h-4 w-28 max-w-full" />
          <Skeleton className="h-4 w-14" />
          <div className="flex justify-end">
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      )}
    />
  );
}

/** Clients Management — matches ClientsTableRow padding/grid. */
export function ClientsDirectoryPageSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <DirectoryPageSkeleton
      rows={rows}
      gridClass={CLIENTS_DIRECTORY_GRID_CLASS}
      columns={[
        { label: "COMPANY / BRAND" },
        { label: "CLIENT NAME" },
        { label: "MOBILE" },
        { label: "EMAIL" },
        { label: "WEBSITE" },
        { label: "STATUS" },
        { label: "ACTIONS", align: "right" },
      ]}
      renderRow={() => (
        <div
          className={cn(
            "grid items-center gap-2 px-6 py-4 sm:gap-4",
            CLIENTS_DIRECTORY_ROW_GRID_CLASS,
          )}
        >
          <Skeleton className="h-4 w-32 max-w-full" />
          <Skeleton className="h-4 w-24 max-w-full" />
          <Skeleton className="h-4 w-24 max-w-full" />
          <Skeleton className="h-4 w-36 max-w-full" />
          <Skeleton className="h-4 w-28 max-w-full" />
          <Skeleton className="h-4 w-14" />
          <div className="flex justify-end">
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      )}
    />
  );
}

/** Tasks list — matches TaskListItem (title+desc, badges, due, actions). */
export function TasksDirectoryPageSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <DirectoryPageSkeleton
      rows={rows}
      gridClass={tasksDirectoryConfig.gridClass}
      columns={[...tasksDirectoryConfig.columns]}
      renderRow={() => (
        <div
          className={cn(
            "grid w-full items-center gap-4 px-6 py-4",
            tasksDirectoryConfig.gridClass,
          )}
        >
          <div className="min-w-0 space-y-1">
            <Skeleton className="h-4 w-40 max-w-full" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-28 max-w-full" />
          <div className="flex justify-end">
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      )}
    />
  );
}

/** Tasks calendar: mirrors TasksWeeksTable + TasksDayPanel height/structure. */
export function TasksCalendarPageSkeleton() {
  return (
    <div
      className="grid min-w-0 grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(240px,3fr)]"
      aria-busy="true"
      aria-label="Loading calendar"
    >
      {/* TasksWeeksTable shell */}
      <div
        className={cn(
          "flex h-full min-h-[360px] min-w-0 flex-col sm:min-h-[420px]",
          glassPanelClassName,
        )}
      >
        <div className="px-2 pt-3 sm:px-5 sm:pt-5">
          <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">
            <Skeleton className="h-6 w-36 sm:h-7 sm:w-44" />
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Skeleton className="h-7 w-14 rounded-full sm:h-8 sm:w-16" />
              <Skeleton className="size-7 rounded-full sm:size-8" />
              <Skeleton className="size-7 rounded-full sm:size-8" />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-1.5 pb-2 pt-2 sm:px-3">
          <div className="grid grid-cols-7 border-b border-border">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex justify-center py-1.5 sm:py-2">
                <Skeleton className="h-2.5 w-5 sm:w-7" />
              </div>
            ))}
          </div>

          {/* 6 weeks × 7 days — same cell mins as TasksWeekDayCell */}
          <div className="grid min-w-0 flex-1 grid-cols-7 content-stretch gap-px overflow-hidden rounded-b-lg border border-t-0 border-border bg-border">
            {Array.from({ length: 42 }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-14 flex-col justify-between gap-1 bg-card p-1 sm:min-h-[4.75rem] sm:p-2"
              >
                <Skeleton className="size-6 rounded-full sm:size-7" />
                <Skeleton className="h-1.5 w-8" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border px-2 py-2.5 sm:gap-x-4 sm:px-5 sm:py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <Skeleton className="size-2 rounded-full sm:size-2.5" />
              <Skeleton className="h-2.5 w-10 sm:w-12" />
            </span>
          ))}
        </div>
      </div>

      {/* TasksDayPanel shell */}
      <aside
        className={cn(
          "flex h-full min-h-[320px] min-w-0 flex-col sm:min-h-[420px]",
          glassPanelClassName,
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-border px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
          <div className="min-w-0 space-y-1">
            <Skeleton className="h-2.5 w-14 sm:h-3 sm:w-16" />
            <Skeleton className="mt-0.5 h-5 w-36 sm:h-6 sm:w-44" />
            <Skeleton className="mt-1 h-3 w-28" />
          </div>
          <Skeleton className="h-8 w-[4.5rem] shrink-0 rounded-full sm:w-24" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden px-3 py-1 sm:px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex min-w-0 items-start gap-2 border-b border-border py-3 last:border-b-0"
            >
              <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
              <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
              <div className="min-w-0 flex-1">
                <div className="flex h-5 items-center">
                  <Skeleton className="h-3.5 w-3/5 max-w-40" />
                </div>
                <div className="mt-0.5 flex h-4 items-center">
                  <Skeleton className="h-3 w-2/5 max-w-28" />
                </div>
              </div>
              <Skeleton className="size-7 shrink-0 rounded-md" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/** Reminders month calendar. */
export function RemindersCalendarPageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading reminders calendar">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-3 w-64 max-w-full" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
      <div
        className={cn(
          "flex min-h-[360px] min-w-0 flex-col sm:min-h-[420px]",
          glassPanelClassName,
        )}
      >
        <div className="grid grid-cols-7 border-b border-border px-3 pt-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex justify-center py-2">
              <Skeleton className="h-2.5 w-8" />
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 content-start gap-px overflow-hidden rounded-b-lg border border-t-0 border-border bg-border p-px">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="min-h-16 bg-card p-2 sm:min-h-20">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="mt-3 h-2 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Analytics: stats + two chart panels. */
export function AnalyticsPageSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-4" aria-busy="true" aria-label="Loading analytics">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className={cn("flex h-[380px] flex-col p-6", glassPanelClassName)}
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-1.5 h-3 w-56 max-w-full" />
            <Skeleton className="mt-6 min-h-0 flex-1 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Notifications inbox: two stacked directory tables. */
export function NotificationsPageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading notifications">
      <TasksDirectoryPageSkeleton rows={4} />
      <TasksDirectoryPageSkeleton rows={4} />
    </div>
  );
}

/** Reminders management card grid. */
export function RemindersManagementPageSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading reminders"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={cn("rounded-3xl p-5", glassPanelClassName)}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
          <div className="mt-5 flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Client / workspace dashboard-style stats + lower block. */
export function StatsAndBlockPageSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-4" aria-busy="true" aria-label="Loading">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className={cn("min-h-64 p-6", glassPanelClassName)}>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-3 w-56" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Project detail: notes table + links + activities. */
export function ProjectDetailPageSkeleton() {
  return (
    <div
      className={cn("space-y-4", containMinWidthClassName)}
      aria-busy="true"
      aria-label="Loading project"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <ProjectsDirectoryPageSkeleton rows={5} />
      <div className={cn("p-6", glassPanelClassName)}>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-4 h-10 w-full rounded-lg" />
        <Skeleton className="mt-2 h-10 w-full rounded-lg" />
      </div>
      <div className={cn("min-h-48 p-6", glassPanelClassName)}>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

/** Client detail: summary + chat + projects. */
export function ClientDetailPageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading client">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className={cn("min-h-64 p-6", glassPanelClassName)}>
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
        <div className={cn("min-h-64 p-6", glassPanelClassName)}>
          <Skeleton className="h-5 w-24" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <ProjectsDirectoryPageSkeleton rows={3} />
    </div>
  );
}
