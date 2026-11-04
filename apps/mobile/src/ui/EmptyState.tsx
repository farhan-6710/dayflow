import { Image, View } from "react-native";

import { emptyArt, type EmptyArtName } from "@/theme/images";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Text } from "@/ui/Text";

type EmptyStateProps = {
  art: EmptyArtName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ art, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { scheme } = useTheme();

  return (
    <View className="items-center gap-2 px-6 py-10">
      <Image source={emptyArt[art][scheme]} accessibilityIgnoresInvertColors className="mb-2 size-24" resizeMode="contain" />
      <Text variant="heading" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text tone="muted" className="text-center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} size="sm" className="mt-3" /> : null}
    </View>
  );
}
