import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const YEAR = 2026;
const MONTH = 10;
const FIRST_DAY = 1;
const LAST_DAY = 31;
const MIN_TASKS_PER_DAY = 3;
const MAX_TASKS_PER_DAY = 6;
const TODO_RATIO = 0.08;

const TASK_TIMES = [
  "8:00 AM",
  "10:30 AM",
  "12:00 PM",
  "2:00 PM",
  "4:30 PM",
  "7:00 PM",
  "9:00 PM",
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
] as const;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to apps/web/.env before running.`);
  }
  return value;
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

function pickStatus(): "todo" | "done" {
  return Math.random() < TODO_RATIO ? "todo" : "done";
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

async function getDayTasks(
  supabase: SupabaseClient,
  userId: string,
  dueDate: string,
) {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title")
    .eq("user_id", userId)
    .eq("due_date", dueDate);

  if (error) {
    throw new Error(`Failed to load tasks for ${dueDate}: ${error.message}`);
  }

  return data ?? [];
}

async function main() {
  const supabase = createClient(
    requireEnv("VITE_SUPABASE_URL"),
    requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
  );

  const email = requireEnv("SEED_EMAIL");
  const password = requireEnv("SEED_PASSWORD");
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw new Error(`Sign-in failed: ${authError.message}`);
  const userId = auth.user?.id;
  if (!userId) throw new Error("Sign-in succeeded but no user id was returned.");

  let added = 0;
  let removed = 0;
  let todoCount = 0;

  for (let day = FIRST_DAY; day <= LAST_DAY; day += 1) {
    const dueDate = formatDate(YEAR, MONTH, day);
    let existing = await getDayTasks(supabase, userId, dueDate);

    if (existing.length > MAX_TASKS_PER_DAY) {
      const overflow = shuffle(existing).slice(MAX_TASKS_PER_DAY);
      const overflowIds = overflow.map((task) => task.id);
      const { error } = await supabase.from("tasks").delete().in("id", overflowIds);
      if (error) {
        throw new Error(`Failed to trim tasks on ${dueDate}: ${error.message}`);
      }
      removed += overflow.length;
      existing = existing.filter((task) => !overflowIds.includes(task.id));
      console.log(`  ${dueDate}: trimmed to ${existing.length} (max ${MAX_TASKS_PER_DAY})`);
    }

    const existingTitles = new Set(existing.map((task) => task.title));
    const needed = Math.max(0, MIN_TASKS_PER_DAY - existing.length);

    if (needed === 0) {
      if (existing.length <= MAX_TASKS_PER_DAY) {
        console.log(`  ${dueDate}: ${existing.length} already (ok)`);
      }
      continue;
    }

    const candidates = shuffle(TASK_POOL).filter(
      (task) => !existingTitles.has(task.title),
    );
    const picked = candidates.slice(0, needed);

    for (let slot = 0; slot < picked.length; slot += 1) {
      const task = picked[slot]!;
      const dueTime = TASK_TIMES[(existing.length + slot) % TASK_TIMES.length]!;
      const status = pickStatus();
      const stamp = timestampFromDue(dueDate, dueTime);

      const { error } = await supabase.from("tasks").insert({
        user_id: userId,
        title: task.title,
        description: task.description,
        status,
        priority: "medium",
        due_date: dueDate,
        due_time: dueTime,
        created_at: stamp,
        updated_at: stamp,
      });

      if (error) {
        throw new Error(`Failed to insert "${task.title}" on ${dueDate}: ${error.message}`);
      }

      added += 1;
      if (status === "todo") todoCount += 1;
    }

    console.log(
      `  ${dueDate}: had ${existing.length}, added ${picked.length} → ${existing.length + picked.length}`,
    );
  }

  console.log(`Signed in as ${email} (${userId})`);
  console.log(
    `October ${YEAR}: removed ${removed} over max ${MAX_TASKS_PER_DAY}/day; added ${added} to reach min ${MIN_TASKS_PER_DAY}/day (${todoCount} of those todo).`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
