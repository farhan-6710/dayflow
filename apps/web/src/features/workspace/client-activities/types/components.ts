import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityRaisedBy,
  ClientActivityStatus,
  ClientActivityTask,
  CreateClientActivityCallInput,
  CreateClientActivityMeetingInput,
  CreateClientActivityTaskInput,
} from "@/features/workspace/client-activities/types/types";
import type { Project } from "@/shared/types/types";

export type ClientActivitiesScope =
  | { scope: "project"; projectId: string }
  | { scope: "client"; clientId: string; projects: Project[] };

export type ClientActivitiesBlockProps = ClientActivitiesScope & {
  canEdit?: boolean;
  /** "client" in the portal: new items are saved as client-raised, and only those stay editable. */
  activityRaisedBy?: ClientActivityRaisedBy;
  /** Called after any create, edit or delete, so a page's own totals can refresh. */
  onChange?: () => void;
  /** Hands the loaded rows to the page, for its own summary. */
  onRowsChange?: (rows: ActivityRows) => void;
};

export type ActivityKind = "task" | "meeting" | "call";

export type ActivityItem =
  | { kind: "task"; item: ClientActivityTask }
  | { kind: "meeting"; item: ClientActivityMeeting }
  | { kind: "call"; item: ClientActivityCall };

export type ActivityListRow = {
  id: string;
  title: string;
  status: ClientActivityStatus;
  raisedBy: ClientActivityRaisedBy;
  meta: string[];
  source: ActivityItem;
};

export type ActivityListProps = {
  clientLabel: string;
  rows: ActivityListRow[];
  emptyLabel: string;
  canEditRow: (row: ActivityListRow) => boolean;
  onEdit: (row: ActivityListRow) => void;
  onDelete: (row: ActivityListRow) => void;
};

export type ActivityStatusBadgeProps = {
  status: ClientActivityStatus;
};

/** Shared by the three activity dialogs. */
export type ActivityDialogProps<TItem, TInput> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TItem | null;
  /** Fixed for a project page; otherwise the user picks from `projectOptions`. */
  fixedProjectId?: string;
  projectOptions?: Project[];
  onSave: (itemId: string | null, projectId: string, input: TInput) => Promise<void>;
};

export type ActivityTaskDialogProps = ActivityDialogProps<ClientActivityTask, CreateClientActivityTaskInput>;
export type ActivityMeetingDialogProps = ActivityDialogProps<ClientActivityMeeting, CreateClientActivityMeetingInput>;
export type ActivityCallDialogProps = ActivityDialogProps<ClientActivityCall, CreateClientActivityCallInput>;

export type ActivityCommonValues = {
  projectId: string;
  title: string;
  description: string;
  status: ClientActivityStatus;
};

export type ActivityCommonFieldsProps = {
  idPrefix: string;
  values: ActivityCommonValues;
  disabled: boolean;
  fixedProjectId?: string;
  projectOptions?: Project[];
  onChange: (patch: Partial<ActivityCommonValues>) => void;
};

export type ActivityRows = Record<ActivityKind, ActivityListRow[]>;

export type ActivitySummaryStatsProps = {
  rows: ActivityRows | null;
};
