import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import { useColorScheme } from "react-native";
import NotificationTestButton from "@screens/home/buttons/NotificationTestButton";

interface DebugLogsSectionProps {
  logs: string[];
  expoPushToken?: string | null;
  onCopy?: () => void;
}

const DebugLogsSection: React.FC<DebugLogsSectionProps> = ({
  logs,
  expoPushToken,
  onCopy,
}) => {
  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      {logs && logs.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(200).delay(600)}
          className="rounded-2xl overflow-hidden border border-border dark:border-border-dark mb-4 p-4 bg-card dark:bg-card-dark"
        >
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full items-center justify-center mr-2 bg-green-500/20">
              <Ionicons name="code-slash" size={16} color="#10B981" />
            </View>
            <Text className="text-foreground dark:text-foreground-dark font-semibold text-lg">
              Notification Setup Logs
            </Text>
          </View>

          <View className="bg-background dark:bg-background-dark rounded-xl p-3 border border-border dark:border-border-dark">
            {logs.map((log, index) => (
              <View key={index} className="flex-row items-start mb-2 last:mb-0">
                <Text className="text-sm text-primary font-semibold mr-2 font-mono">
                  {index + 1}.
                </Text>
                <Text className="flex-1 text-sm text-foreground dark:text-foreground-dark leading-5 font-mono">
                  {log}
                </Text>
              </View>
            ))}
          </View>

          {/* Expo Push Token Section */}
          {expoPushToken && (
            <View className="mt-4 pt-4 border-t border-border dark:border-border-dark">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="key"
                  size={16}
                  color="#10B981"
                  className="mr-2"
                />
                <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  Expo Push Token
                </Text>
              </View>
              <Pressable
                onLongPress={onCopy}
                className="bg-card dark:bg-card-dark rounded-xl p-3 border border-border dark:border-border-dark"
              >
                <Text className="text-foreground dark:text-foreground-dark text-xs leading-5 font-mono">
                  {expoPushToken}
                </Text>
              </Pressable>
              <View className="flex-row items-center my-2">
                <Ionicons
                  name="hand-left"
                  size={12}
                  color={colors.gray}
                  className="mr-1"
                />
                <Text className="text-gray-500 dark:text-gray-500 text-xs">
                  Long press to copy token to clipboard
                </Text>
              </View>

              <NotificationTestButton />
            </View>
          )}
        </Animated.View>
      )}
    </>
  );
};

export default DebugLogsSection;
