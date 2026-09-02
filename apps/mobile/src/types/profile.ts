export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  notifications: boolean;
  soundEnabled: boolean;
  weekStartsOn: "sunday" | "monday";
}

export interface ProfileStat {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
}

export interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: "navigation" | "toggle" | "action";
  iconColor: string;
  iconBgColor: string;
  rightContent?: "arrow" | "switch" | "badge";
  badgeText?: string;
  onPress?: () => void;
}

export interface ProfileSection {
  id: string;
  title: string;
  items: ProfileMenuItem[];
}
