import { usePreventRemove } from "expo-router";
import { useState } from "react";

import { confirm } from "@/lib/confirm";

/** Asks before leaving a full-screen form with unsaved edits. */
export function useUnsavedGuard(dirty: boolean) {
  const [allowLeave, setAllowLeave] = useState(false);

  usePreventRemove(dirty && !allowLeave, ({ repeat }) => {
    void confirm({
      title: "Discard changes?",
      message: "Your edits haven't been saved.",
      confirmLabel: "Discard",
    }).then((ok) => {
      if (!ok) return;
      setAllowLeave(true);
      // Defer so preventRemove flips off before the action is retried.
      queueMicrotask(() => repeat());
    });
  });
}
