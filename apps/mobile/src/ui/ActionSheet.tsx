import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Sheet } from "@/ui/Sheet";
import { Text } from "@/ui/Text";

export type SheetAction = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  destructive?: boolean;
};

type ActionSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  actions: SheetAction[];
};

export function ActionSheet({ open, onClose, title, actions }: ActionSheetProps) {
  const { colors } = useTheme();

  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <View className="overflow-hidden rounded-2xl border border-border bg-card">
        {actions.map(({ label, icon: Icon, onPress, destructive }, index) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              onPress();
            }}
            className={`min-h-[52px] flex-row items-center gap-3 px-4 active:bg-muted ${index > 0 ? "border-t border-border" : ""}`}
          >
            <Icon size={20} color={destructive ? colors.destructive : colors.foreground} />
            <Text variant="subheading">{label}</Text>
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}
