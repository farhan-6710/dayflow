import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useBlocker } from "react-router";

import { isDesktopApp } from "@/shared/utils/platform";
import { UnsavedChangesModal } from "@/shared/unsaved-changes/UnsavedChangesModal";
import { UnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";
import type {
  UnsavedChangesConfirmOptions,
  UnsavedChangesRegistration,
} from "@/shared/unsaved-changes/types";

type PendingLeave = {
  proceed: () => void | Promise<void>;
  title?: string;
  description?: string;
};

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<
    Record<string, UnsavedChangesRegistration>
  >({});
  const [pending, setPending] = useState<PendingLeave | null>(null);
  const [loading, setLoading] = useState(false);

  const registrationsRef = useRef(registrations);
  registrationsRef.current = registrations;

  const dirtyRegs = useMemo(
    () => Object.values(registrations).filter((reg) => reg.isDirty),
    [registrations],
  );
  const isDirty = dirtyRegs.length > 0;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;
  /** Lets confirmed leave/save proceed without re-triggering the route blocker. */
  const allowLeaveRef = useRef(false);

  const isCreateFlow = dirtyRegs.some((reg) => reg.isCreate);
  const saveLabel = isCreateFlow ? "Create" : "Save";

  const runProceed = useCallback(async (proceed: () => void | Promise<void>) => {
    allowLeaveRef.current = true;
    try {
      await proceed();
    } finally {
      // Keep bypass briefly so navigate/unmount can finish while still dirty.
      window.setTimeout(() => {
        allowLeaveRef.current = false;
      }, 500);
    }
  }, []);

  const register = useCallback((registration: UnsavedChangesRegistration) => {
    setRegistrations((prev) => ({
      ...prev,
      [registration.id]: registration,
    }));
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistrations((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const confirmIfDirty = useCallback(
    (options: UnsavedChangesConfirmOptions) => {
      const currentDirty = Object.values(registrationsRef.current).some(
        (reg) => reg.isDirty,
      );
      if (!currentDirty) {
        void options.proceed();
        return;
      }
      setPending(options);
    },
    [],
  );

  const clearPending = useCallback(() => {
    setPending(null);
    setLoading(false);
  }, []);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !allowLeaveRef.current &&
      currentLocation.pathname + currentLocation.search !==
        nextLocation.pathname + nextLocation.search,
  );

  const handleKeepEditing = useCallback(() => {
    if (loading) return;
    if (blocker.state === "blocked") {
      blocker.reset?.();
    }
    clearPending();
  }, [blocker, clearPending, loading]);

  const handleDiscard = useCallback(() => {
    if (loading || !pending) return;
    const proceed = pending.proceed;
    clearPending();
    void runProceed(proceed);
  }, [clearPending, loading, pending, runProceed]);

  const handleSave = useCallback(async () => {
    if (loading || !pending) return;
    const proceed = pending.proceed;
    const toSave = Object.values(registrationsRef.current).filter(
      (reg) => reg.isDirty,
    );

    setLoading(true);
    try {
      for (const reg of toSave) {
        await reg.onSave();
      }
      clearPending();
      await runProceed(proceed);
    } catch {
      // Keep modal open so the user can retry or discard. Toast is handled by save.
      setLoading(false);
    }
  }, [clearPending, loading, pending, runProceed]);

  // Browser tab / refresh close — native prompt only (no custom Save button).
  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirtyRef.current || allowLeaveRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // In-app route changes (back button, <Link>, navigate).
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    setPending((current) => {
      if (current) return current;
      return {
        proceed: () => {
          allowLeaveRef.current = true;
          blocker.proceed?.();
          window.setTimeout(() => {
            allowLeaveRef.current = false;
          }, 500);
        },
        title: "Unsaved changes",
        description:
          "You have changes that haven’t been saved. Save before leaving, or close without saving.",
      };
    });
  }, [blocker]);

  // Desktop app window close.
  useEffect(() => {
    if (!isDesktopApp()) return;

    let unlisten: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        const currentWindow = getCurrentWindow();
        unlisten = await currentWindow.onCloseRequested(async (event) => {
          if (!isDirtyRef.current || allowLeaveRef.current) return;
          event.preventDefault();
          setPending({
            title: "Unsaved changes",
            description:
              "You have changes that haven’t been saved. Save before closing DayFlow, or close without saving.",
            proceed: async () => {
              await currentWindow.destroy();
            },
          });
        });
        if (cancelled) unlisten();
      } catch (error) {
        console.error("Failed to bind desktop close guard", error);
      }
    })();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      isDirty,
      register,
      unregister,
      confirmIfDirty,
    }),
    [confirmIfDirty, isDirty, register, unregister],
  );

  const modalOpen = pending !== null;
  const modalTitle = pending?.title ?? "Unsaved changes";
  const modalDescription =
    pending?.description ??
    "You have changes that haven’t been saved. Save your work, or close without saving.";

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <UnsavedChangesModal
        open={modalOpen}
        title={modalTitle}
        description={modalDescription}
        saveLabel={saveLabel}
        loading={loading}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscard}
        onSave={() => void handleSave()}
      />
    </UnsavedChangesContext.Provider>
  );
}
