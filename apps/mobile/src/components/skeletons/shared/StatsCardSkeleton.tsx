import React from "react";
import { View } from "react-native";

const StatsCardSkeleton: React.FC = () => {
  return (
    <View className="bg-card dark:bg-card-dark rounded-3xl p-5 mb-6 border border-border dark:border-border-dark">
      <View className="flex-row items-center">
        {/* First Stat Section */}
        <View className="flex-1 items-center">
          {/* Icon */}
          <View className="w-6 h-6 bg-muted dark:bg-muted-dark rounded-full mb-2 animate-pulse" />
          {/* Label */}
          <View className="h-3 w-24 bg-muted dark:bg-muted-dark rounded-md mt-2 animate-pulse" />
          {/* Value */}
          <View className="h-5 w-16 bg-muted dark:bg-muted-dark rounded-md mt-1 animate-pulse" />
        </View>

        {/* Divider */}
        <View className="w-px h-[60px] bg-border dark:bg-border-dark mx-4" />

        {/* Second Stat Section */}
        <View className="flex-1 items-center">
          {/* Icon */}
          <View className="w-6 h-6 bg-muted dark:bg-muted-dark rounded-full mb-2 animate-pulse" />
          {/* Label */}
          <View className="h-3 w-24 bg-muted dark:bg-muted-dark rounded-md mt-2 animate-pulse" />
          {/* Value */}
          <View className="h-5 w-20 bg-muted dark:bg-muted-dark rounded-md mt-1 animate-pulse" />
        </View>
      </View>
    </View>
  );
};

export default StatsCardSkeleton;
