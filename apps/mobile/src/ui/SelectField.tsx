import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { cn } from "@/lib/cn";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
};

/** A list that opens in place, so it works inside a sheet. For long lists; use ChipGroup for a handful of options. */
export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value);

  return (
    <View className="gap-1.5">
      <Text variant="label">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current?.label ?? "not set"}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((state) => !state)}
        className={cn("h-12 flex-row items-center gap-2.5 rounded-xl border bg-card px-3.5", open ? "border-ring" : "border-input")}
      >
        <Text numberOfLines={1} className="flex-1">
          {current?.label ?? "Choose"}
        </Text>
        <ChevronDown size={18} color={colors["muted-foreground"]} />
      </Pressable>
      {open ? (
        <View className="overflow-hidden rounded-xl border border-border bg-card" style={{ maxHeight: 240 }}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {options.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: option.value === value }}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="min-h-11 flex-row items-center justify-between gap-2 border-b border-border px-3.5 py-2.5 active:bg-muted"
              >
                <Text numberOfLines={1} className="flex-1">
                  {option.label}
                </Text>
                {option.value === value ? <Check size={18} color={colors.foreground} /> : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
