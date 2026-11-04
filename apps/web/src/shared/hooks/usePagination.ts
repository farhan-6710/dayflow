import { useState } from "react";

export const LIST_PAGE_SIZE = 7;

/** One page of `items`. Going back to page 1 whenever `resetKey` changes, such as a new search or filter. */
export function usePagination<T>(items: T[], resetKey: string) {
  const [state, setState] = useState({ key: resetKey, page: 1 });
  const totalPages = Math.max(1, Math.ceil(items.length / LIST_PAGE_SIZE));
  const page = Math.min(state.key === resetKey ? state.page : 1, totalPages);
  const start = (page - 1) * LIST_PAGE_SIZE;
  const pageItems = items.slice(start, start + LIST_PAGE_SIZE);

  return {
    page,
    totalPages,
    total: items.length,
    pageItems,
    rangeStart: items.length === 0 ? 0 : start + 1,
    rangeEnd: start + pageItems.length,
    setPage: (next: number) => setState({ key: resetKey, page: next }),
  };
}
