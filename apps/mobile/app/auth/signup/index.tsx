import React from "react";
import { Stack, useRouter } from "expo-router";
import { View, ScrollView } from "react-native";
import AuthHeader from "@/components/auth/AuthHeader";
import SignupFormSection from "@/components/auth/SignupFormSection";
import AuthFooter from "@/components/auth/AuthFooter";

export default function SignupScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.push("/(tabs)");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background dark:bg-background-dark">
        <AuthHeader
          title="Create account"
          subtitle="Organize your day, amplify your flow"
          showNavigationHeader={true}
          onBackPress={handleBackPress}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-8">
            <SignupFormSection />
            <AuthFooter type="signup" />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
