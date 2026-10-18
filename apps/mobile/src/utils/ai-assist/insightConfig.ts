import { Ionicons } from "@expo/vector-icons";

export type InsightType = "success" | "warning" | "info" | "tip";

export interface InsightConfig {
  colors: [string, string];
  icon: keyof typeof Ionicons.glyphMap;
  bgClass: string;
}

/**
 * Get the configuration for an insight based on its type
 *
 * @param type - The type of insight (success, warning, info, tip)
 * @returns Configuration object with colors, icon, and background class
 *
 * @example
 * const config = getInsightConfig("success");
 * // Returns: { colors: ["#e9bf55", "#d9a93a"], icon: "checkmark-circle", bgClass: "bg-primary/10" }
 */
export const getInsightConfig = (type: InsightType): InsightConfig => {
  switch (type) {
    case "success":
      return {
        colors: ["#4f8a4b", "#e9bf55"],
        icon: "checkmark-circle",
        bgClass: "bg-primary/10 dark:bg-primary/20",
      };
    case "warning":
      return {
        colors: ["#d9a93a", "#e9bf55"],
        icon: "warning",
        bgClass: "bg-amber-100 dark:bg-amber-900/30",
      };
    case "info":
      return {
        colors: ["#3B82F6", "#2563EB"],
        icon: "information-circle",
        bgClass: "bg-blue-100 dark:bg-blue-900/30",
      };
    case "tip":
      return {
        colors: ["#8B5CF6", "#7C3AED"],
        icon: "bulb",
        bgClass: "bg-purple-100 dark:bg-purple-900/30",
      };
  }
};
