import { AIInsight } from "@types";

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: "1",
    type: "success",
    title: "Excellent Progress!",
    message:
      "You've completed 95% of your morning routine this week. Keep up the great work!",
    percentage: 95,
  },
  {
    id: "2",
    type: "tip",
    title: "Productivity Tip",
    message:
      "Your focus is highest between 9-11 AM. Schedule important tasks during this time.",
  },
  {
    id: "3",
    type: "warning",
    title: "Reminder",
    message:
      "You've missed 3 evening reminders this week. Consider adjusting the timing.",
    percentage: 60,
  },
  {
    id: "4",
    type: "info",
    title: "Weekly Insight",
    message:
      "You're most consistent with Health & Fitness tasks. Great job maintaining this habit!",
  },
];
