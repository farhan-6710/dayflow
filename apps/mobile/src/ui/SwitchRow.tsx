import { Switch, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

type SwitchRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function SwitchRow({ label, description, value, onChange, disabled }: SwitchRowProps) {
  const { colors } = useTheme();
  return (
    <View className="min-h-12 flex-row items-center gap-3">
      <View className="flex-1">
        <Text variant="subheading">{label}</Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: colors.primary, false: colors.muted }}
        thumbColor={value ? colors["primary-foreground"] : colors.card}
      />
    </View>
  );
}
