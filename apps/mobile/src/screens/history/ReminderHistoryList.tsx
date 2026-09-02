import React from "react";
import { View, FlatList } from "react-native";
import ReminderHistoryCard from "./ReminderHistoryCard";
import { ReminderHistoryItem } from "@types";
import Text from "@components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";

interface ReminderHistoryListProps {
  /** Array of reminder history items to display */
  items: ReminderHistoryItem[];
  /** Callback when a card is pressed */
  onItemPress?: (item: ReminderHistoryItem) => void;
}

const ReminderHistoryList: React.FC<ReminderHistoryListProps> = ({
  items,
  onItemPress,
}) => {
  const colors = useThemeColors();

  // Empty state component
  const EmptyState = () => (
    <View className="items-center justify-center py-16">
      <View className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
        <Ionicons name="calendar-outline" size={40} color={colors.text} />
      </View>
      <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
        No History Yet
      </Text>
      <Text className="text-sm text-foreground dark:text-foreground-dark text-center px-8">
        Your reminder history will appear here once you start completing
        reminders
      </Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <ReminderHistoryCard
          item={item}
          index={index}
          onPress={onItemPress}
          isLast={index === items.length - 1}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 90,
        paddingTop: items.length === 0 ? 0 : 12,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyState />}
    />
  );
};

export default ReminderHistoryList;
