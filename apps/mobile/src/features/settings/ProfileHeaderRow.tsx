import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { Avatar } from "@/ui/Avatar";
import { Text } from "@/ui/Text";

export function ProfileHeaderRow({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  const { user, displayName, initials, avatarUrl } = useAuth();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Your profile, ${displayName}`} onPress={onPress} className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm active:opacity-80">
      <Avatar uri={avatarUrl} initials={initials} size={52} />
      <View className="flex-1">
        <Text variant="heading" numberOfLines={1}>
          {displayName}
        </Text>
        <Text variant="label" tone="muted" numberOfLines={1}>
          {user?.email}
        </Text>
      </View>
      <ChevronRight size={18} color={colors["muted-foreground"]} />
    </Pressable>
  );
}
