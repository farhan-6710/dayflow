import {
  TASK_STATUS_DOT_COLORS,
  TASK_STATUS_LEGEND,
} from "@/features/tasks/constants/taskStatus";

export function TasksManagementStatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {TASK_STATUS_LEGEND.map(({ status, label }) => (
        <div
          key={status}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1"
        >
          <span className={`size-2 rounded-full ${TASK_STATUS_DOT_COLORS[status]}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
