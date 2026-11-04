import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

type StatTileProps = {
  label: string;
  value: string | number;
  caption?: string;
  /** e.g. "+2 vs last week". */
  trend?: { label: string; good: boolean };
  icon: LucideIcon;
  onPress?: () => void;
};

export function StatTile({ label, value, caption, trend, icon: Icon, onPress }: StatTileProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${label}: ${value}`}
      disabled={!onPress}
      onPress={onPress}
      className="flex-1 basis-[44%] gap-1 rounded-2xl border border-border bg-card p-3.5 shadow-sm active:opacity-80"
    >
      <View className="flex-row items-start justify-between gap-2">
        <Text variant="label" tone="muted" numberOfLines={2} className="flex-1">
          {label}
        </Text>
        <View className="size-8 items-center justify-center rounded-lg bg-muted">
          <Icon size={16} color={colors.foreground} />
        </View>
      </View>
      <Text variant="stat" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} className="text-[24px] leading-8">
        {value}
      </Text>
      {trend ? (
        <View className="self-start rounded-full bg-muted px-2 py-0.5">
          <Text variant="caption" tone={trend.good ? "success" : "default"}>
            {trend.label}
          </Text>
        </View>
      ) : null}
      {caption ? (
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </Pressable>
  );
}
