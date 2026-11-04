import { ArrowDown, ArrowUp } from "lucide-react-native";
import { View } from "react-native";

import { IconButton } from "@/ui/IconButton";

type MoveButtonsProps = {
  name: string;
  onMove: (direction: -1 | 1) => void;
};

/** Reorder controls, usable by touch and by screen reader. */
export function MoveButtons({ name, onMove }: MoveButtonsProps) {
  return (
    <View className="flex-row">
      <IconButton icon={ArrowUp} label={`Move ${name} up`} onPress={() => onMove(-1)} />
      <IconButton icon={ArrowDown} label={`Move ${name} down`} onPress={() => onMove(1)} />
    </View>
  );
}
