import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface IconProps {
  color: string;
}

export const icons: Record<string, (props: IconProps) => React.ReactElement> = {
  index: (props: IconProps) => <Ionicons name="home" size={20} {...props} />,
  history: (props: IconProps) => (
    <Ionicons name="calendar-outline" size={20} {...props} />
  ),
  "ai-assist": (props: IconProps) => (
    <Ionicons name="sparkles" size={20} {...props} />
  ),
  analytics: (props: IconProps) => (
    <Ionicons name="stats-chart" size={20} {...props} />
  ),
  profile: (props: IconProps) => (
    <Ionicons name="person" size={20} {...props} />
  ),
};
