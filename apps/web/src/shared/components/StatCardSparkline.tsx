import type { StatCardSparklineProps } from "@/shared/types/components";

/** Plain SVG, so a stat card doesn't pull in the chart library. Decorative: the number carries the meaning. */
export function StatCardSparkline({ values }: StatCardSparklineProps) {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${28 - (value / max) * 26}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true" className="mt-3 h-8 w-full text-chart-1">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
