import { format } from "date-fns";
import { useRouter } from "expo-router";
import { CalendarDays, Settings } from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { Avatar } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { BackHeader, Screen } from "@/ui/Screen";
import { Text } from "@/ui/Text";

type ProfileViewProps = {
  roleLabel: string;
  settingsPath: "/settings" | "/client/settings";
  /** Stats for this role. */
  children: ReactNode;
};

export function ProfileView({ roleLabel, settingsPath, children }: ProfileViewProps) {
  const router = useRouter();
  const { user, displayName, initials, avatarUrl } = useAuth();
  const { colors } = useTheme();

  return (
    <Screen>
      <BackHeader title="Your profile" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        <Card className="items-center gap-2 py-6">
          <Avatar uri={avatarUrl} initials={initials} size={72} />
          <Text variant="title" className="text-center">
            {displayName}
          </Text>
          <Text tone="muted" className="text-center">
            {user?.email}
          </Text>
          <View className="mt-1 flex-row flex-wrap items-center justify-center gap-2">
            <View className="rounded-full bg-muted px-2.5 py-1">
              <Text variant="caption">{roleLabel}</Text>
            </View>
            {user?.created_at ? (
              <View className="flex-row items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <CalendarDays size={12} color={colors.foreground} />
                <Text variant="caption">{`Member since ${format(new Date(user.created_at), "MMM yyyy")}`}</Text>
              </View>
            ) : null}
          </View>
        </Card>
        <View className="flex-row flex-wrap gap-3">{children}</View>
        <Button label="Edit in Settings" variant="outline" icon={Settings} onPress={() => router.push(settingsPath)} />
      </ScrollView>
    </Screen>
  );
}
