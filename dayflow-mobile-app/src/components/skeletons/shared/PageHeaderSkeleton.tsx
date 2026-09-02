import React from "react";
import { View } from "react-native";

const PageHeaderSkeleton: React.FC = () => {
  return (
    <View
      className="flex-row items-center justify-between border-b border-border py-5 dark:border-border-dark"
      style={{ paddingHorizontal: 24 }}
    >
      <View className="h-10 w-10 rounded-lg bg-muted dark:bg-muted-dark animate-pulse" />
      <View className="mx-2.5 h-6 w-px bg-muted dark:bg-muted-dark" />
      <View className="flex-1">
        <View className="mb-2 h-5 w-[40%] rounded-lg bg-muted dark:bg-muted-dark animate-pulse" />
        <View className="h-3 w-[55%] rounded-md bg-muted dark:bg-muted-dark animate-pulse" />
      </View>
      <View className="h-12 w-12 rounded-xl bg-muted dark:bg-muted-dark animate-pulse" />
    </View>
  );
};

export default PageHeaderSkeleton;
