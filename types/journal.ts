/**
 * Journal Types & Interfaces
 * Complete type definitions for the journal feature
 */

// Mood enum values matching API
export type MoodType = "VERY_HAPPY" | "HAPPY" | "NEUTRAL" | "SAD" | "VERY_SAD";

// Visibility options
export type VisibilityType = "ONLY_ME" | "SHARED";

// Mood configuration for UI
export interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
}

// Journal category
export interface JournalCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId?: string;
  _count?: {
    journals: number;
  };
}

// Journal entry
export interface Journal {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  mood?: MoodType;
  visibility: VisibilityType;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: JournalCategory;
}

// Create journal request
export interface CreateJournalRequest {
  title: string;
  description?: string;
  categoryId?: string;
  mood?: MoodType;
  visibility?: VisibilityType;
}

// Update journal request
export interface UpdateJournalRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  mood?: MoodType;
  visibility?: VisibilityType;
}

// Create category request
export interface CreateCategoryRequest {
  name: string;
  icon?: string;
  color?: string;
}

// Update category request
export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  color?: string;
}

// Journal list response with pagination
export interface JournalListResponse {
  data: Journal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query parameters for journal list
export interface JournalQueryParams {
  categoryId?: string;
  mood?: MoodType;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Daily mood data for insights
export interface DailyMood {
  date: string;
  dayName: string;
  mood: MoodType | null;
  moodValue: number | null;
  journalCount: number;
}

// Mood insights response
export interface MoodInsightsResponse {
  period: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  overall: {
    totalJournals: number;
    journalsWithMood: number;
    avgMoodValue: number;
  };
  moodDistribution: Record<MoodType, number>;
  dailyMoods: DailyMood[];
}

// Statistics response
export interface JournalStatisticsResponse {
  total: number;
  thisWeek: number;
  thisMonth: number;
  byMood: Array<{ mood: MoodType; count: number }>;
  byCategory: Array<{ categoryId: string | null; count: number }>;
}

// Form state for creating/editing journals
export interface JournalFormState {
  title: string;
  description: string;
  categoryId: string | null;
  mood: MoodType | null;
  visibility: VisibilityType;
}

// Default form values
export const DEFAULT_JOURNAL_FORM: JournalFormState = {
  title: "",
  description: "",
  categoryId: null,
  mood: null,
  visibility: "ONLY_ME",
};

// Mood options for UI display
export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: "VERY_HAPPY",
    emoji: "reaction1", // Custom SVG icon
    label: "Feeling Happy",
    color: "#9039FF",
  },
  { value: "HAPPY", emoji: "reaction2", label: "Feeling Good", color: "#F59E0B" },
  { value: "NEUTRAL", emoji: "reaction3", label: "Feeling okay", color: "#6B7280" },
  { value: "SAD", emoji: "reaction4", label: "Feeling Down", color: "#3B82F6" },
  { value: "VERY_SAD", emoji: "reaction5", label: "Feeling Sad", color: "#EF4444" },
];

// Mood value mapping for calculations
export const MOOD_VALUES: Record<MoodType, number> = {
  VERY_HAPPY: 5,
  HAPPY: 4,
  NEUTRAL: 3,
  SAD: 2,
  VERY_SAD: 1,
};

// Default categories matching API
export const DEFAULT_JOURNAL_CATEGORIES: Omit<
  JournalCategory,
  "id" | "userId"
>[] = [
  { name: "Exercise", icon: "🏃", color: "#10B981", isDefault: true },
  { name: "Prayer", icon: "🙏", color: "#8B5CF6", isDefault: true },
  { name: "Diet", icon: "🥗", color: "#F59E0B", isDefault: true },
  { name: "Meditation", icon: "🧘", color: "#6366F1", isDefault: true },
  { name: "Sleep", icon: "😴", color: "#3B82F6", isDefault: true },
  { name: "Hydration", icon: "💧", color: "#06B6D4", isDefault: true },
];

// Visibility options for UI
export const VISIBILITY_OPTIONS = [
  { value: "ONLY_ME" as VisibilityType, label: "Only me", icon: "🔒" },
  { value: "SHARED" as VisibilityType, label: "Shared", icon: "🌍" },
];

// Get mood option by value
export const getMoodOption = (mood: MoodType): MoodOption | undefined => {
  return MOOD_OPTIONS.find((option) => option.value === mood);
};

// Get mood emoji by value
export const getMoodEmoji = (mood: MoodType): string => {
  return getMoodOption(mood)?.emoji || "😐";
};

// Get mood label by value
export const getMoodLabel = (mood: MoodType): string => {
  return getMoodOption(mood)?.label || "Unknown";
};
