import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeScope } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

const native = Platform.OS !== "web";
const OFFSCREEN = 700;

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Stays above the keyboard, outside the scrolling area. */
  footer?: ReactNode;
};

/** A bottom sheet. Drag the handle down, tap outside or use the back button to close. */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (open) {
      setMounted(true);
      drag.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: native }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open, progress, drag]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 4,
      onPanResponderMove: (_, gesture) => drag.setValue(Math.max(0, gesture.dy)),
      onPanResponderRelease: (_, gesture) => {
        Animated.spring(drag, { toValue: 0, useNativeDriver: native }).start();
        if (gesture.dy > 90) closeRef.current();
      },
    }),
  ).current;

  if (!mounted) return null;

  const translateY = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [OFFSCREEN, 0] }),
    drag,
  );

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <ThemeScope>
        <KeyboardAvoidingView behavior="padding" className="flex-1 justify-end">
          <Animated.View style={{ opacity: progress }} className="absolute inset-0 bg-black/50">
            <Pressable accessibilityLabel="Close" onPress={onClose} className="flex-1" />
          </Animated.View>
          <Animated.View
            accessibilityViewIsModal
            style={{ transform: [{ translateY }], maxHeight: "92%" }}
            className="rounded-t-3xl bg-background"
          >
            <View {...panResponder.panHandlers} className="items-center pb-1 pt-3">
              <View className="h-1 w-10 rounded-full bg-muted" />
              {title ? (
                <Text variant="heading" accessibilityRole="header" className="px-5 pt-3 text-center">
                  {title}
                </Text>
              ) : null}
            </View>
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 20, paddingBottom: footer ? 12 : 20 + insets.bottom, gap: 16 }}
            >
              {children}
            </ScrollView>
            {footer ? (
              <View className="border-t border-border px-5 pt-3" style={{ paddingBottom: 12 + insets.bottom }}>
                {footer}
              </View>
            ) : null}
          </Animated.View>
        </KeyboardAvoidingView>
      </ThemeScope>
    </Modal>
  );
}
