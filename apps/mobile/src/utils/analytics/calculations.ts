/**
 * Calculate completion percentage
 *
 * @param completed - Number of completed items
 * @param total - Total number of items
 * @returns Percentage rounded to nearest integer
 *
 * @example
 * const percentage = calculatePercentage(8, 10);
 * // Returns: 80
 */
export const calculatePercentage = (
  completed: number,
  total: number
): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};
