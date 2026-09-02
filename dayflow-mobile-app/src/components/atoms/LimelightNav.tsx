import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavItem, LimelightNavProps } from "@types";

const defaultNavItems: NavItem[] = [
  { id: "default-home", iconName: "home-outline", label: "Home" },
  { id: "default-explore", iconName: "compass-outline", label: "Explore" },
  {
    id: "default-notifications",
    iconName: "notifications-outline",
    label: "Notifications",
  },
];

export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  onTabChange,
  containerStyle,
  limelightStyle,
  iconContainerStyle,
  iconStyle,
  backgroundColor = "#1a1a2e", // Dark mode default
  primaryColor = "#6B46C1",
  iconSize = 24,
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [itemLayouts, setItemLayouts] = useState<
    { x: number; width: number }[]
  >([]);
  const LIMELIGHT_WIDTH = 44; // px
  const limelightPosition = useRef(new Animated.Value(0)).current;
  const limelightOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (itemLayouts.length === items.length && itemLayouts.length > 0) {
      const layout = itemLayouts[activeIndex];
      if (!layout) return;
      const newPosition = layout.x + layout.width / 2 - LIMELIGHT_WIDTH / 2;

      Animated.parallel([
        Animated.timing(limelightPosition, {
          toValue: newPosition,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(limelightOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeIndex, itemLayouts, items.length]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  const onItemLayout = (index: number, x: number, width: number) => {
    setItemLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  return (
    <View
      className="relative flex-row items-center h-[64px] rounded-xl bg-background dark:bg-background-dark border border-border dark:border-border-dark px-2"
      style={containerStyle}
    >
      {items.map(({ id, iconName, label, onClick }, index) => (
        <TouchableOpacity
          key={id}
          className="flex-1 h-full justify-center items-center py-5 z-20"
          style={iconContainerStyle}
          onPress={() => handleItemClick(index, onClick)}
          onLayout={(event) => {
            const { x, width } = event.nativeEvent.layout;
            onItemLayout(index, x, width);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={iconName}
            size={iconSize}
            color={activeIndex === index ? primaryColor : "#9CA3AF"}
            style={[
              {
                opacity: activeIndex === index ? 1 : 0.4,
              },
              iconStyle,
            ]}
          />
        </TouchableOpacity>
      ))}

      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            width: 44,
            height: 5,
            borderRadius: 999,
            backgroundColor: primaryColor,
            zIndex: 10,
            transform: [{ translateX: limelightPosition }],
            opacity: limelightOpacity,
          },
          limelightStyle,
        ]}
      >
        <View
          style={{
            position: "absolute",
            left: -13, // -30% of 44px width
            top: 5,
            width: 70, // 160% of 44px width
            height: 56,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: primaryColor,
              opacity: 0.3,
              transform: [{ scaleY: 0.8 }],
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
};
