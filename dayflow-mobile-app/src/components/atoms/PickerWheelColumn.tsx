import React, { useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Text from "@components/atoms/Text";
import { PICKER_WHEEL_ITEM_HEIGHT, PICKER_WHEEL_VISIBLE_ROWS } from "@constants/timePicker";

type PickerWheelColumnProps = {
  items: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  width?: number;
};

export default function PickerWheelColumn({
  items,
  selectedIndex,
  onIndexChange,
  width = 72,
}: PickerWheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const lastIndexRef = useRef(selectedIndex);
  const wheelHeight = PICKER_WHEEL_ITEM_HEIGHT * PICKER_WHEEL_VISIBLE_ROWS;
  const inset = PICKER_WHEEL_ITEM_HEIGHT * 2;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * PICKER_WHEEL_ITEM_HEIGHT,
      animated: false,
    });
    lastIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const nextIndex = Math.max(
      0,
      Math.min(items.length - 1, Math.round(offsetY / PICKER_WHEEL_ITEM_HEIGHT)),
    );

    if (nextIndex !== lastIndexRef.current) {
      lastIndexRef.current = nextIndex;
      void Haptics.selectionAsync();
      onIndexChange(nextIndex);
    }
  };

  return (
    <View style={{ width, height: wheelHeight }} className="relative">
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 top-1/2 -mt-[22px] h-11 rounded-xl border border-primary/30 bg-primary/5"
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={PICKER_WHEEL_ITEM_HEIGHT}
        decelerationRate="fast"
        nestedScrollEnabled
        contentContainerStyle={{
          paddingVertical: inset,
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <View
              key={`${item}-${index}`}
              style={{ height: PICKER_WHEEL_ITEM_HEIGHT }}
              className="items-center justify-center"
            >
              <Text
                className={`text-lg ${
                  isSelected
                    ? "font-semibold text-gray-900 dark:text-white"
                    : "font-medium text-gray-400 dark:text-gray-500"
                }`}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
