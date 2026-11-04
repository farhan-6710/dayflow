import { useRouter } from "expo-router";
import { ChartPie, CircleHelp, LogOut, Settings } from "lucide-react-native";
import { Image, Linking, ScrollView, View } from "react-native";

import { ProfileHeaderRow } from "@/features/settings/ProfileHeaderRow";
import { useSignOut } from "@/features/settings/useSignOut";
import { SUPPORT_URL } from "@/shared/constants/support";
import { illustrations } from "@/theme/images";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { MenuRow } from "@/ui/MenuRow";
import { Screen, TabHeader } from "@/ui/Screen";
import { Text } from "@/ui/Text";

export default function ClientMoreScreen() {
  const router = useRouter();
  const { scheme } = useTheme();
  const signOut = useSignOut();

  return (
    <Screen>
      <TabHeader title="More" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}>
        <ProfileHeaderRow onPress={() => router.push("/client/profile")} />
        <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <MenuRow first icon={ChartPie} label="Analytics" onPress={() => router.push("/client/analytics")} />
          <MenuRow icon={Settings} label="Settings" onPress={() => router.push("/client/settings")} />
        </View>
        <Card className="flex-row items-center gap-3">
          <Image source={illustrations.sidebarClient[scheme]} accessibilityIgnoresInvertColors style={{ width: 84, height: 84 }} resizeMode="contain" />
          <View className="flex-1 gap-2">
            <Text variant="heading">Your projects</Text>
            <Button label="Open projects" size="sm" variant="outline" onPress={() => router.navigate("/client/projects")} />
          </View>
        </Card>
        <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <MenuRow first icon={CircleHelp} label="Help & support" onPress={() => void Linking.openURL(SUPPORT_URL)} />
          <MenuRow icon={LogOut} label="Log out" destructive onPress={() => void signOut()} />
        </View>
      </ScrollView>
    </Screen>
  );
}
