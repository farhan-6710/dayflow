import type { LucideIcon } from "lucide-react";
import type { ComponentProps, CSSProperties, FormEvent, KeyboardEvent, ReactNode, Ref } from "react";
import type { DateRange } from "react-day-picker";

import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type { DayflowImageName } from "@/shared/constants/dayflowImages";
import type { DateFilterPeriodId } from "@/shared/constants/dateFilters";
import type { AppNotification, Client, Project } from "@/shared/types/types";
import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";
import type { usePagination } from "@/shared/hooks/usePagination";

/* Shell */

export type ShellNavItem = {
  label: string;
  to: string;
  icon: ShellNavIconKey;
};

export type ShellSidebarConfig = {
  homeLink: string;
  brandSubtitle: string;
  nav: ShellNavItem[];
  searchPlaceholder: string;
  /** Account / profile page. */
  profilePath: string;
  settingsPath: string;
  quickAction: {
    image: DayflowImageName;
    title: string;
    description: string;
    buttonLabel: string;
    buttonTo: string;
  };
};

export type AppShellLayoutProps = {
  sidebarConfig: ShellSidebarConfig;
  signOutRedirect: string;
  headerActions?: ReactNode;
  mobileNavDescription: string;
};

export type PageOutletProps = {
  sidebarConfig: ShellSidebarConfig;
};

export type ShellHeaderProps = {
  sidebarConfig: ShellSidebarConfig;
  signOutRedirect: string;
  headerActions?: ReactNode;
  onOpenMobileNav: () => void;
};

export type ShellSidebarProps = {
  config: ShellSidebarConfig;
  collapsed: boolean;
  onToggleSidebar?: () => void;
};

export type ShellSidebarContentProps = ShellSidebarProps & {
  onNavigate?: () => void;
};

export type ShellNavLinkProps = {
  item: ShellNavItem;
  collapsed: boolean;
  onNavigate?: () => void;
};

export type ShellQuickActionProps = {
  action: ShellSidebarConfig["quickAction"];
  onNavigate?: () => void;
};

export type ShellSidebarProfileProps = {
  profilePath: string;
  collapsed: boolean;
  onNavigate?: () => void;
};

export type ShellMobileNavSheetProps = {
  config: ShellSidebarConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
};

export type ShellNavSearchProps = {
  nav: ShellNavItem[];
  placeholder: string;
};

export type PortalUserHeaderMenuProps = {
  accountPath: string;
  settingsPath: string;
  signOutRedirect: string;
};

/* Page chrome and feedback */

export type PageHeaderProps = {
  /** Sits left of the heading and description, such as a project chip. */
  leading?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export type EmptyStateProps = {
  title: string;
  description: ReactNode;
  image?: DayflowImageName;
  action?: ReactNode;
  /** Drop the panel when the empty state already sits inside one. */
  bare?: boolean;
  className?: string;
};

export type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
};

export type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export type DayflowImageProps = {
  name: DayflowImageName;
  alt?: string;
  className?: string;
};

export type DayFlowLogoProps = {
  className?: string;
};

export type UserAvatarProps = {
  src?: string | null;
  initials: string;
  alt?: string;
  className?: string;
};

export type StatusPillProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
};

/* Stat cards */

export type StatCardItem = {
  id: string;
  label: string;
  value: ReactNode;
  description?: string;
  delta?: string;
  deltaLabel?: string;
  trend?: "positive" | "negative";
  href?: string;
  icon: LucideIcon;
};

export type StatCardProps = {
  card: StatCardItem;
};

export type StatCardTrendProps = {
  delta: string;
  deltaLabel?: string;
  trend?: StatCardItem["trend"];
};

export type StatsCardsProps = {
  cards: StatCardItem[];
  isLoading?: boolean;
};

export type TableSkeletonProps = {
  rows?: number;
  gridClass?: string;
  columns?: DirectoryTableColumn[];
  cells?: (string | string[])[];
  /** No side padding, for rows inside a panel that has its own. */
  flush?: boolean;
  /** Give the rows their own panel when nothing around them provides one. */
  panel?: boolean;
  title?: string;
};

export type ChartSkeletonProps = {
  title: string;
  /** The real chart's height, so nothing moves when it loads. */
  chartClassName: string;
};

/* Lists */

export type DirectoryTableColumn = {
  label: string;
  align?: "left" | "center" | "right";
  className?: string;
  /** Makes the header a sort button. */
  onSort?: () => void;
  sortDirection?: "asc" | "desc" | null;
};

export type DirectoryTableProps = {
  title?: ReactNode;
  description?: string;
  /** `md:grid-cols-[...]` class, shared by the header and the rows. */
  gridClass: string;
  columns: DirectoryTableColumn[];
  isLoading?: boolean;
  loadingRows?: number;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: ReactNode;
  emptyImage?: DayflowImageName;
  emptyAction?: ReactNode;
  /** Sits opposite the title, for the list's main action. */
  action?: ReactNode;
  /** Search and filters, on their own row under the title. */
  headerAside?: ReactNode;
  /** Pagination, under the rows. */
  footer?: ReactNode;
  children: ReactNode;
};

