import React from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { calculatePercentage } from "@utils/analytics";
import { CategoryData } from "@types";

interface CategoryBreakdownCardProps {
  /** Array of category data */
  categories: CategoryData[];
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const CategoryBreakdownCard = React.memo<CategoryBreakdownCardProps>(
  ({ categories, animationDelay = 250 }) => {
    return (
      <Animated.View
        entering={FadeInUp.duration(300).delay(animationDelay)}
        className="bg-card dark:bg-card-dark rounded-2xl p-5 mb-4 border border-border dark:border-border-dark"
      >
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark mb-4">
          Category Breakdown
        </Text>

        <View className="gap-4">
          {categories.map((category, index) => {
            const percentage = calculatePercentage(
              category.completed,
              category.total
            );

            return (
              <View key={index}>
                {/* Category Header */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${category.iconBgClass}`}
                    >
                      <Ionicons
                        name={category.icon}
                        size={20}
                        color={category.iconColor}
                      />
                    </View>
                    <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                      {category.name}
                    </Text>
                  </View>

                  <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                    {category.completed}/{category.total}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="h-2 bg-borderLight dark:bg-borderDark rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: category.iconColor,
                    }}
                  />
                </View>

                {/* Percentage */}
                <Text
                  className="text-xs font-semibold mt-1 text-right"
                  style={{ color: category.iconColor }}
                >
                  {percentage}%
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    );
  }
);

CategoryBreakdownCard.displayName = "CategoryBreakdownCard";

export default CategoryBreakdownCard;
