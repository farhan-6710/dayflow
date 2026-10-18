import type { UserProfile, ProfileStat } from "@types";

export const DUMMY_USER: UserProfile = {
  id: "user_123456",
  name: "Farhan Ahmed",
  email: "farhan@dayflow.app",
  bio: "Building better habits, one reminder at a time 🚀",
  joinedDate: "2024-01-15",
  preferences: {
    theme: "auto",
    notifications: true,
    soundEnabled: true,
    weekStartsOn: "monday",
  },
};

export const PROFILE_STATS: ProfileStat[] = [
  {
    id: "total-reminders",
    label: "Total Reminders",
    value: 247,
    icon: "bell",
    color: "#e9bf55",
    bgColor: "rgba(233, 191, 85, 0.15)",
  },
  {
    id: "completed",
    label: "Completed",
    value: 189,
    icon: "check-circle",
    color: "#4f8a4b",
    bgColor: "rgba(79, 138, 75, 0.15)",
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "12 days",
    icon: "flame",
    color: "#d9a93a",
    bgColor: "rgba(217, 169, 58, 0.15)",
  },
  {
    id: "completion-rate",
    label: "Success Rate",
    value: "76%",
    icon: "trending-up",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
];
