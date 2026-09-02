import { View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import ReminderDetails from "@screens/reminder-details/ReminderDetails";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import {
  useUpdateReminder,
  useDeleteReminder,
} from "@hooks/reminders/useReminderCrud";

export default function ReminderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();

  const reminder = useSelector((state: RootState) =>
    state.reminders.reminders.find((r) => r.id === id)
  );

  // CRUD hooks at screen level - use id from URL params
  const { handleUpdate, isLoading: isUpdating } = useUpdateReminder(id);
  const { handleDelete, isLoading: isDeleting } = useDeleteReminder(id);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background dark:bg-background-dark">
        <View
          className="flex-row items-center p-4 border-b border-border dark:border-border-dark"
          style={{ backgroundColor: colors.background }}
        >
          <TouchableOpacity onPress={handleBackPress} className="mr-3 p-2">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900 dark:text-white w-full">
            {reminder?.name} Details
          </Text>
        </View>

        <ReminderDetails
          reminder={reminder || null}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </View>
    </>
  );
}
