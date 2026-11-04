import { createClient } from "@supabase/supabase-js";

import { DEMO_ACCOUNT } from "../src/shared/auth/constants/demoAccount";

const TIME_ZONE = "Asia/Kolkata";
const MIN_TASKS_PER_DAY = 2;
const MAX_TASKS_PER_DAY = 8;

const TASK_TIMES = [
  "8:00 AM",
  "9:30 AM",
  "11:00 AM",
  "12:30 PM",
  "2:00 PM",
  "4:00 PM",
  "6:30 PM",
  "8:00 PM",
] as const;

const TASK_POOL = [
  { title: "buy milk", description: "pick up milk on the way home" },
  { title: "call mom", description: "quick call just to check in" },
  { title: "water the plants", description: "give them a little water" },
  { title: "take out the trash", description: "bin is full, take it down" },
  { title: "wash clothes", description: "start a load and hang it later" },
  { title: "clean the kitchen", description: "wipe the counters and sink" },
  { title: "go for a walk", description: "short walk outside after lunch" },
  { title: "check emails", description: "reply to the easy ones" },
  { title: "cook dinner", description: "make something simple at home" },
  { title: "buy veggies", description: "get some fresh veggies from the shop" },
  { title: "pack lunch", description: "make lunch ready for tomorrow" },
  { title: "tidy the room", description: "put things back where they belong" },
  { title: "charge the laptop", description: "plug it in before it dies" },
  { title: "fill water bottle", description: "keep water nearby today" },
  { title: "stretch a bit", description: "stand up and stretch for a few minutes" },
  { title: "buy bread", description: "grab bread before it runs out" },
  { title: "message a friend", description: "send a short hello" },
  { title: "sort the desk", description: "clear the clutter on the desk" },
  { title: "wash the dishes", description: "do the leftover dishes" },
  { title: "make tea", description: "take a short tea break" },
  { title: "read a bit", description: "read a few pages before bed" },
  { title: "plan tomorrow", description: "write down two or three things to do" },
  { title: "buy soap", description: "pick up soap and toothpaste" },
  { title: "open the windows", description: "let some fresh air in" },
  { title: "sweep the floor", description: "quick sweep of the main room" },
  { title: "reply to that text", description: "answer the message you left pending" },
  { title: "change bedsheets", description: "put on clean sheets" },
  { title: "order groceries", description: "order the usual stuff online" },
  { title: "walk to the shop", description: "pick up a few small things" },
  { title: "iron a shirt", description: "get one shirt ready for tomorrow" },
  { title: "check the fridge", description: "see what needs finishing up" },
  { title: "fold laundry", description: "fold the dry clothes and put them away" },
  { title: "wipe the table", description: "clear crumbs and wipe it down" },
  { title: "pay that bill", description: "settle the small bill sitting on the desk" },
  { title: "buy eggs", description: "grab a tray before breakfast runs out" },
] as const;

function requireEnv(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  throw new Error(`Missing ${names.join(" or ")}. Add it to apps/web/.env before running.`);
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

function currentYearMonth(): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  if (!year || !month) throw new Error("Could not read the current month in Asia/Kolkata.");
  return { year, month };
}

