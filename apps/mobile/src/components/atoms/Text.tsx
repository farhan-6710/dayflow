import React, { ReactNode } from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";

interface AppTextProps extends TextProps {
  children: ReactNode;
  className?: string;
  style?: TextStyle | TextStyle[];
}

export default function Text({
  children,
  className = "",
  style,
  ...props
}: AppTextProps) {
  const mergedClassName = `font-cinzel ${className}`.trim();

  return (
    <RNText
      className={mergedClassName}
      style={style}
      numberOfLines={1}
      {...props}
    >
      {children}
    </RNText>
  );
}
