/**
 * Analytics Types
 * Types and interfaces for analytics components
 */

import { Ionicons } from "@expo/vector-icons";

export interface StatItem {
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Icon color */
  iconColor: string;
  /** Background color class for icon container */
  iconBgClass: string;
  /** Label text */
  label: string;
  /** Value to display */
  value: string | number;
  /** Optional value color class */
  valueColorClass?: string;
}

export interface CategoryData {
  /** Category name */
  name: string;
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Number of completed reminders */
  completed: number;
  /** Total reminders in category */
  total: number;
  /** Icon color */
  iconColor: string;
  /** Background color class for icon */
  iconBgClass: string;
}

export interface DayData {
  day: string;
  percentage: number;
}
