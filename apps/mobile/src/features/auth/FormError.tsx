import { CircleAlert } from "lucide-react-native";
import { View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

export function FormError({ message }: { message: string | null }) {
  const { colors } = useTheme();
  if (!message) return null;
  return (
    <View accessibilityRole="alert" className="flex-row items-start gap-2 rounded-xl border border-destructive p-3">
      <CircleAlert size={18} color={colors.destructive} />
      <Text variant="label" className="flex-1">
        {message}
      </Text>
    </View>
  );
}
