import React from "react";
import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import Button from "@components/atoms/Button";
import InputField from "@components/molecules/InputField";
import { useForm } from "@hooks/form/useForm";
import { useSignup } from "@hooks/auth/useSignup";
import { useFieldFocus } from "@hooks/form/useFieldFocus";
import { usePasswordToggle } from "@hooks/auth/usePasswordToggle";

export default function SignupFormSection() {
  const { formData, setField } = useForm({
    fullName: "",
    email: "",
    password: "",
  });
  const { handleSignup, loading } = useSignup();
  const { showPassword, togglePassword } = usePasswordToggle();
  const { focusedField, handleFocus, handleBlur } = useFieldFocus<
    "fullName" | "email" | "password"
  >();

  const handleSubmit = () => {
    handleSignup(formData);
  };

  return (
    <View>
      {/* Full Name Field */}
      <Animated.View
        className="mb-4"
        entering={FadeInRight.duration(200).delay(100)}
      >
        <InputField
          icon="person-outline"
          label="Full Name"
          value={formData.fullName}
          onChange={(value) => setField("fullName", value)}
          placeholder="John Doe"
          autoCapitalize="words"
          isFocused={focusedField === "fullName"}
          onFocus={() => handleFocus("fullName")}
          onBlur={handleBlur}
        />
      </Animated.View>

      {/* Email Field */}
      <Animated.View
        className="mb-4"
        entering={FadeInRight.duration(200).delay(200)}
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
        entering={FadeInRight.duration(200).delay(300)}
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

      {/* Primary Action Button */}
      <Animated.View entering={FadeInRight.duration(200).delay(400)}>
        <Button
          onPress={handleSubmit}
          title="Create Account"
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
