import { Pressable } from "react-native";

import { cn } from "@/lib/cn";
import { haptics } from "@/lib/haptics";
import { Text } from "@/ui/Text";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function Chip({ label, selected, onPress, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      accessibilityLabel={label}
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      className={cn(
        "min-h-9 flex-row items-center justify-center rounded-full border px-3.5 active:opacity-80",
        selected ? "border-primary bg-primary" : "border-border bg-card",
        className,
      )}
    >
      <Text variant="label" tone={selected ? "inverse" : "default"}>
        {label}
      </Text>
    </Pressable>
  );
}
