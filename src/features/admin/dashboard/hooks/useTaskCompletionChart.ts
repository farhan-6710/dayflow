import { useMemo, useState } from "react";

import type { TaskCompletionMonthSelection } from "@/features/admin/dashboard/types/taskCompletionChart";
import {
  buildTaskCompletionChart,
  defaultTaskCompletionMonths,
} from "@/features/admin/dashboard/utils/taskCompletionChart";
import type { Task } from "@/services/tasksService";

export function useTaskCompletionChart(tasks: Task[]) {
  const defaults = defaultTaskCompletionMonths();
  const [primary, setPrimary] = useState<TaskCompletionMonthSelection>(defaults.primary);
  const [compare, setCompare] = useState<TaskCompletionMonthSelection>(defaults.compare);

  const chart = useMemo(
    () =>
      buildTaskCompletionChart(
        tasks,
        primary.year,
        primary.month,
        compare.year,
        compare.month,
      ),
    [tasks, primary.year, primary.month, compare.year, compare.month],
  );

  return {
    primary,
    compare,
    setPrimary,
    setCompare,
    chart,
  };
}
