import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/ui/IconButton";
import { Text } from "@/ui/Text";

type ScreenProps = {
  children: ReactNode;
};

/** Full-height page with the status bar inset applied. */
export function Screen({ children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {children}
    </View>
  );
}

type TabHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

/** Large title for a tab's root. */
export function TabHeader({ title, subtitle, right }: TabHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
      <View className="flex-1">
        <Text variant="display" accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

type BackHeaderProps = {
  title?: string;
  right?: ReactNode;
};

/** Back arrow and a compact title for pushed screens. */
export function BackHeader({ title, right }: BackHeaderProps) {
  const router = useRouter();
  return (
    <View className="min-h-12 flex-row items-center gap-1 px-2">
      <IconButton icon={ChevronLeft} label="Back" onPress={() => router.back()} />
      <Text variant="heading" accessibilityRole="header" numberOfLines={1} className="flex-1">
        {title}
      </Text>
      {right}
    </View>
  );
}
