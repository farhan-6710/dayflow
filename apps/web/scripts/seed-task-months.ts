import { createClient } from "@supabase/supabase-js";

const YEAR = 2026;
const TASK_PRIORITY = "medium";
const COMPLETED_RATIO = 0.88;

const TASK_TEMPLATES = [
  { title: "Morning workout", description: "Complete today's fitness session and log how it felt." },
  { title: "Study block", description: "Spend focused time on the current learning topic." },
  { title: "Office priorities", description: "Clear the top work item and send any needed follow-up." },
  { title: "Freelance progress", description: "Move one client task forward and update the status." },
  { title: "Inbox zero", description: "Clear leftover messages and flag anything that still needs a reply." },
  { title: "Daily review", description: "Write a short recap of what shipped and what slipped." },
] as const;

const TASK_TIMES = [
  "7:00 AM",
  "10:00 AM",
  "1:00 PM",
  "3:00 PM",
  "6:00 PM",
  "9:00 PM",
] as const;

type MonthPlan = {
  month: number;
  lastDay: number;
  allowEmpty: boolean;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env before running the seed script.`);
  }
  return value;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function augustLastDay(): number {
  const today = new Date();
  const lastDay = daysInMonth(YEAR, 8);
  if (today.getFullYear() === YEAR && today.getMonth() + 1 === 8) {
    return Math.min(today.getDate(), lastDay);
  }
  return lastDay;
}

function pickCount(allowEmpty: boolean): number {
  const roll = Math.random();

  if (allowEmpty) {
    if (roll < 0.12) return 0;
    if (roll < 0.34) return 2;
    if (roll < 0.58) return 3;
    if (roll < 0.78) return 4;
    if (roll < 0.92) return 5;
    return 6;
  }

  if (roll < 0.22) return 2;
  if (roll < 0.48) return 3;
  if (roll < 0.74) return 4;
  if (roll < 0.9) return 5;
  return 6;
}

function pickStatus(): "done" | "missed" {
  return Math.random() < COMPLETED_RATIO ? "done" : "missed";
}

function to24Hour(time: string): { hour: number; minute: number } {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return { hour: 12, minute: 0 };
  }

  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return { hour, minute };
}

function updatedAtFromDue(dueDate: string, dueTime: string): string {
  const { hour, minute } = to24Hour(dueTime);
  return `${dueDate}T${pad(hour)}:${pad(minute)}:00+05:30`;
}

async function signIn(supabase: ReturnType<typeof createClient>) {
  const email = requireEnv("SEED_EMAIL");
  const password = requireEnv("SEED_PASSWORD");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(`Sign-in failed: ${error.message}`);
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("Sign-in succeeded but no user id was returned.");
  }

  return userId;
}

async function countTasksOnDate(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  dueDate: string,
) {
  const { count, error } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("due_date", dueDate);

  if (error) {
    throw new Error(`Failed to count tasks for ${dueDate}: ${error.message}`);
  }

  return count ?? 0;
}

async function insertTask(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  dueDate: string,
  slot: number,
) {
  const template = TASK_TEMPLATES[slot % TASK_TEMPLATES.length];
  const dueTime = TASK_TIMES[slot % TASK_TIMES.length];
  const title = `${template.title} · ${dueDate} · ${slot + 1}`;

  const existing = await supabase
    .from("tasks")
    .select("id")
    .eq("user_id", userId)
    .eq("title", title)
    .eq("due_date", dueDate)
    .maybeSingle();

  if (existing.error) {
    throw new Error(`Failed to look up task "${title}": ${existing.error.message}`);
  }

  if (existing.data) {
    return false;
  }

  const created = await supabase.from("tasks").insert({
    user_id: userId,
    title,
    description: template.description,
    status: pickStatus(),
    priority: TASK_PRIORITY,
    due_date: dueDate,
    due_time: dueTime,
    updated_at: updatedAtFromDue(dueDate, dueTime),
  });

  if (created.error) {
    throw new Error(`Failed to create task "${title}": ${created.error.message}`);
  }

  return true;
}

async function seedMonth(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  plan: MonthPlan,
) {
  let createdCount = 0;

  for (let day = 1; day <= plan.lastDay; day += 1) {
    const dueDate = formatDate(YEAR, plan.month, day);
    const target = pickCount(plan.allowEmpty);
    const existingCount = await countTasksOnDate(supabase, userId, dueDate);
    const needed = Math.max(0, target - existingCount);

    for (let slot = existingCount; slot < existingCount + needed; slot += 1) {
      const created = await insertTask(supabase, userId, dueDate, slot);
      if (created) {
        createdCount += 1;
      }
    }
  }

  return createdCount;
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  const june = await seedMonth(supabase, userId, {
    month: 6,
    lastDay: daysInMonth(YEAR, 6),
    allowEmpty: true,
  });
  const july = await seedMonth(supabase, userId, {
    month: 7,
    lastDay: daysInMonth(YEAR, 7),
    allowEmpty: true,
  });
  const august = await seedMonth(supabase, userId, {
    month: 8,
    lastDay: augustLastDay(),
    allowEmpty: false,
  });

  console.log(`Signed in as ${userId}`);
  console.log(`June tasks created: ${june}`);
  console.log(`July tasks created: ${july}`);
  console.log(`August extra tasks created: ${august}`);
  console.log("Statuses are ~88% completed and ~12% missed.");
  console.log("Then run this in the Supabase SQL editor so updated_at matches each due date:");
  console.log(`
alter table public.tasks disable trigger set_tasks_updated_at;

update public.tasks
set updated_at = (
  due_date
  + coalesce(
      to_timestamp(upper(trim(due_time)), 'HH12:MI AM')::time,
      time '12:00'
    )
) at time zone 'Asia/Kolkata'
where status in ('done', 'missed')
  and due_date is not null
  and due_date >= '2026-06-01'
  and due_date <= '2026-08-31';

alter table public.tasks enable trigger set_tasks_updated_at;
`);
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
