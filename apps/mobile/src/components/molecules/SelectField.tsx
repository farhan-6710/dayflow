import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";

type SelectFieldProps = {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
};

const DROPDOWN_MAX_HEIGHT = 220;

export default function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  accessibilityLabel,
}: SelectFieldProps) {
  const colors = useThemeColors();
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  const handleSelect = async (option: string) => {
    if (option !== value) {
      await Haptics.selectionAsync();
      onChange(option);
    }
    setOpen(false);
  };

  const windowHeight = Dimensions.get("window").height;
  const spaceBelow = windowHeight - (anchor.y + anchor.height);
  const openAbove = spaceBelow < 160 && anchor.y > DROPDOWN_MAX_HEIGHT;
  const top = openAbove
    ? Math.max(8, anchor.y - DROPDOWN_MAX_HEIGHT)
    : anchor.y + anchor.height + 4;

  return (
    <View className="flex-1">
      {label ? (
        <Text className="mb-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </Text>
      ) : null}

      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          onPress={openDropdown}
          className="min-h-[48px] flex-row items-center justify-between rounded-xl border border-border bg-gray-50 px-3 py-3 dark:border-border-dark dark:bg-card-dark"
        >
          <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
            {value || placeholder}
          </Text>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.gray}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setOpen(false)}>
          <Pressable
            onPress={() => undefined}
            className="overflow-hidden rounded-xl border border-border bg-white dark:border-border-dark dark:bg-card-dark"
            style={{
              position: "absolute",
              top,
              left: anchor.x,
              width: Math.max(anchor.width, 72),
              maxHeight: DROPDOWN_MAX_HEIGHT,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => void handleSelect(item)}
                    className={`px-3 py-3 ${isSelected ? "bg-primary/10" : ""}`}
                  >
                    <Text
                      className={`text-center text-base ${
                        isSelected
                          ? "font-semibold text-primary"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
