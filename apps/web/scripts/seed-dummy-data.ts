import { createClient } from "@supabase/supabase-js";

const YEAR = 2026;
const MONTH = 8;
const TASK_PRIORITY = "medium";
const TASK_STATUS = "todo";
const TASK_TIME = "10:00 AM";

const PROJECTS = [
  {
    name: "Fitness",
    color_hex: "#10b981",
    notes: [
      {
        title: "Weekly training split",
        body: "Push, pull, legs, and one mobility session. Keep rest days on Thursday and Sunday.",
      },
      {
        title: "Gym checklist",
        body: "Shoes, belt, water bottle, and headphones. Log every set before leaving.",
      },
      {
        title: "Meal prep notes",
        body: "High-protein breakfast, packed lunch, and a simple dinner. No late-night snacks on weekdays.",
      },
      {
        title: "Recovery habits",
        body: "Sleep by 11, stretch after workouts, and walk 8k steps on rest days.",
      },
    ],
  },
  {
    name: "My Learnings",
    color_hex: "#3b82f6",
    notes: [
      {
        title: "Current study focus",
        body: "TypeScript, Postgres, and product thinking. One focused hour before work.",
      },
      {
        title: "Course notes",
        body: "Finish the current module, write a short recap, and save one example in the repo.",
      },
      {
        title: "Reading list",
        body: "One essay, one docs page, and one tutorial. Capture 3 takeaways max.",
      },
      {
        title: "Practice ideas",
        body: "Rebuild a small UI, write a SQL query, and explain the solution out loud.",
      },
    ],
  },
  {
    name: "Office Work",
    color_hex: "#8b5cf6",
    notes: [
      {
        title: "Standup talking points",
        body: "What shipped, what is blocked, and what needs a decision today.",
      },
      {
        title: "Meeting follow-ups",
        body: "Send notes within an hour. Owner, deadline, and next action on each item.",
      },
      {
        title: "Focus work block",
        body: "Protect 90 minutes after lunch. Slack on mute unless tagged.",
      },
      {
        title: "End-of-day wrap",
        body: "Update the tracker, list tomorrow's first task, and close leftover tabs.",
      },
    ],
  },
  {
    name: "Freelance Work",
    color_hex: "#e25505",
    notes: [
      {
        title: "Active clients",
        body: "Keep scope, invoices, and delivery dates in one place. No work without a written brief.",
      },
      {
        title: "Proposal template",
        body: "Problem, approach, timeline, and price. Send the same structure every time.",
      },
      {
        title: "Invoice reminders",
        body: "Invoice on delivery. Follow up at 7 days and 14 days if unpaid.",
      },
      {
        title: "Portfolio updates",
        body: "Screenshot the latest work, write a 4-line case summary, and file it before the next project.",
      },
    ],
  },
] as const;

const DAILY_TASKS = [
  {
    title: "Morning workout",
    description: "Complete today's fitness session and log how it felt.",
  },
  {
    title: "Study block",
    description: "Spend focused time on the current learning topic.",
  },
  {
    title: "Office priorities",
    description: "Clear the top work item and send any needed follow-up.",
  },
  {
    title: "Freelance progress",
    description: "Move one client task forward and update the status.",
  },
] as const;

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"] as const;
const TRAINING_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;
const EVERY_DAY = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const REMINDERS = [
  {
    title: "Stretching & Warm-Up",
    description: "Loosen up for 10 minutes before the workout. Focus on hips, shoulders, and hamstrings.",
    reminder_time: "6:30 AM",
    days_of_week: [...TRAINING_DAYS],
  },
  {
    title: "Morning Workout",
    description: "Complete today's training session and log how it felt before starting work.",
    reminder_time: "7:00 AM",
    days_of_week: [...TRAINING_DAYS],
  },
  {
    title: "Lunch Time",
    description: "Step away from the desk, eat a proper meal, and take a short walk after.",
    reminder_time: "1:00 PM",
    days_of_week: [...EVERY_DAY],
  },
  {
    title: "Log Today's Harmony Work",
    description: "Update Harmony with the office work completed today before wrapping up.",
    reminder_time: "6:00 PM",
    days_of_week: [...WEEKDAYS],
  },
  {
    title: "Dinner Time",
    description: "Sit down for dinner and keep it off screens until the meal is done.",
    reminder_time: "9:00 PM",
    days_of_week: [...EVERY_DAY],
  },
  {
    title: "Close Screens for the Night",
    description: "Shut the laptop and phone. Wind down so sleep can start on time.",
    reminder_time: "11:00 PM",
    days_of_week: [...EVERY_DAY],
  },
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

function daysInMonthUntilToday(year: number, month: number): number {
  const today = new Date();
  const lastDay = new Date(year, month, 0).getDate();

  if (today.getFullYear() === year && today.getMonth() + 1 === month) {
    return Math.min(today.getDate(), lastDay);
  }

  return lastDay;
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

async function findOrCreateProject(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  name: string,
  colorHex: string,
) {
  const existing = await supabase
    .from("projects")
    .select("id, name")
    .eq("user_id", userId)
    .eq("name", name)
    .maybeSingle();

  if (existing.error) {
    throw new Error(`Failed to look up project "${name}": ${existing.error.message}`);
  }

  if (existing.data) {
    return { id: existing.data.id as string, created: false };
  }

  const created = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name,
      color_hex: colorHex,
      is_archived: false,
    })
    .select("id")
    .single();

  if (created.error) {
    throw new Error(`Failed to create project "${name}": ${created.error.message}`);
  }

  return { id: created.data.id as string, created: true };
}

