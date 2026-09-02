/**
 * AI Assistant Types
 * Types and interfaces for AI assistant components
 */

import { Ionicons } from "@expo/vector-icons";
import { InsightType } from "@utils/ai-assist";

export interface AIInsight {
  /** Insight identifier */
  id: string;
  /** Insight type */
  type: InsightType;
  /** Insight title */
  title: string;
  /** Insight message */
  message: string;
  /** Optional percentage value */
  percentage?: number;
}

export interface QuickAction {
  /** Action identifier */
  id: string;
  /** Display title */
  title: string;
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Gradient colors for the card */
  colors: string[];
  /** Optional description */
  description?: string;
}
