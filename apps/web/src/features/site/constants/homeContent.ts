import { CalendarCheck, FolderPlus, Handshake, UserPlus } from "lucide-react";

import type { ProcessStep, SpotlightStat, UseCase } from "@/features/site/types/components";
import { BRAND_TAGLINE } from "@/shared/brand/brandManifest";

const TAGLINE_WORDS = BRAND_TAGLINE.split(" ");

/** The tagline split before its last word ("flow."), which carries the accent wherever the tagline shows. */
export const TAGLINE = {
  lead: TAGLINE_WORDS.slice(0, -1).join(" "),
  accent: TAGLINE_WORDS.at(-1) ?? "",
};

export const INTRO_STRIP = "Two portals, one workspace: see how DayFlow keeps you and your clients in step";

/** Eatrrite's founder spotlight, told as why DayFlow exists (no invented people or numbers). */
export const SPOTLIGHT = {
  pill: "Why we built it",
  title: "One calm place for every client, project and day",
  accent: "calm place",
  lead: "Freelance work spreads across chats, notes apps, calendars and spreadsheets. DayFlow brings it back together.",
  text: "Clients, projects, notes, tasks, meetings, calls and reminders share one workspace, and every client gets a portal to follow shared projects and raise requests. Nothing to stitch together, nothing to chase.",
  citation: "The DayFlow promise",
  cta: "Explore features",
  badge: { note: "Workspace and client portal", role: "Built for freelancers" },
  seal: "CLIENTS · PROJECTS · TASKS · NOTES · ",
};

export const SPOTLIGHT_STATS: SpotlightStat[] = [
  { value: "2 portals", label: "A workspace for you, a portal for each client" },
  { value: "8 areas", label: "Dashboard to analytics, in one sidebar" },
  { value: "Light & dark", label: "Follows your device, or your choice" },
  { value: "Web & desktop", label: "In the browser, or as a desktop app" },
];

export const MARQUEE = [
  "Clients",
  "Projects",
  "Notes",
  "Tasks calendar",
  "Meetings & calls",
  "Daily reminders",
  "Notifications",
  "Analytics",
  "Client portal",
];

export const WHY = {
  pill: "Why DayFlow",
  title: "Built around the way freelancers work",
  accent: "freelancers",
  items: [
    { num: "01", title: "One home for client work", text: "Clients, projects, tasks and notes share one workspace, so context is never a tab away." },
    { num: "02", title: "Clients stay in the loop", text: "A portal shows each client their shared projects and lets them raise tasks, meetings and calls." },
    { num: "03", title: "Calm by design", text: "Warm paper tones, serif type and quiet motion keep long workdays easy on the eyes." },
    { num: "04", title: "Your data stays yours", text: "Row-level security guards every record: you see your work, clients see only what you share." },
  ],
};

export const PROCESS = {
  pill: "Working process",
  title: "From sign-up to a flowing day in four steps",
  accent: "four steps",
};

export const PROCESS_STEPS: ProcessStep[] = [
  { num: "01", icon: UserPlus, title: "Create your workspace", text: "Sign up with email or Google and land straight on your dashboard." },
  { num: "02", icon: FolderPlus, title: "Add clients and projects", text: "Set up client records and the projects you run for them, or for yourself." },
  { num: "03", icon: CalendarCheck, title: "Plan the work", text: "Schedule tasks, log meetings and calls, and set the reminders you need." },
  { num: "04", icon: Handshake, title: "Bring clients in", text: "Give a client portal access so they follow progress and raise requests." },
];

/** Eatrrite's testimonials, as typical ways freelancers use DayFlow rather than invented reviews. */
export const USE_CASES = {
  pill: "Made for you",
  title: "Built for every kind of freelancer",
  accent: "every kind",
  lead: "Typical ways freelancers shape one workspace around their work.",
};

export const USE_CASE_ITEMS: UseCase[] = [
  { role: "Freelance designer", focus: "Projects and client portal", text: "Each brand gets a project, with notes for feedback rounds and links to boards and files. Clients raise revisions from their portal instead of long email threads." },
  { role: "Web developer", focus: "Tasks calendar", text: "Sprints become tasks on the week view, priorities set, and every call with the client logged against the project." },
  { role: "Writer and editor", focus: "Notes", text: "Briefs, outlines and research live as notes inside each client project, ready when the next draft is due." },
  { role: "Consultant", focus: "Meetings and calls", text: "Every meeting and call is logged per client, so the next session picks up exactly where the last one ended." },
  { role: "Social media manager", focus: "Daily reminders", text: "Recurring reminders cover posting days and weekly reports, and the dashboard shows what is still to do." },
  { role: "Photographer", focus: "Clients", text: "Client details, shoot notes and follow-ups sit on one record, from the first enquiry to the final delivery." },
];

export const CTA = {
  pill: "Start your journey",
  title: "Bring your freelance day into one flow",
  accent: "one flow",
  text: "Open your workspace, add your first client and plan tomorrow in minutes.",
};
