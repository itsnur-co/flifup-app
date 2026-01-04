/**
 * Habit Types & Interfaces
 * Complete type definitions for the habit tracking feature
 */

// Repeat Types
export type RepeatType = 'daily' | 'monthly' | 'interval';

export type DayOfWeek =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

export type IntervalOption = 2 | 3 | 4 | 5 | 6 | 7;

export interface DailyRepeat {
  type: 'daily';
  days: DayOfWeek[];
}

export interface MonthlyRepeat {
  type: 'monthly';
  dayOfMonth: number; // 1-31
}

export interface IntervalRepeat {
  type: 'interval';
  everyDays: IntervalOption;
}

export type RepeatConfig = DailyRepeat | MonthlyRepeat | IntervalRepeat;

// Goal Types
export type GoalUnit = 'km' | 'mins' | 'hours';
export type GoalFrequency = 'per day' | 'per week' | 'per month';

export interface HabitGoal {
  value: number;
  unit: GoalUnit;
  frequency: GoalFrequency;
}

// Category Types
export interface HabitCategory {
  id: string;
  name: string;
  color?: string;
}

// Main Habit Interface
export interface Habit {
  id: string;
  name: string;
  repeat: RepeatConfig;
  startDate: Date | null;
  goal: HabitGoal | null;
  category: HabitCategory | null;
  goalId?: string | null; // Link to Goal
  reminder: string | null; // Time string e.g., "08:00"
  comment: string | null;
  completed: boolean;
  completedDates: string[]; // ISO date strings
  createdAt: Date;
  updatedAt: Date;
}

// Form State
export interface HabitFormState {
  name: string;
  repeat: RepeatConfig;
  startDate: Date | null;
  goal: HabitGoal | null;
  category: HabitCategory | null;
  goalId?: string | null; // Link to Goal
  reminder: string | null;
  comment: string | null;
}

// Progress Data
export interface HabitProgressData {
  date: string;
  completed: boolean;
  value?: number;
}

export interface HabitStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyData: number[]; // Last 7 days completion percentage
}

// Default Values
export const DEFAULT_HABIT_FORM: HabitFormState = {
  name: '',
  repeat: { type: 'daily', days: [] },
  startDate: null,
  goal: null,
  category: null,
  goalId: null,
  reminder: null,
  comment: null,
};

export const DEFAULT_HABIT_CATEGORIES: HabitCategory[] = [
  { id: '1', name: 'Exercise', color: '#9039FF' },
  { id: '2', name: 'Prayer', color: '#3B82F6' },
  { id: '3', name: 'Diet', color: '#10B981' },
  { id: '4', name: 'Meditation', color: '#F59E0B' },
  { id: '5', name: 'Sleep', color: '#EC4899' },
  { id: '6', name: 'Hydration', color: '#06B6D4' },
];

export const DAYS_OF_WEEK: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
];

export const INTERVAL_OPTIONS: IntervalOption[] = [2, 3, 4, 5, 6, 7];

export const GOAL_UNITS: GoalUnit[] = ['km', 'mins', 'hours'];
export const GOAL_FREQUENCIES: GoalFrequency[] = ['per day', 'per week', 'per month'];
