import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "../atoms/Text";

interface EditableFieldProps {
  icon: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export default function EditableField({
  icon,
  label,
  value,
  onChange,
  placeholder = "",
  multiline = false,
}: EditableFieldProps) {
  const colors = useThemeColors();

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon as any} size={16} color={colors.gray} />
        <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className="bg-gray-50 dark:bg-card-dark border border-border dark:border-border-dark rounded-xl px-4 py-3 text-base text-gray-900 dark:text-gray-100"
        style={{ textAlignVertical: multiline ? "top" : "center" }}
      />
    </View>
  );
}
