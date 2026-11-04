import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useBlocker } from "react-router";

import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { UnsavedChangesModal } from "@/shared/unsaved-changes/UnsavedChangesModal";
import { UnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";
import type {
  UnsavedChangesConfirmOptions,
  UnsavedChangesRegistration,
} from "@/shared/unsaved-changes/types";
import { isDesktopApp } from "@/shared/utils/platform";

const DEFAULT_TITLE = "Unsaved changes";
const DEFAULT_DESCRIPTION =
  "You have changes that haven't been saved. Save before leaving, or close without saving.";

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<Record<string, UnsavedChangesRegistration>>({});
  const [requested, setRequested] = useState<UnsavedChangesConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const dirtyRegistrations = useMemo(
    () => Object.values(registrations).filter((registration) => registration.isDirty),
    [registrations],
  );
  const isDirty = dirtyRegistrations.length > 0;

  const dirtyRef = useRef(dirtyRegistrations);
  useLayoutEffect(() => {
    dirtyRef.current = dirtyRegistrations;
  }, [dirtyRegistrations]);

  /** Lets a confirmed leave finish without re-triggering the route blocker while still dirty. */
  const allowLeaveRef = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirtyRef.current.length > 0 &&
      !allowLeaveRef.current &&
      currentLocation.pathname + currentLocation.search !==
        nextLocation.pathname + nextLocation.search,
  );

  // A blocked route change opens the modal just like an explicit request.
  const pending: UnsavedChangesConfirmOptions | null =
    requested ??
    (blocker.state === "blocked" ? { proceed: () => blocker.proceed() } : null);

  const proceedWithLeave = useCallback(async (proceed: UnsavedChangesConfirmOptions["proceed"]) => {
    allowLeaveRef.current = true;
    try {
      await proceed();
    } finally {
      window.setTimeout(() => {
        allowLeaveRef.current = false;
      }, 500);
    }
  }, []);

  const register = useCallback((registration: UnsavedChangesRegistration) => {
    setRegistrations((previous) => ({ ...previous, [registration.id]: registration }));
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistrations((previous) => {
      if (!(id in previous)) {
        return previous;
      }
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }, []);

  const confirmIfDirty = useCallback((options: UnsavedChangesConfirmOptions) => {
    if (dirtyRef.current.length === 0) {
      void options.proceed();
    } else {
      setRequested(options);
    }
  }, []);

  function handleKeepEditing() {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
    setRequested(null);
  }

  function handleDiscard() {
    if (pending) {
      setRequested(null);
      void proceedWithLeave(pending.proceed);
    }
  }

  async function handleSave() {
    if (!pending) {
      return;
    }
    setLoading(true);
    try {
      for (const registration of dirtyRef.current) {
        await registration.onSave();
      }
      setRequested(null);
      await proceedWithLeave(pending.proceed);
    } catch {
      // Keep the modal open to retry or discard. The form's save shows its own toast.
    } finally {
      setLoading(false);
    }
  }

  // Browser tab close or refresh: only the native prompt is possible here.
  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (dirtyRef.current.length > 0 && !allowLeaveRef.current) {
        event.preventDefault();
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // Desktop app window close: intercept and show the same unsaved modal.
  useEffect(() => {
    if (!isDesktopApp()) {
      return;
    }

    let unlisten: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        const currentWindow = getCurrentWindow();
        unlisten = await currentWindow.onCloseRequested(async (event) => {
          if (dirtyRef.current.length === 0 || allowLeaveRef.current) {
            return;
          }
          event.preventDefault();
          setRequested({
            title: DEFAULT_TITLE,
            description: `You have changes that haven't been saved. Save before closing ${BRAND_NAME}, or close without saving.`,
            proceed: async () => {
              await currentWindow.destroy();
            },
          });
        });
        if (cancelled) {
          unlisten();
        }
      } catch {
        /* window API unavailable outside a built desktop shell */
      }
    })();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, []);

  const value = useMemo(
    () => ({ isDirty, register, unregister, confirmIfDirty, leaveWithoutPrompt: proceedWithLeave }),
    [isDirty, register, unregister, confirmIfDirty, proceedWithLeave],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <UnsavedChangesModal
        open={pending !== null}
        title={pending?.title ?? DEFAULT_TITLE}
        description={pending?.description ?? DEFAULT_DESCRIPTION}
        saveLabel={dirtyRegistrations.some((registration) => registration.isCreate) ? "Create" : "Save"}
        loading={loading}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleDiscard}
        onSave={() => void handleSave()}
      />
    </UnsavedChangesContext.Provider>
  );
}
