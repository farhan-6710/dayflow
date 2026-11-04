import type { CalendarView } from "@/features/workspace/tasks/constants/calendar";
import type { PositionedTask } from "@/features/workspace/tasks/utils/taskTimeline";
import type { Task, TaskPriority, TaskStatus } from "@/shared/types/types";

export type TasksCalendarToolbarProps = {
  title: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  /** Left out when already showing today. */
  onToday?: () => void;
};

type TaskOpenHandler = { onOpenTask: (task: Task) => void };
type TimelineHandlers = TaskOpenHandler & { onAddAt: (date: Date, time: string) => void };

export type TasksMonthViewProps = {
  month: Date;
  selectedDate: Date;
  tasksByDate: Map<string, Task[]>;
  onSelectDate: (date: Date) => void;
};

export type TasksWeekViewProps = TimelineHandlers & {
  cursor: Date;
  selectedDate: Date;
  tasksByDate: Map<string, Task[]>;
  onSelectDate: (date: Date) => void;
};

export type TasksDayViewProps = TimelineHandlers & {
  date: Date;
  tasks: Task[];
};

export type TimelineColumnProps = TimelineHandlers & {
  date: Date;
  tasks: Task[];
  compact?: boolean;
};

export type TaskBlockProps = {
  positioned: PositionedTask;
  compact?: boolean;
  onOpen: (task: Task) => void;
};

export type UntimedTaskChipProps = {
  task: Task;
  onOpen: (task: Task) => void;
};

export type TasksDayPanelProps = {
  date: Date;
  tasks: Task[];
  isLoading: boolean;
  onAdd: () => void;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (orderedIds: string[]) => void;
};

export type TaskRowProps = {
  task: Task;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export type TaskDetailsSheetProps = {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
};

export type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null creates a new task on `defaultDate`. */
  task: Task | null;
  defaultDate: string;
  /** Set when adding from a timeline hour. */
  defaultTime?: string;
  onSave: (taskId: string | null, values: TaskFormValues) => Promise<void>;
  /** Edit only: opens the delete confirmation flow. */
  onDelete?: (task: Task) => void;
};
