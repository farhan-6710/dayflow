import { View } from "react-native";

import { Card } from "@/ui/Card";
import { SectionHeader } from "@/ui/SectionHeader";
import { Text } from "@/ui/Text";

type SummaryCardProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  rows: { label: string; value: string | number }[];
};

export function SummaryCard({ title, actionLabel, onAction, rows }: SummaryCardProps) {
  return (
    <Card className="gap-1">
      <SectionHeader title={title} actionLabel={actionLabel} onAction={onAction} />
      {rows.map((row, index) => (
        <View key={row.label} className={`flex-row items-center justify-between gap-3 py-2 ${index > 0 ? "border-t border-border" : ""}`}>
          <Text tone="muted">{row.label}</Text>
          <Text>{row.value}</Text>
        </View>
      ))}
    </Card>
  );
}
