import { Pressable, View } from "react-native";

import { Text } from "@/ui/Text";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View className="min-h-9 flex-row items-center justify-between gap-3">
      <Text variant="heading" accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onAction}>
          <Text variant="label" tone="muted" className="underline">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
