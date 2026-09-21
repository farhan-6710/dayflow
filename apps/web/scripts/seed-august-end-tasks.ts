import { createClient } from "@supabase/supabase-js";

const YEAR = 2026;
const MONTH = 8;
const DAYS = [26, 27, 28, 29] as const;
const TASK_PRIORITY = "medium";
const COMPLETED_RATIO = 0.88;

/** Same everyday wording as existing August seeds. */
const TASK_POOL = [
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

function randomTaskCount(): number {
  return Math.floor(Math.random() * 7);
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
  }
  return copy;
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
  const period = match[3]!.toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return { hour, minute };
}

function timestampFromDue(dueDate: string, dueTime: string): string {
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
  task: (typeof TASK_POOL)[number],
  slot: number,
) {
  const dueTime = TASK_TIMES[slot % TASK_TIMES.length];
  const title = `${task.title} · ${dueDate} · ${slot + 1}`;
  const stamp = timestampFromDue(dueDate, dueTime);

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
    description: task.description,
    status: pickStatus(),
    priority: TASK_PRIORITY,
    due_date: dueDate,
    due_time: dueTime,
    created_at: stamp,
    updated_at: stamp,
  });

  if (created.error) {
    throw new Error(`Failed to create task "${title}": ${created.error.message}`);
  }

  return true;
}

async function seedDays(supabase: ReturnType<typeof createClient>, userId: string) {
  let createdCount = 0;
  const daySummary: string[] = [];

  for (const day of DAYS) {
    const dueDate = formatDate(YEAR, MONTH, day);
    const addCount = randomTaskCount();
    const existingCount = await countTasksOnDate(supabase, userId, dueDate);
    const picked = shuffle(TASK_POOL).slice(0, addCount);
    let dayCreated = 0;

    for (let i = 0; i < picked.length; i += 1) {
      const task = picked[i];
      if (!task) continue;
      const created = await insertTask(supabase, userId, dueDate, task, existingCount + i);
      if (created) {
        createdCount += 1;
        dayCreated += 1;
      }
    }

    daySummary.push(`${dueDate}: +${dayCreated} (rolled ${addCount}, already ${existingCount})`);
  }

  return { createdCount, daySummary };
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  const { createdCount, daySummary } = await seedDays(supabase, userId);

  console.log(`Signed in as ${userId}`);
  console.log(`August 26–29, ${YEAR}: ${createdCount} task(s) created.`);
  for (const line of daySummary) {
    console.log(`  ${line}`);
  }
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
