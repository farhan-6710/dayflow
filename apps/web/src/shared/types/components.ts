import type { KeyboardEvent, ReactNode } from "react";
import type { DateRange } from "react-day-picker";

import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type { DayflowImageName } from "@/shared/constants/dayflowImages";
import type { DateFilterPeriodId } from "@/shared/constants/dateFilters";
import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";

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
  profilePath: string;
  quickAction: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonTo: string;
    image: DayflowImageName;
  };
};

export type AppShellLayoutProps = {
  sidebarConfig: ShellSidebarConfig;
  signOutRedirect: string;
  headerActions?: ReactNode;
  mobileNavDescription: string;
};

export type ShellHeaderProps = {
  sidebarConfig: ShellSidebarConfig;
  signOutRedirect: string;
  headerActions?: ReactNode;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
};

export type ShellSidebarProps = {
  config: ShellSidebarConfig;
  collapsed: boolean;
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
  settingsPath: string;
  signOutRedirect: string;
};

/* Page chrome and feedback */

export type PageHeaderProps = {
  eyebrow?: string;
  heading: ReactNode;
  description?: ReactNode;
  backButton?: ReactNode;
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
  image: DayflowImageName;
};

export type StatCardProps = {
  card: StatCardItem;
};

export type StatCardTrendProps = {
  delta: string;
  deltaLabel: string;
  trend?: StatCardItem["trend"];
};

export type StatsCardsProps = {
  cards: StatCardItem[];
  isLoading?: boolean;
};

export type TableSkeletonProps = {
  rows?: number;
};

/* Lists */

export type DirectoryTableColumn = {
  label: string;
  align?: "left" | "right";
};

export type DirectoryTableProps = {
  title?: string;
  description?: string;
  /** Tailwind grid-template-columns class, shared by the header and the rows. Applied from `md` up. */
  gridClass: string;
  columns: DirectoryTableColumn[];
  isLoading?: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: ReactNode;
  emptyImage?: DayflowImageName;
  emptyAction?: ReactNode;
  headerAside?: ReactNode;
  children: ReactNode;
};

export type DirectoryTableRowProps = {
  to?: string;
  onActivate?: () => void;
  label: string;
  className?: string;
  children: ReactNode;
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
};

export type ActiveStatusFilterProps = {
  value: ActiveStatusFilterId;
  onChange: (value: ActiveStatusFilterId) => void;
  labels: Record<ActiveStatusFilterId, string>;
  disabled?: boolean;
};

/* Dates */

export type DateFiltersFilterState =
  | { mode: "all" }
  | { mode: "period"; period: DateFilterPeriodId }
  | { mode: "range"; from: Date; to: Date };

export type DateRangePickerProps = {
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
