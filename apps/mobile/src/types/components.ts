/**
 * Component Props Types
 * Shared props interfaces for reusable components
 */

import { ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface IconBadgeProps {
  /** Icon name from Ionicons */
  iconName: keyof typeof Ionicons.glyphMap;
  /** Icon size */
  size?: number;
  /** Icon color */
  color: string;
  /** Background color variant */
  variant?: "blue" | "slate" | "green" | "amber" | "red";
  /** Custom className for additional styling */
  className?: string;
}

export interface FormActionsProps extends ViewProps {
  /** Child components (typically Button components) */
  children: React.ReactNode;
  /** Spacing between buttons */
  spacing?: "small" | "medium" | "large";
  /** Custom className for additional styling */
  className?: string;
}

export interface BottomSheetRef {
  /** Open the bottom sheet */
  open: () => void;
  /** Close the bottom sheet */
  close: () => void;
}

export type NavItem = {
  id: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  label?: string;
  onClick?: () => void;
};

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  containerStyle?: object;
  limelightStyle?: object;
  iconContainerStyle?: object;
  iconStyle?: object;
  backgroundColor?: string;
  primaryColor?: string;
  iconSize?: number;
};
