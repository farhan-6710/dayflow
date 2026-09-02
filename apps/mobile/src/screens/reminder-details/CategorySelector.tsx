import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "@components/atoms/Text";
import { ReminderCategory } from "@types";
import {
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_LABELS,
} from "@constants/reminders";

interface CategorySelectorProps {
  /** Currently selected category */
  selectedCategory: ReminderCategory;
  /** Callback when a category is selected */
  onSelect: (category: ReminderCategory) => void;
}

const CategorySelector = React.memo<CategorySelectorProps>(
  ({ selectedCategory, onSelect }) => {
    const colors = useThemeColors();

    return (
      <View className="mb-4">
        {/* Label row - match EditableField sizing and spacing */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="pricetag-outline" size={16} color={colors.gray} />
          <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Category
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {REMINDER_CATEGORIES.map((category) => {
            const isSelected = category === selectedCategory;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => onSelect(category)}
                activeOpacity={0.85}
                className={`px-4 py-2 rounded-2xl border ${
                  isSelected
                    ? `bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark`
                    : `bg-gray-50 dark:bg-card-dark border-border dark:border-border-dark`
                }`}
              >
                <Text
                  className={`text-sm font-semibold capitalize ${
                    isSelected
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {REMINDER_CATEGORY_LABELS[category]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

CategorySelector.displayName = "CategorySelector";

export default CategorySelector;
