import { Clock } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { cn } from "@/lib/cn";
import { parseTimeLabel } from "@/lib/time";
import { formatTimeLabel } from "@/shared/constants/times";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

type TimeFieldProps = {
  label: string;
  /** Display text such as "10:00 AM". */
  value: string | null;
  onChange: (value: string | null) => void;
  clearable?: boolean;
  placeholder?: string;
};

function Cell({ text, selected, onPress, label }: { text: string; selected: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn("h-10 w-12 items-center justify-center rounded-lg", selected && "bg-primary")}
    >
      <Text tone={selected ? "inverse" : "default"}>{text}</Text>
    </Pressable>
  );
}

/** Opens hour, minute and AM or PM strips in place, so it works inside a sheet. */
export function TimeField({ label, value, onChange, clearable, placeholder = "Choose a time" }: TimeFieldProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const parsed = parseTimeLabel(value);
  const hour24 = parsed?.hour ?? 9;
  const minute = parsed?.minute ?? 0;
  const isPm = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  function update(nextHour12: number, nextMinute: number, nextPm: boolean) {
    const next = (nextHour12 % 12) + (nextPm ? 12 : 0);
    onChange(formatTimeLabel(next, nextMinute));
  }

  const minutes = MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort((a, b) => a - b);

  return (
    <View className="gap-1.5">
      <Text variant="label">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ?? "not set"}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        className={cn("h-12 flex-row items-center gap-2.5 rounded-xl border bg-card px-3.5", open ? "border-ring" : "border-input")}
      >
        <Clock size={18} color={colors["muted-foreground"]} />
        <Text tone={value ? "default" : "muted"} className="flex-1">
          {value ?? placeholder}
        </Text>
        {clearable && value ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Clear ${label}`} hitSlop={10} onPress={() => onChange(null)}>
            <Text variant="label" tone="muted" className="underline">
              Clear
            </Text>
          </Pressable>
        ) : null}
      </Pressable>
      {open ? (
        <View className="gap-2 rounded-xl border border-border bg-card p-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {HOURS.map((hour) => (
              <Cell key={hour} text={String(hour)} label={`${hour} o'clock`} selected={Boolean(value) && hour === hour12} onPress={() => update(hour, minute, isPm)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {minutes.map((item) => (
              <Cell key={item} text={`:${String(item).padStart(2, "0")}`} label={`${item} minutes`} selected={Boolean(value) && item === minute} onPress={() => update(hour12, item, isPm)} />
            ))}
          </ScrollView>
          <View className="flex-row gap-1">
            <Cell text="AM" label="AM" selected={Boolean(value) && !isPm} onPress={() => update(hour12, minute, false)} />
            <Cell text="PM" label="PM" selected={Boolean(value) && isPm} onPress={() => update(hour12, minute, true)} />
          </View>
        </View>
      ) : null}
    </View>
  );
}
