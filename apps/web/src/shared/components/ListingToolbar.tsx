import type { ListingToolbarProps } from "@/shared/types/components";

/** Status tabs with an optional filter opposite, and search on its own row beneath. */
export function ListingToolbar({ tabs, filter, search }: ListingToolbarProps) {
  return (
    <div className="grid min-w-0 gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {tabs}
        {filter}
      </div>
      {search}
    </div>
  );
}
