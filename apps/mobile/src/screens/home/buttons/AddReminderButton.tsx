import React from "react";
import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";

interface AddReminderButtonProps {
  /** Callback when button is pressed */
  onPress: () => void;
}

const AddReminderButton = React.memo<AddReminderButtonProps>(({ onPress }) => {
  const colors = useThemeColors();

  return (
    <Animated.View entering={FadeInRight.duration(300).delay(700)}>
      <Button
        onPress={onPress}
        title="Add New Reminder"
        variant="secondary"
        size="large"
        fullWidth
        className="mb-4 border-2 border-dashed border-gray-400 dark:border-border-dark"
      >
        <View className="flex-row items-center justify-center">
          <View
            className="w-7 h-7 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.primary }}
          >
            <Ionicons name="add" size={16} color="white" />
          </View>
          <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Add New Reminder
          </Text>
        </View>
      </Button>
    </Animated.View>
  );
});

AddReminderButton.displayName = "AddReminderButton";

export default AddReminderButton;
