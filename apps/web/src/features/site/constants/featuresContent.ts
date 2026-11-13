import type { FeatureChapterItem } from "@/features/site/types/components";

/** "Our Features": eatrrite's "Our Programs" rail, one chapter per part of the workspace. */
export const FEATURES_BLOCK = {
  pill: "Our features",
  title: "Everything a freelance day needs",
  lead: "Six parts of one workspace, each built around the way client work actually moves.",
  cta: { label: "See all features" },
};

export const FEATURE_CHAPTERS: FeatureChapterItem[] = [
  {
    slug: "clients",
    title: "Clients",
    image: "icon-empty-clients",
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
    image: "icon-empty-projects",
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
    image: "icon-empty-tasks",
    summary: "Plan the day on a month, week or hour-by-hour day view.",
    benefits: [
      "Month, week and day timelines",
      "Status and priority on every task",
      "Drag tasks into the order that matters",
    ],
  },
  {
    slug: "activities",
    title: "Client activities",
    image: "icon-empty-activities",
    summary: "Log tasks, meetings and calls against each project, raised by you or by your client.",
    benefits: [
      "Tasks, meetings and calls per project",
      "Clients raise their own requests from the portal",
      "See who raised what at a glance",
    ],
  },
  {
    slug: "reminders",
    title: "Daily reminders",
    image: "icon-empty-reminders",
    summary: "Recurring reminders for the follow-ups that keep work moving.",
    benefits: [
      "Choose the days and the time once",
      "Pause a reminder until a date",
      "Alerts arrive in your notifications while DayFlow is open",
    ],
  },
  {
    slug: "insights",
    title: "Dashboard and analytics",
    image: "icon-stat-rate",
    summary: "See what's done, what's due and how the week is going.",
    benefits: [
      "Stat cards with date filters",
      "A task completion chart and a time tracker",
      "Status and notes-per-project analytics",
    ],
  },
];
