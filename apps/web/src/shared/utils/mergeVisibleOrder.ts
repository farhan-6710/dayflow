/** Merge a reordered visible subset back into the full ordered id list. */
export function mergeVisibleOrder(
  fullOrderedIds: string[],
  visibleOrderedIds: string[],
): string[] {
  const visibleSet = new Set(visibleOrderedIds);
  let index = 0;
  return fullOrderedIds.map((id) =>
    visibleSet.has(id) ? (visibleOrderedIds[index++] ?? id) : id,
  );
}
