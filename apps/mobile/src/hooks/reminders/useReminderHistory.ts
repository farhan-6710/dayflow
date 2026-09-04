import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router/react-navigation";
import {
  fetchReminderOccurrences,
  groupOccurrencesByDate,
} from "@services/reminderOccurrencesService";
import type { ReminderHistoryItem, ReminderOccurrence } from "@types";

export function useReminderHistory() {
  const [items, setItems] = useState<ReminderHistoryItem[]>([]);
  const [occurrences, setOccurrences] = useState<ReminderOccurrence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const rows = await fetchReminderOccurrences();
      setOccurrences(rows);
      setItems(groupOccurrencesByDate(rows));
    } catch (error) {
      console.error("[History] Failed to load reminder occurrences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { items, occurrences, loading, refresh: load };
}
