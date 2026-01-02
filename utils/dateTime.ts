/**
 * Date and Time Utility Functions
 * Centralized formatting and manipulation utilities
 */

// ============================================
// Date Formatting
// ============================================

/**
 * Format a date string or Date object for display
 * @param date - ISO string or Date object
 * @param options - Formatting options
 */
export const formatDate = (
  date: string | Date | undefined | null,
  options?: {
    includeYear?: boolean;
    includeWeekday?: boolean;
    shortFormat?: boolean;
  }
): string => {
  if (!date) return "No date";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "Invalid date";

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today
  if (isSameDay(dateObj, today)) {
    return "Today";
  }

  // Check if tomorrow
  if (isSameDay(dateObj, tomorrow)) {
    return "Tomorrow";
  }

  const {
    includeYear = false,
    includeWeekday = false,
    shortFormat = false,
  } = options || {};

  if (shortFormat) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return dateObj.toLocaleDateString("en-US", {
    weekday: includeWeekday ? "short" : undefined,
    month: "short",
    day: "numeric",
    year: includeYear ? "numeric" : undefined,
  });
};

/**
 * Format date for display in task cards
 */
export const formatTaskDate = (
  date: string | Date | undefined | null
): string => {
  return formatDate(date, { shortFormat: true });
};

/**
 * Format date for task details view
 */
export const formatDetailDate = (
  date: string | Date | undefined | null
): string => {
  if (!date) return "No date";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format date for API requests (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Parse date string to Date object safely
 */
export const parseDate = (
  dateString: string | undefined | null
): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// ============================================
// Time Formatting
// ============================================

/**
 * Format time for display (e.g., "2:30 PM")
 */
export const formatTime = (time: string | undefined | null): string => {
  if (!time) return "";

  // If already in 12-hour format, return as is
  if (time.includes("AM") || time.includes("PM")) {
    return time;
  }

  // Convert from HH:mm to 12-hour format
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Format time for API (HH:mm)
 */
export const formatTimeForApi = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format duration in minutes to human readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format duration for focus mode display (MM:SS)
 */
export const formatFocusDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// ============================================
// Reminder Formatting
// ============================================

export type ReminderUnit = "MINUTES" | "HOURS" | "DAYS";

/**
 * Format reminder for display
 */
export const formatReminder = (value: number, unit: ReminderUnit): string => {
  const unitLabels: Record<ReminderUnit, { singular: string; plural: string }> =
    {
      MINUTES: { singular: "minute", plural: "minutes" },
      HOURS: { singular: "hour", plural: "hours" },
      DAYS: { singular: "day", plural: "days" },
    };

  const label =
    value === 1 ? unitLabels[unit].singular : unitLabels[unit].plural;
  return `${value} ${label} before`;
};

// ============================================
// Date Comparisons
// ============================================

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date | undefined | null): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isSameDay(dateObj, new Date());
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: string | Date | undefined | null): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
};

/**
 * Check if date is within next N days
 */
export const isWithinDays = (
  date: string | Date | undefined | null,
  days: number
): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const future = new Date(today);
  future.setDate(future.getDate() + days);

  return dateObj >= today && dateObj <= future;
};

// ============================================
// Week/Month Helpers
// ============================================

/**
 * Get the start of the week (Sunday)
 */
export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the end of the week (Saturday)
 */
export const getWeekEnd = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get array of dates for a week
 */
export const getWeekDates = (date: Date = new Date()): Date[] => {
  const start = getWeekStart(date);
  const dates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  return dates;
};

/**
 * Get short day name (e.g., "Mon")
 */
export const getShortDayName = (date: Date): string => {
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Get month name (e.g., "January")
 */
export const getMonthName = (date: Date, short = false): string => {
  return date.toLocaleDateString("en-US", { month: short ? "short" : "long" });
};
