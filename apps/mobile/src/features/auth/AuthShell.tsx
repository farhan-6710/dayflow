import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { Image, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { illustrations } from "@/theme/images";
import { useTheme } from "@/theme/ThemeProvider";
import { IconButton } from "@/ui/IconButton";
import { Text } from "@/ui/Text";

type AuthShellProps = {
  title: string;
  description?: string;
  art?: keyof typeof illustrations;
  back?: boolean;
  children: ReactNode;
};

export function AuthShell({ title, description, art, back = true, children }: AuthShellProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scheme } = useTheme();

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}
      >
        {back ? (
          <View className="-ml-2 mb-2 self-start">
            <IconButton icon={ChevronLeft} label="Back" onPress={() => router.back()} />
          </View>
        ) : null}
        {art ? (
          <Image source={illustrations[art][scheme]} accessibilityIgnoresInvertColors resizeMode="contain" style={{ width: "100%", height: 144, marginBottom: 16 }} />
        ) : null}
        <Text variant="display" accessibilityRole="header">
          {title}
        </Text>
        {description ? (
          <Text tone="muted" className="mt-1">
            {description}
          </Text>
        ) : null}
        <View className="mt-6 gap-4">{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
