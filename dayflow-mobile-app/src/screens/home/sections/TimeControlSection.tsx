import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import ToggleButton from "@components/atoms/ToggleButton";
import { getCurrentTime } from "@utils/home/utils";

interface TimeControlSectionProps {
  onToggle: () => void;
}

export default function TimeControlSection({
  onToggle,
}: TimeControlSectionProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      entering={FadeInUp.duration(300).delay(300)}
      className="flex flex-row justify-between items-center mb-4"
    >
      <Text className="text-[36px] text-foreground dark:text-foreground-dark">
        {currentTime}
      </Text>
      <View className="items-end">
        <ToggleButton
          initialValue={true}
          onToggle={onToggle}
          size="medium"
          hapticsFeedback={true}
        />
      </View>
    </Animated.View>
  );
}
