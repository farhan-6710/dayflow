import React, { useEffect, useState } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import ToggleButton from "@components/atoms/ToggleButton";
import { getCurrentTime } from "@utils/home/utils";

interface ReminderScheduleHeaderProps {
  onToggle: () => void;
}

export default function ReminderScheduleHeader({
  onToggle,
}: ReminderScheduleHeaderProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      entering={FadeInUp.duration(300).delay(200)}
      className="mb-4"
    >
      <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark uppercase tracking-wide">
        Daily Reminder Schedule
      </Text>
      <Animated.View className="flex-row items-center justify-between">
        <Text className="text-[40px] font-semibold text-foreground dark:text-foreground-dark">
          {currentTime}
        </Text>
        <ToggleButton
          initialValue={true}
          onToggle={onToggle}
          size="medium"
          hapticsFeedback={true}
        />
      </Animated.View>
    </Animated.View>
  );
}
