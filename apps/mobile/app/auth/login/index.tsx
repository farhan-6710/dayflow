import React from "react";
import { Stack, useRouter } from "expo-router";
import { View, ScrollView } from "react-native";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginFormSection from "@/components/auth/LoginFormSection";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginRoute() {
  const router = useRouter();

  const handleBackPress = () => {
    router.push("/(tabs)");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background dark:bg-background-dark">
        <AuthHeader
          title="Log in"
          subtitle="Organize your day, amplify your flow"
          showNavigationHeader={true}
          onBackPress={handleBackPress}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-8 py-8">
            <LoginFormSection />
            <AuthFooter type="login" />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
