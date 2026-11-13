import type { SiteScreen, SiteScreenId } from "@/features/site/types/components";

const SCREENS_DIR = "/images/dayflow/screens";

/** Light and dark captures of one workspace page: `public/images/dayflow/screens/<id>-light.webp` and `<id>-dark.webp`. */
function screenImages(id: SiteScreenId) {
  return { light: `${SCREENS_DIR}/${id}-light.webp`, dark: `${SCREENS_DIR}/${id}-dark.webp` };
}

/** The five workspace pages shown on the site: the hero tabs and the "Our features" chapters use the same captures. */
export const SITE_SCREENS: Record<SiteScreenId, SiteScreen> = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    alt: "The DayFlow dashboard with stat cards, a task completion chart and a todo list",
    ...screenImages("dashboard"),
  },
  clients: {
    id: "clients",
    label: "Clients",
    alt: "A client record in DayFlow with stats, projects, activities and contact details",
    ...screenImages("clients"),
  },
  projects: {
    id: "projects",
    label: "Projects",
    alt: "The DayFlow projects table with each project's client and status",
    ...screenImages("projects"),
  },
  calendar: {
    id: "calendar",
    label: "Calendar",
    alt: "The DayFlow tasks calendar in month view beside the selected day's tasks",
    ...screenImages("calendar"),
  },
  reminders: {
    id: "reminders",
    label: "Reminders",
    alt: "DayFlow daily reminders, each with its next time and repeat days",
    ...screenImages("reminders"),
  },
};

/** Hero tab order. */
export const SITE_SCREEN_ORDER: SiteScreenId[] = ["dashboard", "clients", "projects", "calendar", "reminders"];

/** Captures are 2000 px wide at roughly this ratio; frames keep it so switching tabs never jumps. */
export const SITE_SCREEN_SIZE = { width: 2000, height: 1098 };
