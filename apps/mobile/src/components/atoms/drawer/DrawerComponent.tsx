import React, { useEffect, useState } from "react";
import { TouchableOpacity, Modal, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface DrawerComponentProps {
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
  animationSpeed?: "fast" | "medium" | "slow";
  position?: "left" | "right" | "bottom";
  children: React.ReactNode;
}

export default function DrawerComponent({
  showDrawer,
  setShowDrawer,
  animationSpeed = "medium",
  position = "right",
  children,
}: DrawerComponentProps) {
  const { width } = useWindowDimensions();

  // State to control Modal visibility (delayed for animation)
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animated values
  const translateX = useSharedValue(position === "left" ? -width : width);
  const backdropOpacity = useSharedValue(0);

  const getDuration = () => {
    switch (animationSpeed) {
      case "fast":
        return 200;
      case "medium":
        return 300;
      case "slow":
        return 500;
      default:
        return 300;
    }
  };

  const duration = getDuration();

  // Callback when animation completes
  const onAnimationComplete = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (showDrawer) {
      // Set initial position immediately before showing modal
      translateX.value = position === "left" ? -width : width;
      backdropOpacity.value = 0;

      // Show modal
      setIsModalVisible(true);

      // Start animation on next frame
      requestAnimationFrame(() => {
        translateX.value = withTiming(0, { duration });
        backdropOpacity.value = withTiming(0.5, { duration });
      });
    } else {
      // Animate out, then hide modal
      translateX.value = withTiming(
        position === "left" ? -width : width,
        { duration },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        }
      );
      backdropOpacity.value = withTiming(0, { duration });
    }
  }, [showDrawer, position, width]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!isModalVisible) {
    return null;
  }

  const getDrawerPositionClasses = () => {
    switch (position) {
      case "left":
        return "left-0 top-0 bottom-0";
      case "right":
        return "right-0 top-0 bottom-0";
      case "bottom":
        return "left-0 right-0 bottom-0 w-full";
      default:
        return "right-0 top-0 bottom-0";
    }
  };

  const positionClasses = getDrawerPositionClasses();

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowDrawer(false)}
      statusBarTranslucent={true}
    >
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black"
        style={backdropAnimatedStyle}
      >
        <TouchableOpacity
          className="w-full h-full"
          onPress={() => setShowDrawer(false)}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer Content */}
      <Animated.View
        className={`absolute ${positionClasses} w-[310px]`}
        style={[drawerAnimatedStyle, { overflow: "hidden" }]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}
