import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export function SearchInput({ value, onChangeText, placeholder }: SearchInputProps) {
  const { colors } = useTheme();
  return (
    <View className="h-11 flex-row items-center gap-2 rounded-xl border border-input bg-card px-3">
      <Search size={18} color={colors["muted-foreground"]} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        placeholderTextColor={colors["muted-foreground"]}
        selectionColor={colors["chart-1"]}
        autoCorrect={false}
        returnKeyType="search"
        className="flex-1 font-sans text-[15px] text-foreground"
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={10} onPress={() => onChangeText("")}>
          <X size={18} color={colors["muted-foreground"]} />
        </Pressable>
      ) : null}
    </View>
  );
}
