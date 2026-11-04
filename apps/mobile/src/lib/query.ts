import { QueryClient, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { haptics } from "@/lib/haptics";
import { showToast } from "@/ui/Toaster";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string" && error.message) {
    return error.message;
  }
  return fallback;
}

type ActionOptions<TResult> = {
  /** Toast shown on success. Omit for silent actions such as reordering. */
  success?: string | ((result: TResult) => string);
  failure: string;
  /** Query key prefixes to refresh afterwards. */
  invalidate?: string[];
  /** Set for forms, which show the error inside the sheet. */
  quietError?: boolean;
  onSuccess?: (result: TResult) => void;
};

/** Every mutation goes through here: disabled-while-pending state, feedback, and refreshed data. */
export function useAction<TArgs = void, TResult = unknown>(
  run: (args: TArgs) => Promise<TResult>,
  { success, failure, invalidate = [], quietError, onSuccess }: ActionOptions<TResult>,
) {
  const client = useQueryClient();
  return useMutation<TResult, Error, TArgs>({
    mutationFn: run,
    onSettled: () => {
      for (const key of invalidate) void client.invalidateQueries({ queryKey: [key] });
    },
    onSuccess: (result) => {
      haptics.success();
      if (success) showToast("success", typeof success === "function" ? success(result) : success);
      onSuccess?.(result);
    },
    onError: (error) => {
      haptics.error();
      if (!quietError) showToast("error", errorMessage(error, failure));
    },
  });
}

/** Pull to refresh for one or more queries. */
export function useRefresh(...queries: Pick<UseQueryResult, "refetch">[]) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(queries.map((query) => query.refetch()));
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, queries);
  return { refreshing, onRefresh };
}
