import { useCallback, useEffect, useState } from "react";

type LoadState<T> = {
  loader: () => Promise<T>;
  data: T | null;
  error: string | null;
};

/**
 * Runs `loader` (wrap it in useCallback) and tracks its result. A new loader counts as
 * loading; `reload` refetches while the current data stays on screen.
 */
export function useLoadData<T>(loader: (() => Promise<T>) | null, errorMessage: string) {
  const [state, setState] = useState<LoadState<T> | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!loader) {
      return;
    }
    let active = true;
    loader()
      .then((data) => {
        if (active) {
          setState({ loader, data, error: null });
        }
      })
      .catch((error: unknown) => {
        console.error(errorMessage, error);
        if (active) {
          setState((current) => ({
            loader,
            data: current?.loader === loader ? current.data : null,
            error: errorMessage,
          }));
        }
      });
    return () => {
      active = false;
    };
  }, [loader, reloadCount, errorMessage]);

  const current = state?.loader === loader ? state : null;
  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  const setData = useCallback((update: (data: T) => T) => {
    setState((previous) => (previous?.data != null ? { ...previous, data: update(previous.data) } : previous));
  }, []);

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: !current,
    reload,
    setData,
  };
}
