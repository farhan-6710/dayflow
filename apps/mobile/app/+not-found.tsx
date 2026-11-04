import { useRouter } from "expo-router";
import { Image, View } from "react-native";

import { illustrations } from "@/theme/images";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Text } from "@/ui/Text";

export default function NotFoundScreen() {
  const router = useRouter();
  const { scheme } = useTheme();
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
      <Image source={illustrations.error[scheme]} accessibilityIgnoresInvertColors style={{ width: "100%", height: 200 }} resizeMode="contain" />
      <Text variant="title" className="text-center">
        We can't find that page
      </Text>
      <Button label="Go home" onPress={() => router.replace("/")} />
    </View>
  );
}
