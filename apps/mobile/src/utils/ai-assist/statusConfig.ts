import { Ionicons } from "@expo/vector-icons";

export type AIStatus = "active" | "idle" | "thinking";

export interface AIStatusConfig {
  colors: [string, string, string];
  text: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Get the configuration for AI status display
 *
 * @param status - The current AI status (active, idle, thinking)
 * @returns Configuration object with colors, text, description, and icon
 *
 * @example
 * const config = getAIStatusConfig("active");
 * // Returns: { colors: ["#e9bf55", "#d9a93a", "#f0cf7a"], text: "AI Active", ... }
 */
export const getAIStatusConfig = (status: AIStatus): AIStatusConfig => {
  switch (status) {
    case "active":
      return {
        colors: ["#e9bf55", "#d9a93a", "#f0cf7a"],
        text: "AI Active",
        description: "Ready to assist you",
        icon: "checkmark-circle",
      };
    case "thinking":
      return {
        colors: ["#e9bf55", "#d9a93a", "#f0cf7a"],
        text: "Processing",
        description: "Analyzing your request...",
        icon: "sync",
      };
    case "idle":
    default:
      return {
        colors: ["#6B7280", "#4B5563", "#374151"],
        text: "Idle",
        description: "Waiting for input",
        icon: "pause-circle",
      };
  }
};
