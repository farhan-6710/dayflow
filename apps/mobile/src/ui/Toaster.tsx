import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import Toast, { type ToastConfigParams } from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme, type ThemeColors } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

export function showToast(type: "success" | "error" | "info", message: string) {
  Toast.show({ type, text1: message, visibilityTime: type === "error" ? 4500 : 2500 });
}

function ToastBody({ text1, icon: Icon, iconColor }: ToastConfigParams<unknown> & { icon: LucideIcon; iconColor: keyof ThemeColors }) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
      className="mx-4 flex-row items-center gap-3 self-stretch rounded-2xl border px-4 py-3 shadow-md"
    >
      <Icon size={20} color={colors[iconColor]} />
      <Text style={{ color: colors.foreground }} className="flex-1">
        {text1}
      </Text>
    </View>
  );
}

const config = {
  success: (params: ToastConfigParams<unknown>) => <ToastBody {...params} icon={CircleCheck} iconColor="success" />,
  error: (params: ToastConfigParams<unknown>) => <ToastBody {...params} icon={CircleAlert} iconColor="destructive" />,
  info: (params: ToastConfigParams<unknown>) => <ToastBody {...params} icon={Info} iconColor="muted-foreground" />,
};

export function Toaster() {
  const insets = useSafeAreaInsets();
  return <Toast config={config} topOffset={insets.top + 8} />;
}
