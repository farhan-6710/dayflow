import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ErrorState } from "@/ui/ErrorState";

type QueryStateProps<T> = {
  query: UseQueryResult<T>;
  /** Shaped like the real content. */
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
};

/** Every data screen shows its skeleton, then its content, or an error with retry. Cached data stays up during a refetch. */
export function QueryState<T>({ query, skeleton, children }: QueryStateProps<T>) {
  if (query.data !== undefined) return <>{children(query.data)}</>;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;
  return <>{skeleton}</>;
}
