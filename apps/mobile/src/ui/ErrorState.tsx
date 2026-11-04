import { CircleAlert } from "lucide-react-native";
import { View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Text } from "@/ui/Text";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message = "Check your connection and try again.", onRetry }: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View accessibilityRole="alert" className="items-center gap-2 px-6 py-10">
      <CircleAlert size={32} color={colors.destructive} />
      <Text variant="heading" className="text-center">
        Couldn't load this
      </Text>
      <Text tone="muted" className="text-center">
        {message}
      </Text>
      {onRetry ? <Button label="Try again" variant="outline" size="sm" onPress={onRetry} className="mt-3" /> : null}
    </View>
  );
}
