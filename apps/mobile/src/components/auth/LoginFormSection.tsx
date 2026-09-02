import React from "react";
import { View, Pressable } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import Text from "@components/atoms/Text";
import Button from "@components/atoms/Button";
import InputField from "@components/molecules/InputField";
import { useForm } from "@hooks/form/useForm";
import { useLogin } from "@hooks/auth/useLogin";
import { useFieldFocus } from "@hooks/form/useFieldFocus";
import { usePasswordToggle } from "@hooks/auth/usePasswordToggle";

export default function LoginFormSection() {
  const { formData, setField } = useForm({ email: "", password: "" });
  const { handleLogin, loading } = useLogin();
  const { showPassword, togglePassword } = usePasswordToggle();
  const { focusedField, handleFocus, handleBlur } = useFieldFocus<
    "email" | "password"
  >();

  const handleSubmit = () => {
    handleLogin(formData);
  };

  return (
    <View>
      {/* Email Field */}
      <Animated.View
        className="mb-4"
        entering={FadeInRight.duration(400).delay(100)}
      >
        <InputField
          icon="mail-outline"
          label="Email"
          value={formData.email}
          onChange={(value) => setField("email", value)}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          isFocused={focusedField === "email"}
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
        />
      </Animated.View>

      {/* Password Field */}
      <Animated.View
        className="mb-4"
        entering={FadeInRight.duration(200).delay(200)}
      >
        <InputField
          icon="lock-closed-outline"
          label="Password"
          value={formData.password}
          onChange={(value) => setField("password", value)}
          placeholder="••••••••"
          secureTextEntry
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={togglePassword}
          autoCapitalize="none"
          autoCorrect={false}
          isFocused={focusedField === "password"}
          onFocus={() => handleFocus("password")}
          onBlur={handleBlur}
        />
      </Animated.View>

      {/* Forgot Password */}
      <Animated.View
        className="items-end mb-4"
        entering={FadeInRight.duration(200).delay(300)}
      >
        <Pressable>
          <Text className="text-sm text-primary font-semibold">
            Forgot Password?
          </Text>
        </Pressable>
      </Animated.View>

      {/* Primary Action Button */}
      <Animated.View entering={FadeInRight.duration(200).delay(400)}>
        <Button
          onPress={handleSubmit}
          title="Log In"
          variant="primary"
          size="large"
          loading={loading}
          disabled={loading}
          fullWidth
          className="mt-2"
        />
      </Animated.View>
    </View>
  );
}
