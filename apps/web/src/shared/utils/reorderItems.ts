type Sortable = { id: string; sort_order: number };

/**
 * Applies a reorder of the visible (possibly filtered) items to the full list.
 * Returns the re-sorted items and the full id order to save.
 */
export function reorderItems<T extends Sortable>(items: T[], visibleOrderedIds: string[]) {
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
  const visible = new Set(visibleOrderedIds);
  let nextVisible = 0;
  const orderedIds = sorted.map((item) =>
    visible.has(item.id) ? (visibleOrderedIds[nextVisible++] ?? item.id) : item.id,
  );
  const positions = new Map(orderedIds.map((id, index) => [id, index + 1]));

  return {
    orderedIds,
    items: sorted
      .map((item) => ({ ...item, sort_order: positions.get(item.id) ?? item.sort_order }))
      .sort((a, b) => a.sort_order - b.sort_order),
  };
}
