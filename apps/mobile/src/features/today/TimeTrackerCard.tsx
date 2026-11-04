import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pause, Play, RotateCcw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Card } from "@/ui/Card";
import { IconButton } from "@/ui/IconButton";
import { Text } from "@/ui/Text";

const STORAGE_KEY = "dayflow:time-tracker";

type TrackerState = { baseMs: number; startedAt: number | null };

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

/** A compact stopwatch. It counts from stored timestamps, so it stays right after the app is backgrounded or closed. */
export function TimeTrackerCard() {
  const { colors } = useTheme();
  const [state, setState] = useState<TrackerState>({ baseMs: 0, startedAt: null });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) setState(JSON.parse(saved) as TrackerState);
    });
  }, []);

  useEffect(() => {
    if (state.startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state.startedAt]);

  function save(next: TrackerState) {
    setState(next);
    setNow(Date.now());
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const running = state.startedAt !== null;
  const elapsed = state.baseMs + (state.startedAt === null ? 0 : Math.max(0, now - state.startedAt));
  const seconds = Math.floor(elapsed / 1000);
  const display = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;

  return (
    <Card className="flex-row items-center gap-3 py-3">
      <View className="flex-1">
        <Text variant="label" tone="muted">
          Time tracker
        </Text>
        <Text variant="heading" accessibilityLabel={`Elapsed time ${display}`} style={{ fontVariant: ["tabular-nums"] }}>
          {display}
        </Text>
      </View>
      <View className="size-11 items-center justify-center rounded-full bg-primary">
        <IconButton
          icon={running ? Pause : Play}
          label={running ? "Pause timer" : elapsed > 0 ? "Resume timer" : "Start timer"}
          className="bg-transparent"
          iconColor={colors["primary-foreground"]}
          onPress={() => {
            if (running) save({ baseMs: elapsed, startedAt: null });
            else save({ baseMs: state.baseMs, startedAt: Date.now() });
          }}
        />
      </View>
      <IconButton icon={RotateCcw} label="Reset timer" disabled={elapsed === 0} onPress={() => save({ baseMs: 0, startedAt: null })} />
    </Card>
  );
}