export type DirectoryTableRowProps = {
  to?: string;
  onActivate?: () => void;
  label: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  children: ReactNode;
};

export type SortableListProps = {
  ids: string[];
  onReorder: (orderedIds: string[]) => void;
  children: ReactNode;
};

export type DragHandleProps = {
  label: string;
  handleProps: ComponentProps<"button">;
};

export type RowAction = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  onSelect: () => void;
};

export type RowActionsMenuProps = {
  label: string;
  actions: RowAction[];
};

export type BackLinkProps = {
  to: string;
  children: ReactNode;
};

export type ProjectChipProps = {
  color: string;
  className?: string;
};

export type ListingSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

export type OptionDropdownOption = {
  value: string;
  label: string;
};

export type OptionDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: OptionDropdownOption[];
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  icon?: LucideIcon;
};

export type ActiveStatusTabsProps = {
  value: ActiveStatusFilterId;
  onChange: (value: ActiveStatusFilterId) => void;
  labels: Record<ActiveStatusFilterId, string>;
  /** Left out while loading, so the tabs never show a false zero. */
  counts?: Record<ActiveStatusFilterId, number>;
};

/* Dates */

export type DateFiltersFilterState =
  | { mode: "all" }
  | { mode: "period"; period: DateFilterPeriodId }
  | { mode: "range"; from: Date; to: Date };

export type ResponsiveGreetingProps = {
  name: ReactNode;
};

export type DateRangePickerProps = {
  /** Fills its cell as an outlined button, for the phone layout. */
  fullWidth?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  range: DateRange | undefined;
  rangeLabel: string;
  isActive: boolean;
  onRangeChange: (range: DateRange | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  error: string | null;
};

export type DateFiltersProps = {
  activeQuickPeriod: DateFilterPeriodId | null;
  isDateRangeActive: boolean;
  periodLabel: string;
  rangeButtonLabel: string;
  pickerRange: DateRange | undefined;
  isPickerOpen: boolean;
  pickerError: string | null;
  onToggleQuickPeriod: (period: DateFilterPeriodId) => void;
  onClearFilters: () => void;
  onClearDateRange: () => void;
  onApplyDateRange: () => void;
  onPickerRangeChange: (range: DateRange | undefined) => void;
  onPickerOpenChange: (open: boolean) => void;
  onPickerKeyDown: (event: KeyboardEvent) => void;
};

export type DatePickerProps = {
  id?: string;
  label?: string;
  /** `yyyy-MM-dd`, or empty when nothing is selected. */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
};

/* Form fields */

export type TextFieldProps = Omit<ComponentProps<"input">, "onChange" | "id"> & {
  id: string;
  label: string;
  hint?: string;
  onChange?: (value: string) => void;
};

export type PasswordFieldProps = Omit<ComponentProps<"input">, "onChange" | "id" | "type" | "value"> & {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
};

export type SubmitButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "outline";
  className?: string;
  children: ReactNode;
};

/* Projects */

export type ProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null creates a new project. */
  project: Project | null;
  clients: Client[];
  /** Client id to prefill when creating. */
  defaultProjectFor?: string | null;
  lockProjectFor?: boolean;
  onSaved: (project: Project) => void;
  /** Edit only: opens the delete confirmation flow. */
  onDelete?: (project: Project) => void;
};

export type TimeSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export type TextAreaFieldProps = Omit<ComponentProps<"textarea">, "onChange" | "id"> & {
  id: string;
  label: string;
  onChange: (value: string) => void;
};

export type FormDialogProps = {
  open: boolean;
  title: string;
  description: string;
  submitLabel: string;
  saving: boolean;
  canSave: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  /** Edit flows: delete (or similar) sits bottom-left, opposite Cancel / Submit. */
  footerStart?: ReactNode;
};

export type NotificationListProps = {
  title?: string;
  notifications: AppNotification[];
  emptyLabel: string;
  markingId: string | null;
  onMarkRead: (id: string) => void;
};

export type BreadcrumbItem = { label: string; to?: string };

export type BreadcrumbsProps = {
  nav: ShellNavItem[];
  homeLink: string;
  className?: string;
};

export type PillTabsProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; count?: number; icon?: LucideIcon }[];
};

export type SummaryStatItem = {
  id: string;
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  trend?: string;
};

export type SummaryStatsProps = {
  items: SummaryStatItem[];
  isLoading?: boolean;
};

export type ListingToolbarProps = {
  tabs: ReactNode;
  filter?: ReactNode;
  search: ReactNode;
};

export type TablePaginationProps = {
  pagination: ReturnType<typeof usePagination>;
  /** Plural, as in "Showing 1–7 of 24 clients". */
  noun: string;
};

export type PanelHeadingProps = {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
};

export type DetailsPanelProps = {
  icon: LucideIcon;
  title: string;
  rows: { icon: LucideIcon; label: string; value: ReactNode }[];
};

export type PanelLinkProps = {
  to: string;
  children: ReactNode;
};
