import type { FeatureChapterItem } from "@/features/site/types/components";

/** "Our Features": eatrrite's "Our Programs" rail, one chapter per part of the workspace. */
export const FEATURES_BLOCK = {
  pill: "Our features",
  title: "Everything a freelance day needs",
  lead: "Five parts of one workspace, each built around the way client work actually moves.",
  cta: { label: "See all features" },
};

export const FEATURE_CHAPTERS: FeatureChapterItem[] = [
  {
    slug: "insights",
    title: "Dashboard and analytics",
    screen: "dashboard",
    summary: "See what's done, what's due and how the week is going.",
    benefits: [
      "Stat cards with date filters",
      "A task completion chart and a time tracker",
      "Status and notes-per-project analytics",
    ],
  },
  {
    slug: "clients",
    title: "Clients",
    screen: "clients",
    summary: "Keep every client's details, contacts and conversations on one record.",
    benefits: [
      "Company, main contact and a secondary contact on one card",
      "A chat thread with each client",
      "Client portal access from the client's email",
    ],
  },
  {
    slug: "projects",
    title: "Projects and notes",
    screen: "projects",
    summary: "Track client and personal projects, with notes and reference links beside the work.",
    benefits: [
      "Client or personal projects, active or inactive",
      "Categorised notes in a paper-style editor",
      "Reference links on every project and note",
    ],
  },
  {
    slug: "calendar",
    title: "Tasks calendar",
    screen: "calendar",
    summary: "Plan the day on a month, week or hour-by-hour day view.",
    benefits: [
      "Month, week and day timelines",
      "Status and priority on every task",
      "Drag tasks into the order that matters",
    ],
  },
  {
    slug: "reminders",
    title: "Daily reminders",
    screen: "reminders",
    summary: "Recurring reminders for the follow-ups that keep work moving.",
    benefits: [
      "Choose the days and the time once",
      "Pause a reminder until a date",
      "Alerts arrive in your notifications while DayFlow is open",
    ],
  },
];
