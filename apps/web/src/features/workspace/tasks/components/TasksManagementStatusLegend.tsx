import {
  TASK_STATUS_DOT_COLORS,
  TASK_STATUS_LEGEND,
} from "@/features/workspace/tasks/constants/taskStatus";

export function TasksManagementStatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {TASK_STATUS_LEGEND.map(({ status, label }) => (
        <div
          key={status}
          className="surface-chip flex h-7 items-center gap-2 rounded-full px-3 text-xs"
        >
          <span className={`size-2 rounded-full ${TASK_STATUS_DOT_COLORS[status]}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
