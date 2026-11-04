import { ScrollView, View } from "react-native";

import { Chip } from "@/ui/Chip";
import { Text } from "@/ui/Text";

export type ChipOption<T extends string> = { value: T; label: string };

type ChipGroupProps<T extends string> = {
  label?: string;
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** One scrolling line rather than wrapping, for filter bars. */
  scroll?: boolean;
};

export function ChipGroup<T extends string>({ label, options, value, onChange, scroll }: ChipGroupProps<T>) {
  const chips = options.map((option) => (
    <Chip key={option.value} label={option.label} selected={option.value === value} onPress={() => onChange(option.value)} />
  ));

  return (
    <View className="gap-1.5">
      {label ? <Text variant="label">{label}</Text> : null}
      {scroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-4">
          {chips}
        </ScrollView>
      ) : (
        <View className="flex-row flex-wrap gap-2">{chips}</View>
      )}
    </View>
  );
}
