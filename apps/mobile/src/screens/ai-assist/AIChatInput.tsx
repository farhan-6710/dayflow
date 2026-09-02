import React, { useState } from "react";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Pressable, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";

interface AIChatInputProps {
  /** Callback when message is sent */
  onSend: (message: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Animation delay in milliseconds */
  animationDelay?: number;
}

const AIChatInput = React.memo<AIChatInputProps>(
  ({ onSend, placeholder = "Ask AI anything...", animationDelay = 400 }) => {
    const [message, setMessage] = useState("");
    const colors = useThemeColors();

    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0);

    const buttonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      opacity: glowOpacity.value,
    }));

    const handleSend = () => {
      if (message.trim()) {
        onSend(message.trim());
        setMessage("");
      }
    };

    const handlePressIn = () => {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0.8, { duration: 150 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      glowOpacity.value = withTiming(0, { duration: 300 });
    };

    return (
      <Animated.View
        entering={FadeInUp.duration(400).delay(animationDelay)}
        className="mb-6"
      >
        <Pressable
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!message.trim()}
          className="relative overflow-hidden"
        >
          {/* Button glow effect */}
          <Animated.View
            style={glowStyle}
            className="absolute -inset-1 rounded-2xl"
          >
            <View
              className="w-full h-full rounded-2xl"
              style={{ backgroundColor: colors.primary, opacity: 0.3 }}
            />
          </Animated.View>

          {/* Button content */}
          <Animated.View style={buttonStyle}>
            <LinearGradient
              colors={
                message.trim()
                  ? [colors.primary, colors.secondary]
                  : ["#9CA3AF", "#6B7280"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
            >
              <Ionicons
                name="sparkles"
                size={24}
                color="#ffffff"
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder={placeholder}
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  className="text-base font-semibold"
                  style={{ color: "#ffffff" }}
                  multiline={false}
                  maxLength={500}
                />
              </View>
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{
                  backgroundColor: message.trim()
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Ionicons name="send" size={20} color="#ffffff" />
              </View>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }
);

AIChatInput.displayName = "AIChatInput";

export default AIChatInput;
