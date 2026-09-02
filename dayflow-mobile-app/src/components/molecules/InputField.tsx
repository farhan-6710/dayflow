import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "../atoms/Text";

interface InputFieldProps {
  icon: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

export default function InputField({
  icon,
  label,
  value,
  onChange,
  placeholder = "",
  keyboardType = "default",
  secureTextEntry = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  isFocused = false,
  onFocus,
  onBlur,
  returnKeyType = "done",
  autoCapitalize = "sentences",
  autoCorrect = true,
}: InputFieldProps) {
  const colors = useThemeColors();

  const getFieldClasses = () =>
    `w-full rounded-xl border text-base text-foreground dark:text-white ${
      isFocused
        ? "border-primary bg-primary/5 dark:bg-primary/10"
        : "border-border dark:border-border-dark bg-white/90 dark:bg-white/5"
    }`;

  const inputStyle = {
    height: 48,
    paddingVertical: 0,
    textAlignVertical: "center" as const,
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons
          name={icon as any}
          size={14}
          color={isFocused ? colors.primary : colors.gray}
        />
        <Text className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </Text>
      </View>
      <View className="relative">
        <Ionicons
          name={icon as any}
          size={20}
          color={isFocused ? colors.primary : colors.gray}
          style={{ position: "absolute", left: 16, top: 14, zIndex: 1 }}
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onFocus={onFocus}
          onBlur={onBlur}
          className={getFieldClasses()}
          style={{
            ...inputStyle,
            paddingLeft: 52,
            paddingRight: showPasswordToggle ? 80 : 16,
          }}
        />
        {showPasswordToggle && onTogglePassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            className="absolute right-4 top-4"
          >
            <Text className="text-sm font-semibold text-primary">
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
