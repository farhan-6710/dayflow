import { View } from "react-native";

import { cn } from "@/lib/cn";
import { Text } from "@/ui/Text";

const DOTS = {
  muted: "bg-muted-foreground",
  progress: "bg-chart-1",
  success: "bg-success",
  destructive: "bg-destructive",
} as const;

export type PillTone = keyof typeof DOTS;

export function StatusPill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-muted px-2.5 py-1">
      <View className={cn("size-1.5 rounded-full", DOTS[tone])} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}
