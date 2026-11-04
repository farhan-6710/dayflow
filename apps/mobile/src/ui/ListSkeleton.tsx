import { View } from "react-native";

import { Skeleton } from "@/ui/Skeleton";

/** Placeholder rows shaped like a card list. */
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View accessibilityLabel="Loading" className="gap-3">
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Skeleton className="size-10 rounded-xl" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </View>
        </View>
      ))}
    </View>
  );
}
