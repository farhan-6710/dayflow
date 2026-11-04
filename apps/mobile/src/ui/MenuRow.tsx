import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

type MenuRowProps = {
  icon: LucideIcon;
  label: string;
  description?: string;
  badge?: number;
  onPress: () => void;
  first?: boolean;
  destructive?: boolean;
};

export function MenuRow({ icon: Icon, label, description, badge, onPress, first, destructive }: MenuRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, ${badge} unread` : label}
      onPress={onPress}
      className={`min-h-14 flex-row items-center gap-3 px-4 py-2.5 active:bg-muted ${first ? "" : "border-t border-border"}`}
    >
      <Icon size={20} color={destructive ? colors.destructive : colors.foreground} />
      <View className="flex-1">
        <Text variant="subheading">{label}</Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View className="min-w-6 items-center rounded-full bg-chart-1 px-1.5 py-0.5">
          <Text variant="caption" className="text-white">
            {badge > 99 ? "99+" : badge}
          </Text>
        </View>
      ) : null}
      {destructive ? null : <ChevronRight size={18} color={colors["muted-foreground"]} />}
    </Pressable>
  );
}
