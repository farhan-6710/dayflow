import { useRef, useState, type ReactNode } from "react";
import { Pressable, View, type AccessibilityActionEvent } from "react-native";
import ReanimatedSwipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme/ThemeProvider";
import { ActionSheet, type SheetAction } from "@/ui/ActionSheet";
import { Text } from "@/ui/Text";

type SwipeRowProps = {
  actions: SheetAction[];
  onPress?: () => void;
  accessibilityLabel: string;
  title?: string;
  className?: string;
  children: ReactNode;
};

/** Swipe left for the row's actions, or long press for the same list. Screen readers get them as custom actions. */
export function SwipeRow({ actions, onPress, accessibilityLabel, title, className, children }: SwipeRowProps) {
  const { colors } = useTheme();
  const swipeable = useRef<SwipeableMethods>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeable}
        friction={2}
        rightThreshold={36}
        overshootRight={false}
        renderRightActions={() => (
          <View className="flex-row">
            {actions.map(({ label, icon: Icon, onPress: run, destructive }) => (
              <Pressable
                key={label}
                accessibilityLabel={label}
                onPress={() => {
                  swipeable.current?.close();
                  run();
                }}
                className={cn("w-[76px] items-center justify-center gap-1", destructive ? "bg-destructive" : "bg-secondary")}
              >
                <Icon size={18} color={destructive ? colors["destructive-foreground"] : colors["secondary-foreground"]} />
                <Text variant="caption" className={destructive ? "text-destructive-foreground" : "text-secondary-foreground"}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      >
        <Pressable
          accessibilityRole={onPress ? "button" : undefined}
          accessibilityLabel={accessibilityLabel}
          accessibilityActions={actions.map((action) => ({ name: action.label, label: action.label }))}
          onAccessibilityAction={(event: AccessibilityActionEvent) =>
            actions.find((action) => action.label === event.nativeEvent.actionName)?.onPress()
          }
          onPress={onPress}
          onLongPress={() => {
            haptics.tap();
            setMenuOpen(true);
          }}
          className={cn("bg-card active:bg-muted", className)}
        >
          {children}
        </Pressable>
      </ReanimatedSwipeable>
      <ActionSheet open={menuOpen} onClose={() => setMenuOpen(false)} title={title} actions={actions} />
    </>
  );
}
