export function matchesListingSearch(
  query: string,
  fields: Array<string | null | undefined>,
): boolean {
  const needle = query.trim().toLowerCase();
  return !needle || fields.some((field) => (field ?? "").toLowerCase().includes(needle));
}
