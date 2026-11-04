import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { confirm } from "@/lib/confirm";

/** Asks before leaving a full-screen form with unsaved edits. */
export function useUnsavedGuard(dirty: boolean) {
  const navigation = useNavigation();

  useEffect(() => {
    if (!dirty) return;
    return navigation.addListener("beforeRemove", (event) => {
      event.preventDefault();
      void confirm({ title: "Discard changes?", message: "Your edits haven't been saved.", confirmLabel: "Discard" }).then((ok) => {
        if (ok) navigation.dispatch(event.data.action);
      });
    });
  }, [dirty, navigation]);
}
