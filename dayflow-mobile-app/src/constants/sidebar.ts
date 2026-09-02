export const SIDEBAR_MENU_ITEMS = [
  { key: "index", label: "Home", iconName: "home" as const },
  {
    key: "history",
    label: "History",
    iconName: "checkmark-done" as const,
  },
  { key: "ai-assist", label: "AI Assist", iconName: "sparkles" as const },
  { key: "analytics", label: "Analytics", iconName: "stats-chart" as const },
  { key: "profile", label: "Profile", iconName: "person" as const },
] as const;

export type SidebarMenuItemKey = (typeof SIDEBAR_MENU_ITEMS)[number]["key"];