async function seedNotes(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  projectId: string,
  notes: ReadonlyArray<{ title: string; body: string }>,
) {
  let createdCount = 0;

  for (const note of notes) {
    const existing = await supabase
      .from("notes")
      .select("id")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("title", note.title)
      .maybeSingle();

    if (existing.error) {
      throw new Error(`Failed to look up note "${note.title}": ${existing.error.message}`);
    }

    if (existing.data) {
      continue;
    }

    const created = await supabase.from("notes").insert({
      user_id: userId,
      project_id: projectId,
      title: note.title,
      body: note.body,
    });

    if (created.error) {
      throw new Error(`Failed to create note "${note.title}": ${created.error.message}`);
    }

    createdCount += 1;
  }

  return createdCount;
}

async function seedAugustTasks(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const lastDay = daysInMonthUntilToday(YEAR, MONTH);
  let createdCount = 0;

  for (let day = 1; day <= lastDay; day += 1) {
    const dueDate = formatDate(YEAR, MONTH, day);
    const task = DAILY_TASKS[(day - 1) % DAILY_TASKS.length];
    const extraTask = DAILY_TASKS[day % DAILY_TASKS.length];
    const dayTasks = [
      { title: `${task.title} · ${dueDate}`, description: task.description },
      { title: `${extraTask.title} · ${dueDate}`, description: extraTask.description },
    ];

    for (const dayTask of dayTasks) {
      const existing = await supabase
        .from("tasks")
        .select("id")
        .eq("user_id", userId)
        .eq("title", dayTask.title)
        .eq("due_date", dueDate)
        .maybeSingle();

      if (existing.error) {
        throw new Error(`Failed to look up task "${dayTask.title}": ${existing.error.message}`);
      }

      if (existing.data) {
        continue;
      }

      const created = await supabase.from("tasks").insert({
        user_id: userId,
        title: dayTask.title,
        description: dayTask.description,
        status: TASK_STATUS,
        priority: TASK_PRIORITY,
        due_date: dueDate,
        due_time: TASK_TIME,
      });

      if (created.error) {
        throw new Error(`Failed to create task "${dayTask.title}": ${created.error.message}`);
      }

      createdCount += 1;
    }
  }

  return createdCount;
}

async function seedReminders(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  let createdCount = 0;

  for (const reminder of REMINDERS) {
    const existing = await supabase
      .from("reminders")
      .select("id")
      .eq("user_id", userId)
      .eq("title", reminder.title)
      .maybeSingle();

    if (existing.error) {
      throw new Error(`Failed to look up reminder "${reminder.title}": ${existing.error.message}`);
    }

    if (existing.data) {
      continue;
    }

    const created = await supabase.from("reminders").insert({
      user_id: userId,
      title: reminder.title,
      description: reminder.description,
      reminder_time: reminder.reminder_time,
      days_of_week: reminder.days_of_week,
      is_disabled: false,
    });

    if (created.error) {
      throw new Error(`Failed to create reminder "${reminder.title}": ${created.error.message}`);
    }

    createdCount += 1;
  }

  return createdCount;
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  let projectCount = 0;
  let noteCount = 0;

  for (const project of PROJECTS) {
    const result = await findOrCreateProject(
      supabase,
      userId,
      project.name,
      project.color_hex,
    );

    if (result.created) {
      projectCount += 1;
    }

    noteCount += await seedNotes(supabase, userId, result.id, project.notes);
  }

  const taskCount = await seedAugustTasks(supabase, userId);
  const reminderCount = await seedReminders(supabase, userId);

  console.log(`Signed in as ${userId}`);
  console.log(`Projects created: ${projectCount}`);
  console.log(`Notes created: ${noteCount}`);
  console.log(`Tasks created: ${taskCount}`);
  console.log(`Reminders created: ${reminderCount}`);
  console.log("Done. Existing matching rows were skipped.");
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
