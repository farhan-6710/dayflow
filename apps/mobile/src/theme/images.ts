/* All local art, one light and one dark file each. */
export const emptyArt = {
  activities: { light: require("../../assets/images/icons/icon-empty-activities-light.webp"), dark: require("../../assets/images/icons/icon-empty-activities-dark.webp") },
  clients: { light: require("../../assets/images/icons/icon-empty-clients-light.webp"), dark: require("../../assets/images/icons/icon-empty-clients-dark.webp") },
  links: { light: require("../../assets/images/icons/icon-empty-links-light.webp"), dark: require("../../assets/images/icons/icon-empty-links-dark.webp") },
  notes: { light: require("../../assets/images/icons/icon-empty-notes-light.webp"), dark: require("../../assets/images/icons/icon-empty-notes-dark.webp") },
  notifications: { light: require("../../assets/images/icons/icon-empty-notifications-light.webp"), dark: require("../../assets/images/icons/icon-empty-notifications-dark.webp") },
  projects: { light: require("../../assets/images/icons/icon-empty-projects-light.webp"), dark: require("../../assets/images/icons/icon-empty-projects-dark.webp") },
  reminders: { light: require("../../assets/images/icons/icon-empty-reminders-light.webp"), dark: require("../../assets/images/icons/icon-empty-reminders-dark.webp") },
  search: { light: require("../../assets/images/icons/icon-empty-search-light.webp"), dark: require("../../assets/images/icons/icon-empty-search-dark.webp") },
  tasks: { light: require("../../assets/images/icons/icon-empty-tasks-light.webp"), dark: require("../../assets/images/icons/icon-empty-tasks-dark.webp") },
  todos: { light: require("../../assets/images/icons/icon-empty-todos-light.webp"), dark: require("../../assets/images/icons/icon-empty-todos-dark.webp") },
} as const;

export const illustrations = {
  authClient: { light: require("../../assets/images/illustrations/illo-auth-client-light.webp"), dark: require("../../assets/images/illustrations/illo-auth-client-dark.webp") },
  authWorkspace: { light: require("../../assets/images/illustrations/illo-auth-workspace-light.webp"), dark: require("../../assets/images/illustrations/illo-auth-workspace-dark.webp") },
  dashboardHero: { light: require("../../assets/images/illustrations/illo-dashboard-hero-light.webp"), dark: require("../../assets/images/illustrations/illo-dashboard-hero-dark.webp") },
  error: { light: require("../../assets/images/illustrations/illo-error-light.webp"), dark: require("../../assets/images/illustrations/illo-error-dark.webp") },
  notAClient: { light: require("../../assets/images/illustrations/illo-not-a-client-light.webp"), dark: require("../../assets/images/illustrations/illo-not-a-client-dark.webp") },
  sidebarClient: { light: require("../../assets/images/illustrations/illo-sidebar-client-light.webp"), dark: require("../../assets/images/illustrations/illo-sidebar-client-dark.webp") },
  sidebarWorkspace: { light: require("../../assets/images/illustrations/illo-sidebar-workspace-light.webp"), dark: require("../../assets/images/illustrations/illo-sidebar-workspace-dark.webp") },
} as const;

export const logo = { light: require("../../assets/brand/logo-light-icon.png"), dark: require("../../assets/brand/logo-dark-icon.png") } as const;

export type EmptyArtName = keyof typeof emptyArt;
