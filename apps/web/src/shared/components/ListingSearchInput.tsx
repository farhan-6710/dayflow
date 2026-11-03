import { Search } from "lucide-react";

import type { ListingSearchInputProps } from "@/shared/types/components";
import { Input } from "@/shared/ui/input";

export function ListingSearchInput({ value, onChange, placeholder, disabled = false }: ListingSearchInputProps) {
  return (
    <div className="relative w-full sm:w-56">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
        className="h-10 bg-background pl-9"
      />
    </div>
  );
}
