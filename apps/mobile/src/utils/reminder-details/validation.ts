export const validateHour = (hour: number): boolean => {
  return hour >= 0 && hour <= 23;
};

export const validateMinute = (minute: number): boolean => {
  return minute >= 0 && minute <= 59;
};

export const sanitizeTimeInput = (value: string, max: number): string => {
  const numericValue = value.replace(/[^0-9]/g, "");
  const numValue = parseInt(numericValue, 10);

  if (isNaN(numValue)) return "";
  if (numValue > max) return max.toString();

  return numericValue;
};
