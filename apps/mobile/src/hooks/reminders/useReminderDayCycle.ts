import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@redux/store";
import { getRemindersRequest } from "@redux/slices/remindersSlice";
import { useAuth } from "@providers/AuthProvider";
import {
  hasReminderTimePassed,
  msUntilNextMidnight,
  repeatsOn,
} from "@utils/reminderDay";

/**
 * Marks missed reminders as time passes, and resets done/missed to upcoming
 * at local midnight. Runs on login, foreground, midnight, and every 30s
 * while the app is active.
 */
export function useReminderDayCycle() {
  const dispatch = useDispatch<AppDispatch>();
  const { session } = useAuth();
  const reminders = useSelector(
    (state: RootState) => state.reminders.reminders,
  );
  const remindersRef = useRef(reminders);
  remindersRef.current = reminders;

  useEffect(() => {
    if (!session) return;

    const refresh = () => {
      dispatch(getRemindersRequest());
    };

    const appState = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        refresh();
      }
    });

    let midnightTimer: ReturnType<typeof setTimeout>;
    const armMidnightReset = () => {
      midnightTimer = setTimeout(() => {
        refresh();
        armMidnightReset();
      }, msUntilNextMidnight());
    };
    armMidnightReset();

    const interval = setInterval(() => {
      if (AppState.currentState !== "active") return;
      const now = new Date();
      const shouldMarkMissed = remindersRef.current.some(
        (reminder) =>
          reminder.status === "upcoming" &&
          repeatsOn(reminder, now) &&
          hasReminderTimePassed(reminder, now),
      );
      if (shouldMarkMissed) {
        refresh();
      }
    }, 30_000);

    return () => {
      appState.remove();
      clearTimeout(midnightTimer);
      clearInterval(interval);
    };
  }, [dispatch, session]);
}
