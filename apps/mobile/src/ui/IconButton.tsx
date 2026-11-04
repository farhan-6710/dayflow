import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  badge?: number;
  disabled?: boolean;
  className?: string;
};

export function IconButton({ icon: Icon, label, onPress, badge, disabled, className }: IconButtonProps) {
  const { colors } = useTheme();
  const hasBadge = Boolean(badge && badge > 0);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hasBadge ? `${label}, ${badge} unread` : label}
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      className={cn("size-11 items-center justify-center rounded-full active:bg-muted", disabled && "opacity-50", className)}
    >
      <Icon size={22} color={colors.foreground} />
      {hasBadge ? (
        <View className="absolute right-0.5 top-0.5 min-w-[18px] items-center rounded-full bg-chart-1 px-1">
          <Text variant="caption" className="text-[11px] leading-[18px] text-white">
            {(badge ?? 0) > 99 ? "99+" : badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
