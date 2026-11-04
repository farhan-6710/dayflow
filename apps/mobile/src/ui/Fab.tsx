import { Plus, type LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

import { haptics } from "@/lib/haptics";
import { useTheme } from "@/theme/ThemeProvider";

type FabProps = {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
};

/** The screen's one primary action, within thumb reach. */
export function Fab({ label, onPress, icon: Icon = Plus }: FabProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      className="absolute bottom-5 right-4 size-14 items-center justify-center rounded-2xl bg-primary shadow-lg active:opacity-80"
    >
      <Icon size={24} color={colors["primary-foreground"]} />
    </Pressable>
  );
}
