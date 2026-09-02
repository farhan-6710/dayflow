/**
 * Get user initials from name
 * @param name - Full name of the user
 * @returns Initials (max 2 characters)
 */
export const getUserInitials = (name: string): string => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

/**
 * Format date to readable string
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatJoinedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return `Joined ${date.toLocaleDateString("en-US", options)}`;
};

/**
 * Get theme display name
 * @param theme - Theme preference
 * @returns Display name for theme
 */
export const getThemeDisplayName = (
  theme: "light" | "dark" | "auto"
): string => {
  const themeNames = {
    light: "Light",
    dark: "Dark",
    auto: "Auto (System)",
  };
  return themeNames[theme];
};
