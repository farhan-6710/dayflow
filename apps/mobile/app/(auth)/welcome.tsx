import brand from "@dayflow/brand/brandManifest.json";
import { useRouter } from "expo-router";
import { BriefcaseBusiness, ChevronRight, Handshake, type LucideIcon } from "lucide-react-native";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth, type Portal } from "@/features/auth/AuthProvider";
import { haptics } from "@/lib/haptics";
import { illustrations, logo } from "@/theme/images";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

function RoleCard({ title, description, icon: Icon, onPress }: { title: string; description: string; icon: LucideIcon; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm active:opacity-80"
    >
      <View className="size-11 items-center justify-center rounded-xl bg-muted">
        <Icon size={20} color={colors.foreground} />
      </View>
      <View className="flex-1">
        <Text variant="heading">{title}</Text>
        <Text variant="label" tone="muted">
          {description}
        </Text>
      </View>
      <ChevronRight size={20} color={colors["muted-foreground"]} />
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPortal } = useAuth();
  const { scheme } = useTheme();

  function choose(portal: Portal) {
    haptics.tap();
    setPortal(portal);
    router.push("/sign-in");
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}
    >
      <View className="flex-row items-center gap-2.5">
        <Image source={logo[scheme]} accessibilityIgnoresInvertColors style={{ width: 36, height: 36 }} resizeMode="contain" />
        <Text variant="heading">{brand.name}</Text>
      </View>
      <Image source={illustrations.authWorkspace[scheme]} accessibilityIgnoresInvertColors resizeMode="contain" style={{ width: "100%", height: 192, marginVertical: 16 }} />
      <Text variant="display" accessibilityRole="header">
        {brand.tagline}
      </Text>
      <Text tone="muted" className="mt-2">
        {brand.shortDescription}
      </Text>
      <View className="mt-auto gap-3 pt-8">
        <Text variant="label" tone="muted">
          How will you use DayFlow?
        </Text>
        <RoleCard title="I'm a freelancer" description="Run clients, projects, tasks and your day" icon={BriefcaseBusiness} onPress={() => choose("workspace")} />
        <RoleCard title="I'm a client" description="Follow your projects and raise requests" icon={Handshake} onPress={() => choose("client")} />
      </View>
    </ScrollView>
  );
}
