import React from "react";
import { View } from "react-native";

const PageHeaderSkeleton: React.FC = () => {
  return (
    <View className="flex-row justify-between items-center mr-6 my-6">
      {/* Icon Skeleton */}
      <View className="w-[42px] h-[42px] bg-muted dark:bg-muted-dark rounded-full animate-pulse" />

      {/* Title and Subtitle Skeleton */}
      <View className="flex-1 ml-4">
        {/* Title */}
        <View className="h-9 bg-muted dark:bg-muted-dark rounded-lg mb-2 w-[60%] animate-pulse" />
        {/* Subtitle */}
        <View className="h-4 bg-muted dark:bg-muted-dark rounded-md w-[80%] animate-pulse" />
      </View>

      {/* Action Button Skeleton */}
      <View className="w-12 h-12 bg-muted dark:bg-muted-dark rounded-xl animate-pulse" />
    </View>
  );
};

export default PageHeaderSkeleton;
