import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "./Text";

interface ReadOnlyFieldProps {
  icon: string;
  label: string;
  value: string;
  colorScheme?: "gray" | "green" | "red" | "amber";
}

export default function ReadOnlyField({
  icon,
  label,
  value,
  colorScheme = "gray",
}: ReadOnlyFieldProps) {
  const colors = useThemeColors();

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon as any} size={16} color={colors.gray} />
        <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </Text>
      </View>
      <View
        className={`
        rounded-xl px-4 py-3.5 border
        ${
          colorScheme === "gray"
            ? "bg-gray-50 dark:bg-card-dark border-border dark:border-border-dark"
            : ""
        }
        ${
          colorScheme === "green"
            ? "bg-emerald-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-800"
            : ""
        }
        ${
          colorScheme === "red"
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : ""
        }
        ${
          colorScheme === "amber"
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500 dark:border-amber-800"
            : ""
        }
      `}
      >
        <Text
          className={`
          text-base
          ${colorScheme === "gray" ? "text-gray-900 dark:text-gray-100" : ""}
          ${
            colorScheme === "green"
              ? "text-blue-700 dark:text-blue-300 font-semibold"
              : ""
          }
          ${
            colorScheme === "red"
              ? "text-red-700 dark:text-red-300 font-semibold"
              : ""
          }
          ${
            colorScheme === "amber"
              ? "text-amber-700 dark:text-amber-300 font-semibold"
              : ""
          }
        `}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
