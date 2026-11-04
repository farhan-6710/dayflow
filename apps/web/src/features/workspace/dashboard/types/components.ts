import type { Todo } from "@/shared/types/types";

export type MonthSelection = {
  year: number;
  month: number;
};

export type TaskCompletionPoint = {
  day: string;
  primary: number;
  compare: number;
};

export type TaskCompletionData = {
  points: TaskCompletionPoint[];
  primaryLabel: string;
  compareLabel: string;
  primaryTotal: number;
  compareTotal: number;
  growthPercent: number | null;
};

export type DashboardHeroProps = {
  heading: string;
  today: string;
};

export type TaskCompletionChartProps = {
  isLoading: boolean;
  chart: TaskCompletionData;
  primary: MonthSelection;
  compare: MonthSelection;
  onPrimaryChange: (month: MonthSelection) => void;
  onCompareChange: (month: MonthSelection) => void;
};

export type TodoFormValues = {
  title: string;
  description: string;
};

export type TodoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo | null;
  onSave: (todoId: string | null, values: TodoFormValues) => Promise<void>;
};

export type TodoRowProps = {
  todo: Todo;
  sortable: boolean;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export type WeeklyInsightsCardProps = {
  isLoading: boolean;
  completedThisWeek: number;
  completedLastWeek: number;
  dueThisWeek: number;
  busiestDay: string | null;
};

export type ActivitySnapshotCardProps = {
  counts: { tasks: number; meetings: number; calls: number } | null;
  error: boolean;
};
