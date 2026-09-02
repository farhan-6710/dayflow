import { createClient } from "@supabase/supabase-js";

const YEAR = 2026;
const MONTH = 9;
const FIRST_DAY = 1;
const LAST_DAY = 10;

const TASK_TIMES = [
  "8:00 AM",
  "10:30 AM",
  "12:00 PM",
  "2:00 PM",
  "4:30 PM",
  "7:00 PM",
] as const;

/** Casual day-to-day tasks — same tone as existing seeds, less formal wording. */
const TASK_POOL = [
  { title: "Morning workout", description: "Quick session and log how it went." },
  { title: "Study block", description: "One focused hour on whatever you're learning." },
  { title: "Clear inbox", description: "Reply to the easy ones and flag the rest." },
  { title: "Freelance check-in", description: "Move one client thing forward." },
  { title: "Grab groceries", description: "Restock basics before the week gets busy." },
  { title: "Pay pending bills", description: "Electricity, phone, or anything due soon." },
  { title: "Tidy the desk", description: "Five-minute reset so tomorrow feels lighter." },
  { title: "Call someone back", description: "That missed call or voice note from yesterday." },
  { title: "Prep tomorrow's list", description: "Jot down the top three things for tomorrow." },
  { title: "Walk outside", description: "Short walk, no phone if you can." },
  { title: "Fix small bug", description: "Knock out one annoying thing from the backlog." },
  { title: "Review calendar", description: "Check the week and move anything that clashes." },
  { title: "Water plants", description: "Quick pass through the balcony or living room." },
  { title: "Laundry load", description: "Start a wash before lunch." },
  { title: "Meal prep bit", description: "Chop veggies or pack lunch for tomorrow." },
  { title: "Send invoice", description: "Bill the client and note the due date." },
  { title: "Update project notes", description: "Write what changed today while it's fresh." },
  { title: "Stretch break", description: "Ten minutes away from the screen." },
  { title: "Book appointment", description: "Dentist, haircut, or whatever you've been putting off." },
  { title: "Backup files", description: "Drop important stuff in Drive or iCloud." },
  { title: "Read one article", description: "Something useful, not doom-scrolling." },
  { title: "Evening wind-down", description: "No work after this — just close the loop on the day." },
  { title: "Order supplies", description: "Coffee, notebooks, or whatever is running low." },
  { title: "Check bank balance", description: "Quick look so nothing surprises you." },
  { title: "Reply to client", description: "Send that update they've been waiting on." },
  { title: "Organize downloads", description: "Delete the junk and file the keepers." },
  { title: "Plan weekend", description: "Rough idea of rest vs errands." },
  { title: "Coffee with notes", description: "Review goals with a cup and five quiet minutes." },
  { title: "Pack bag for tomorrow", description: "Laptop, charger, anything you forgot last time." },
  { title: "Unsubscribe spam", description: "Clean two or three noisy newsletters." },
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

/** 0–5 tasks per day (inclusive). */
function randomTaskCount(): number {
  return Math.floor(Math.random() * 6);
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
  }
  return copy;
}

function taskStatusForDate(dueDate: string): "todo" | "done" | "missed" {
  const today = formatDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  );

  if (dueDate >= today) {
    return "todo";
  }

  return Math.random() < 0.85 ? "done" : "missed";
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
  const title = `${task.title} · ${dueDate}`;

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
    status: taskStatusForDate(dueDate),
    priority: "medium",
    due_date: dueDate,
    due_time: dueTime,
  });

  if (created.error) {
    throw new Error(`Failed to create task "${title}": ${created.error.message}`);
  }

  return true;
}

async function seedSeptemberDays(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  let createdCount = 0;
  const daySummary: string[] = [];

  for (let day = FIRST_DAY; day <= LAST_DAY; day += 1) {
    const dueDate = formatDate(YEAR, MONTH, day);
    const targetCount = randomTaskCount();
    const existingCount = await countTasksOnDate(supabase, userId, dueDate);
    const needed = Math.max(0, targetCount - existingCount);

    if (needed === 0) {
      daySummary.push(`${dueDate}: ${existingCount} already (target ${targetCount})`);
      continue;
    }

    const pickedTasks = shuffle(TASK_POOL).slice(0, needed);
    let dayCreated = 0;

    for (let slot = existingCount; slot < existingCount + needed; slot += 1) {
      const task = pickedTasks[slot - existingCount];
      if (!task) {
        break;
      }

      const created = await insertTask(supabase, userId, dueDate, task, slot);
      if (created) {
        createdCount += 1;
        dayCreated += 1;
      }
    }

    daySummary.push(`${dueDate}: +${dayCreated} (target ${targetCount})`);
  }

  return { createdCount, daySummary };
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  const { createdCount, daySummary } = await seedSeptemberDays(supabase, userId);

  console.log(`Signed in as ${userId}`);
  console.log(`September ${FIRST_DAY}–${LAST_DAY}, ${YEAR}: ${createdCount} task(s) created.`);
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
