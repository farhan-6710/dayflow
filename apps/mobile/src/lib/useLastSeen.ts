import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/**
 * The time this person last opened something, kept on this device. Returns the previous visit's time
 * (null until read, and on a first visit, so nothing shows as new) and records this visit.
 */
export function useLastSeen(key: string): string | null {
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    const storageKey = `dayflow:seen:${key}`;
    void AsyncStorage.getItem(storageKey).then((saved) => {
      setPrevious(saved);
      void AsyncStorage.setItem(storageKey, new Date().toISOString());
    });
  }, [key]);

  return previous;
}
