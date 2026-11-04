import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { forwardRef, useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/lib/cn";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  hint?: string;
  icon?: LucideIcon;
  /** Adds a show or hide toggle. */
  password?: boolean;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, icon: Icon, password, multiline, className, ...props },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View className="gap-1.5">
      {label ? <Text variant="label">{label}</Text> : null}
      <View
        className={cn(
          "flex-row gap-2.5 rounded-xl border bg-card px-3.5",
          multiline ? "items-start py-3" : "h-12 items-center",
          error ? "border-destructive" : focused ? "border-ring" : "border-input",
        )}
      >
        {Icon ? <Icon size={18} color={colors["muted-foreground"]} /> : null}
        <TextInput
          ref={ref}
          multiline={multiline}
          secureTextEntry={password && hidden}
          placeholderTextColor={colors["muted-foreground"]}
          selectionColor={colors["chart-1"]}
          accessibilityLabel={label ?? props.placeholder}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          className={cn("flex-1 font-sans text-[15px] text-foreground", multiline && "min-h-24", className)}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={10}
            onPress={() => setHidden((value) => !value)}
          >
            {hidden ? <Eye size={18} color={colors["muted-foreground"]} /> : <EyeOff size={18} color={colors["muted-foreground"]} />}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" className="text-foreground">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});
