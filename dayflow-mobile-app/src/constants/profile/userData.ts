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
    color: "#FF7A1A",
    bgColor: "rgba(255, 122, 26, 0.1)",
  },
  {
    id: "completed",
    label: "Completed",
    value: 189,
    icon: "check-circle",
    color: "#14b8a6",
    bgColor: "rgba(20, 184, 166, 0.1)",
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "12 days",
    icon: "flame",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
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