function resolveTargetMonth(): { year: number; month: number; days: number } {
  const now = currentYearMonth();
  const year = Number(process.env.SEED_YEAR?.trim() || now.year);
  const month = Number(process.env.SEED_MONTH?.trim() || now.month);
  if (!Number.isInteger(year) || year < 2020 || year > 2100) {
    throw new Error(`SEED_YEAR must be a year, got "${process.env.SEED_YEAR}".`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`SEED_MONTH must be 1–12, got "${process.env.SEED_MONTH}".`);
  }
  const days = daysInMonth(year, month);
  if (days < 28 || days > 31) throw new Error(`Unexpected length ${days} for ${year}-${pad(month)}.`);
  return { year, month, days };
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function dayBounds(year: number, month: number, day: number): { min: number; max: number } {
  const weekday = new Date(year, month - 1, day).getDay();
  const weekend = weekday === 0 || weekday === 6;
  return weekend
    ? { min: MIN_TASKS_PER_DAY, max: 5 }
    : { min: 3, max: MAX_TASKS_PER_DAY };
}

/** Random 2–8 per day, weekends quieter, no flat runs, enough range for the chart. */
function countsForMonth(year: number, month: number, days: number): number[] {
  const counts: number[] = [];
  for (let day = 1; day <= days; day += 1) {
    const { min, max } = dayBounds(year, month, day);
    let count = randomInt(min, max);
    const previous = counts.at(-1);
    if (previous === count) count = count >= max ? count - 1 : count + 1;
    if (counts.at(-2) === previous && previous === count) {
      count = Math.min(max, Math.max(min, count + 2));
    }
    counts.push(Math.min(max, Math.max(min, count)));
  }
  if (Math.max(...counts) - Math.min(...counts) < 4) {
    counts[Math.max(0, Math.floor(days / 3) - 1)] = MAX_TASKS_PER_DAY;
    counts[Math.min(days - 1, Math.floor((2 * days) / 3))] = MIN_TASKS_PER_DAY;
  }
  return counts;
}

function to24Hour(time: string): { hour: number; minute: number } {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hour: 12, minute: 0 };
  let hour = Number.parseInt(match[1]!, 10);
  const minute = Number.parseInt(match[2]!, 10);
  const period = match[3]!.toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

function timestampFromDue(dueDate: string, dueTime: string): string {
  const { hour, minute } = to24Hour(dueTime);
  return `${dueDate}T${pad(hour)}:${pad(minute)}:00+05:30`;
}

async function main() {
  if (TASK_POOL.length < MAX_TASKS_PER_DAY || TASK_TIMES.length < MAX_TASKS_PER_DAY) {
    throw new Error("Task pool / times must cover MAX_TASKS_PER_DAY unique items.");
  }

  const { year, month, days } = resolveTargetMonth();
  const supabase = createClient(
    requireEnv("VITE_SUPABASE_URL"),
    requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
  );

  const email = requireEnv("SEED_EMAIL", "EMAIL").toLowerCase();
  const password = requireEnv("SEED_PASSWORD", "PASSWORD");
  if (email !== DEMO_ACCOUNT.email.toLowerCase()) {
    throw new Error(`Refusing to seed ${email}. This script is only for ${DEMO_ACCOUNT.email}.`);
  }

  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: DEMO_ACCOUNT.email,
    password,
  });
  if (authError) throw new Error(`Sign-in failed: ${authError.message}`);
  const userId = auth.user?.id;
  if (!userId) throw new Error("Sign-in succeeded but no user id was returned.");

  const monthStart = formatDate(year, month, 1);
  const monthEnd = formatDate(year, month, days);
  const { error: deleteError, count: deleted } = await supabase
    .from("tasks")
    .delete({ count: "exact" })
    .eq("user_id", userId)
    .gte("due_date", monthStart)
    .lte("due_date", monthEnd);
  if (deleteError) throw new Error(`Failed to delete ${monthStart}–${monthEnd} tasks: ${deleteError.message}`);

  const dailyCounts = countsForMonth(year, month, days);
  let added = 0;

  for (let day = 1; day <= days; day += 1) {
    const dueDate = formatDate(year, month, day);
    const count = dailyCounts[day - 1] ?? MIN_TASKS_PER_DAY;
    const picked = shuffle(TASK_POOL).slice(0, count);
    const times = shuffle(TASK_TIMES);
    const rows = picked.map((task, slot) => {
      const dueTime = times[slot]!;
      const stamp = timestampFromDue(dueDate, dueTime);
      return {
        user_id: userId,
        title: task.title,
        description: task.description,
        status: "done" as const,
        priority: "medium" as const,
        due_date: dueDate,
        due_time: dueTime,
        sort_order: slot + 1,
        created_at: stamp,
        updated_at: stamp,
      };
    });

    const { error } = await supabase.from("tasks").insert(rows);
    if (error) throw new Error(`Failed to insert tasks for ${dueDate}: ${error.message}`);
    added += rows.length;
    console.log(`  ${dueDate}: ${rows.length} tasks`);
  }

  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  console.log(`Signed in as ${DEMO_ACCOUNT.email} (${userId})`);
  console.log(`${monthLabel}: deleted ${deleted ?? 0}, inserted ${added} done tasks (${days} days).`);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
