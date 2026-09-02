// Utility functions for reminders

export function formatDisplayTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour
    .toString()
    .padStart(2, "0")}:${displayMinute} ${period}`;
}

export const getReminderIcon = (reminderName: string, hour?: number) => {
  // If hour is provided, use time-based icons
  if (hour !== undefined) {
    // Early Morning (4:00 AM - 7:59 AM) - Dawn/Sunrise
    if (hour >= 4 && hour < 8) {
      return "sunny-outline"; // Dawn icon
    }
    // Morning/Midday (8:00 AM - 2:59 PM) - Full sun
    else if (hour >= 8 && hour < 15) {
      return "sunny"; // Bright sun icon
    }
    // Afternoon (3:00 PM - 6:59 PM) - Partly cloudy
    else if (hour >= 15 && hour < 19) {
      return "partly-sunny"; // Afternoon icon
    }
    // Evening (7:00 PM - 9:59 PM) - Sunset
    else if (hour >= 19 && hour < 22) {
      return "moon-outline"; // Evening moon outline
    }
    // Night (10:00 PM - 3:59 AM) - Full moon
    else {
      return "moon"; // Night moon icon
    }
  }

  // Fallback to name-based logic for backward compatibility
  switch (reminderName.toLowerCase()) {
    case "fajr":
      return "sunny-outline";
    case "dhuhr":
      return "sunny";
    case "asr":
      return "partly-sunny";
    case "maghrib":
      return "moon-outline";
    case "isha":
      return "moon";
    default:
      return "notifications";
  }
};
