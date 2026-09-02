/**
 * Get the color for a bar based on completion percentage
 *
 * @param percentage - Completion percentage (0-100)
 * @param colors - Theme colors object
 * @returns Color string for the bar
 *
 * @example
 * const color = getBarColor(85, colors);
 * // Returns: colors.primary (for high performance)
 */
export const getBarColor = (
  percentage: number,
  colors: { primary: string; warning: string; error: string }
): string => {
  if (percentage >= 80) return colors.primary;
  if (percentage >= 50) return colors.warning;
  return colors.error;
};

/**
 * Get the background class for a bar based on completion percentage
 *
 * @param percentage - Completion percentage (0-100)
 * @returns Tailwind CSS class string for background
 *
 * @example
 * const bgClass = getBarBgClass(85);
 * // Returns: "bg-primary/10 dark:bg-primary/20"
 */
export const getBarBgClass = (percentage: number): string => {
  if (percentage >= 80) return "bg-primary/10 dark:bg-primary/20";
  if (percentage >= 50) return "bg-amber-100 dark:bg-amber-900/30";
  return "bg-red-100 dark:bg-red-900/30";
};
