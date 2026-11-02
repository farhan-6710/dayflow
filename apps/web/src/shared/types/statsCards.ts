import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type StatCardTrend = "positive" | "negative";

export type StatCardItem = {
  id: string;
  label: string;
  value: ReactNode;
  description?: string;
  descriptionTooltip?: string;
  delta?: string;
  deltaLabel?: string;
  trend?: StatCardTrend;
  href?: string;
  /** `tone-*` utility that tints the card surface; StatsCards cycles tones by position when omitted. */
  tone?: string;
  icon: LucideIcon;
  /** Optional 3D icon path from DAYFLOW_IMAGES; Lucide icon is the fallback. */
  imageSrc?: string;
};
