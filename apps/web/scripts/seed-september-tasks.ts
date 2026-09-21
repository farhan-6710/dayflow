import { createClient } from "@supabase/supabase-js";

const YEAR = 2026;
const MONTH = 9;
const FIRST_DAY = 11;
const LAST_DAY = 30;

const TASK_TIMES = [
  "8:00 AM",
  "10:30 AM",
  "12:00 PM",
  "2:00 PM",
  "4:30 PM",
  "7:00 PM",
] as const;

/** Simple day-to-day wording only. */
const TASK_POOL = [
  { title: "buy milk", description: "pick up milk on the way home" },
  { title: "call mom", description: "quick call just to check in" },
  { title: "water the plants", description: "give them a little water" },
  { title: "take out the trash", description: "bin is full, take it down" },
  { title: "wash clothes", description: "start a load and hang it later" },
  { title: "clean the kitchen", description: "wipe the counters and sink" },
  { title: "go for a walk", description: "short walk outside after lunch" },
  { title: "check emails", description: "reply to the easy ones" },
  { title: "pay the bill", description: "pay whatever is due this week" },
  { title: "cook dinner", description: "make something simple at home" },
  { title: "buy veggies", description: "get some fresh veggies from the shop" },
  { title: "pack lunch", description: "make lunch ready for tomorrow" },
  { title: "tidy the room", description: "put things back where they belong" },
  { title: "charge the laptop", description: "plug it in before it dies" },
  { title: "fill water bottle", description: "keep water nearby today" },
  { title: "stretch a bit", description: "stand up and stretch for a few minutes" },
  { title: "buy bread", description: "grab bread before it runs out" },
  { title: "message a friend", description: "send a short hello" },
  { title: "book a haircut", description: "pick a day and book it" },
  { title: "sort the desk", description: "clear the clutter on the desk" },
  { title: "iron a shirt", description: "get one shirt ready for tomorrow" },
  { title: "feed the cat", description: "put out food and fresh water" },
  { title: "check the fridge", description: "see what needs finishing up" },
  { title: "wash the dishes", description: "do the leftover dishes" },
  { title: "make tea", description: "take a short tea break" },
  { title: "read a bit", description: "read a few pages before bed" },
  { title: "plan tomorrow", description: "write down two or three things to do" },
  { title: "backup photos", description: "save a few photos to the cloud" },
  { title: "buy soap", description: "pick up soap and toothpaste" },
  { title: "open the windows", description: "let some fresh air in" },
  { title: "sweep the floor", description: "quick sweep of the main room" },
  { title: "reply to that text", description: "answer the message you left pending" },
  { title: "change bedsheets", description: "put on clean sheets" },
  { title: "order groceries", description: "order the usual stuff online" },
  { title: "walk to the shop", description: "pick up a few small things" },
  { title: "cut nails", description: "quick trim before they get long" },
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

/** Completion / activity stamp = due date + due time (IST). */
function timestampFromDue(dueDate: string, dueTime: string | null): string {
  const { hour, minute } = to24Hour(dueTime ?? "12:00 PM");
  return `${dueDate}T${pad(hour)}:${pad(minute)}:00+05:30`;
}

/** 1–3 tasks per day. */
function randomTaskCount(): number {
  return 1 + Math.floor(Math.random() * 3);
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
  const title = task.title;

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

  const stamp = timestampFromDue(dueDate, dueTime);
  const status = taskStatusForDate(dueDate);

  const created = await supabase.from("tasks").insert({
    user_id: userId,
    title,
    description: task.description,
    status,
    priority: "medium",
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

type ExistingTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string;
  due_time: string | null;
  updated_at: string;
};

/**
 * DB trigger overwrites updated_at on UPDATE, so we delete + reinsert
 * when the stamp day does not match due_date.
 */
async function alignSeptemberTimestamps(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const start = formatDate(YEAR, MONTH, 1);
  const end = formatDate(YEAR, MONTH, LAST_DAY);

  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, description, status, priority, due_date, due_time, updated_at")
    .eq("user_id", userId)
    .gte("due_date", start)
    .lte("due_date", end);

  if (error) {
    throw new Error(`Failed to load September tasks: ${error.message}`);
  }

  const tasks = (data as ExistingTask[]) ?? [];
  let fixedCount = 0;

  for (const task of tasks) {
    const stamp = timestampFromDue(task.due_date, task.due_time);
    const stampDay = stamp.slice(0, 10);
    const updatedDay = task.updated_at.slice(0, 10);

    if (updatedDay === stampDay) {
      continue;
    }

    const deleted = await supabase.from("tasks").delete().eq("id", task.id);
    if (deleted.error) {
      throw new Error(`Failed to delete task "${task.title}": ${deleted.error.message}`);
    }

    const reinserted = await supabase.from("tasks").insert({
      user_id: userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      due_time: task.due_time,
      created_at: stamp,
      updated_at: stamp,
    });

    if (reinserted.error) {
      throw new Error(`Failed to reinsert task "${task.title}": ${reinserted.error.message}`);
    }

    fixedCount += 1;
  }

  return fixedCount;
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
  const fixedCount = await alignSeptemberTimestamps(supabase, userId);

  console.log(`Signed in as ${userId}`);
  console.log(`September ${FIRST_DAY}–${LAST_DAY}, ${YEAR}: ${createdCount} task(s) created.`);
  console.log(`September timestamps aligned to due date: ${fixedCount} task(s).`);
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
