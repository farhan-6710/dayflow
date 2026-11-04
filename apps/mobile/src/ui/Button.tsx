import type { LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Pressable, View } from "react-native";

import { cn } from "@/lib/cn";
import { haptics } from "@/lib/haptics";
import { useTheme, type ThemeColors } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

const VARIANTS: Record<
  "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success",
  { box: string; text: string; color: keyof ThemeColors }
> = {
  primary: { box: "bg-primary", text: "text-primary-foreground", color: "primary-foreground" },
  secondary: { box: "bg-secondary", text: "text-secondary-foreground", color: "secondary-foreground" },
  outline: { box: "border border-border bg-card", text: "text-foreground", color: "foreground" },
  ghost: { box: "", text: "text-foreground", color: "foreground" },
  destructive: { box: "bg-destructive", text: "text-destructive-foreground", color: "destructive-foreground" },
  success: { box: "bg-success", text: "text-success-foreground", color: "success-foreground" },
};

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: keyof typeof VARIANTS;
  size?: "md" | "sm";
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading,
  disabled,
  className,
}: ButtonProps) {
  const { colors } = useTheme();
  const style = VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(inactive), busy: Boolean(loading) }}
      disabled={inactive}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-xl active:opacity-80",
        size === "md" ? "min-h-12 px-5" : "min-h-10 px-4",
        style.box,
        inactive && "opacity-60",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors[style.color]} />
      ) : Icon ? (
        <View>
          <Icon size={18} color={colors[style.color]} />
        </View>
      ) : null}
      <Text variant={size === "md" ? "subheading" : "label"} className={style.text}>
        {label}
      </Text>
    </Pressable>
  );
}
