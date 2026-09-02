import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import Text from "@components/atoms/Text";
import Button from "@components/atoms/Button";
import { GithubIcon, GoogleIcon, AppleIcon } from "@utils/icons";
import Animated, { FadeInRight } from "react-native-reanimated";

interface AuthFooterProps {
  type: "login" | "signup";
}

export default function AuthFooter({ type }: AuthFooterProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const toggleText =
    type === "login" ? "Don't have an account?" : "Already have an account?";
  const toggleCta = type === "login" ? "Sign Up" : "Log In";
  const toggleRoute = type === "login" ? "/auth/signup" : "/auth/login";

  return (
    <View>
      {/* Divider */}
      <Animated.View
        entering={FadeInRight.duration(200).delay(500)}
        className="flex-row items-center my-8"
      >
        <View className="flex-1 h-px bg-borderLight dark:bg-borderDark" />
        <Text className="px-4 text-sm text-gray-500 dark:text-gray-400">
          Or continue with
        </Text>
        <View className="flex-1 h-px bg-borderLight dark:bg-borderDark" />
      </Animated.View>

      {/* Social Sign In Buttons */}
      <View className="flex gap-4">
        {/* Google Sign In */}
        <Animated.View entering={FadeInRight.duration(200).delay(500)}>
          <Button
            onPress={() => {}}
            title="Continue with Google"
            variant="secondary"
            fullWidth
            size="large"
          >
            <View className="flex-row items-center">
              <GoogleIcon />
              <Text className="font-semibold text-foreground dark:text-foreground-dark ml-2">
                Continue with Google
              </Text>
            </View>
          </Button>
        </Animated.View>

        {/* Apple Sign In */}
        <Animated.View entering={FadeInRight.duration(200).delay(600)}>
          <Button
            onPress={() => {}}
            title="Continue with Apple"
            variant="secondary"
            fullWidth
            size="large"
          >
            <View className="flex-row items-center">
              <AppleIcon isDark={isDark} />
              <Text className="font-semibold text-foreground dark:text-foreground-dark ml-2">
                Continue with Apple
              </Text>
            </View>
          </Button>
        </Animated.View>

        {/* GitHub Sign In */}
        <Animated.View entering={FadeInRight.duration(200).delay(700)}>
          <Button
            onPress={() => {}}
            title="Continue with GitHub"
            variant="secondary"
            fullWidth
            size="large"
          >
            <View className="flex-row items-center">
              <GithubIcon isDark={isDark} />
              <Text className="font-semibold text-foreground dark:text-foreground-dark ml-2">
                Continue with GitHub
              </Text>
            </View>
          </Button>
        </Animated.View>
      </View>

      {/* Toggle Sign Up/Sign In */}
      <View className="mt-6 items-center">
        <Text className="text-sm text-foreground dark:text-foreground-dark">
          {toggleText}{" "}
          <Text
            onPress={() => router.push(toggleRoute)}
            className="text-primary font-bold"
          >
            {toggleCta}
          </Text>
        </Text>
      </View>
    </View>
  );
}
