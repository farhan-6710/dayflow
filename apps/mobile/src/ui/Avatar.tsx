import { Image, View } from "react-native";

import { Text } from "@/ui/Text";

type AvatarProps = {
  uri?: string | null;
  initials: string;
  size?: number;
};

export function Avatar({ uri, initials, size = 40 }: AvatarProps) {
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={box} accessibilityIgnoresInvertColors />;
  return (
    <View style={box} className="items-center justify-center bg-primary">
      <Text style={{ fontSize: size * 0.38 }} tone="inverse">
        {initials}
      </Text>
    </View>
  );
}
