import { Folder } from "lucide-react-native";
import { View } from "react-native";

/** A project's own colour is the one place stored hex values appear. */
export function ProjectChip({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <View style={{ backgroundColor: color, width: size, height: size }} className="items-center justify-center rounded-xl">
      <Folder size={size * 0.5} color="#ffffff" />
    </View>
  );
}
