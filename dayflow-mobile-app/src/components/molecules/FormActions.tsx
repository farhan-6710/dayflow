import React from "react";
import { View } from "react-native";
import { FormActionsProps } from "@types";

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  spacing = "medium",
  className = "",
  ...props
}) => {
  const spacingClasses = {
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
  };

  return (
    <View
      className={`flex-row ${spacingClasses[spacing]} mt-6 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
