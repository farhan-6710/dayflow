import { Line, LineChart, ResponsiveContainer } from "recharts";

import type { SparklinePoint } from "@/shared/types/statsCards";
import { cn } from "@/shared/lib/utils";

type SparklineProps = {
  data: SparklinePoint[];
  color: string;
  className?: string;
};

export function Sparkline({ data, color, className }: SparklineProps) {
  return (
    <div className={cn("h-7 w-20 shrink-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <Line
            type="bump"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
