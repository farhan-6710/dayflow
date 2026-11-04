import { createClient } from "@supabase/supabase-js";

const YEAR = 2026;
const MONTH = 11;
const FIRST_DAY = 1;
const LAST_DAY = 30;

/** Chosen so the completion chart has peaks (7–8) and dips (2–3), not a flat line. */
const TASKS_PER_DAY = [
  4, 7, 8, 3, 6, 7, 2, 3, 8, 5, 6, 2, 8, 4, 3, 7, 6, 8, 3, 5, 2, 4, 8, 6, 3, 7, 5, 2, 3, 6,
] as const;

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

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
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
  const supabase = createClient(
    requireEnv("VITE_SUPABASE_URL"),
    requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
  );

  const email = requireEnv("SEED_EMAIL", "EMAIL");
  const password = requireEnv("SEED_PASSWORD", "PASSWORD");
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw new Error(`Sign-in failed: ${authError.message}`);
  const userId = auth.user?.id;
  if (!userId) throw new Error("Sign-in succeeded but no user id was returned.");
  if (email !== "dayflow.demo@gmail.com") {
    throw new Error(`Refusing to seed ${email}. This script is only for dayflow.demo@gmail.com.`);
  }

  const monthStart = formatDate(YEAR, MONTH, FIRST_DAY);
  const monthEnd = formatDate(YEAR, MONTH, LAST_DAY);
  const { error: deleteError, count: deleted } = await supabase
    .from("tasks")
    .delete({ count: "exact" })
    .eq("user_id", userId)
    .gte("due_date", monthStart)
    .lte("due_date", monthEnd);

  if (deleteError) {
    throw new Error(`Failed to delete November tasks: ${deleteError.message}`);
  }

  let added = 0;

  for (let day = FIRST_DAY; day <= LAST_DAY; day += 1) {
    const dueDate = formatDate(YEAR, MONTH, day);
    const count = TASKS_PER_DAY[day - 1] ?? 4;
    const picked = shuffle(TASK_POOL).slice(0, count);
    const times = shuffle(TASK_TIMES);

    const rows = picked.map((task, slot) => {
      const dueTime = times[slot % times.length]!;
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
    if (error) {
      throw new Error(`Failed to insert tasks for ${dueDate}: ${error.message}`);
    }

    added += rows.length;
    console.log(`  ${dueDate}: ${rows.length} tasks`);
  }

  console.log(`Signed in as ${email} (${userId})`);
  console.log(`November ${YEAR}: deleted ${deleted ?? 0}, inserted ${added} done tasks.`);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
