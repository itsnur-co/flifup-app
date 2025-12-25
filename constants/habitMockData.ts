/**
 * Mock Data for Habits Feature
 */

import { Habit, HabitCategory, HabitStats } from "@/types/habit";

export const MOCK_HABIT_CATEGORIES: HabitCategory[] = [
  { id: "1", name: "Exercise", color: "#9039FF" },
  { id: "2", name: "Prayer", color: "#3B82F6" },
  { id: "3", name: "Diet", color: "#10B981" },
  { id: "4", name: "Meditation", color: "#F59E0B" },
  { id: "5", name: "Sleep", color: "#EC4899" },
  { id: "6", name: "Hydration", color: "#06B6D4" },
];

export const MOCK_HABITS: Habit[] = [
  {
    id: "1",
    name: "Running",
    repeat: { type: "daily", days: ["monday", "wednesday", "friday"] },
    startDate: new Date("2025-06-01"),
    goal: { value: 5, unit: "km", frequency: "per day" },
    category: { id: "1", name: "Exercise", color: "#9039FF" },
    reminder: "06:00",
    comment: null,
    completed: false,
    completedDates: ["2025-06-01", "2025-06-02"],
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-03"),
  },
  {
    id: "2",
    name: "Fajr",
    repeat: {
      type: "daily",
      days: [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
    },
    startDate: new Date("2025-06-01"),
    goal: null,
    category: { id: "2", name: "Prayer", color: "#3B82F6" },
    reminder: "05:00",
    comment: null,
    completed: false,
    completedDates: [],
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-01"),
  },
  {
    id: "3",
    name: "Maghrib",
    repeat: {
      type: "daily",
      days: [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
    },
    startDate: new Date("2025-06-01"),
    goal: null,
    category: { id: "2", name: "Prayer", color: "#3B82F6" },
    reminder: "18:30",
    comment: null,
    completed: false,
    completedDates: [],
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-01"),
  },
  {
    id: "4",
    name: "Running",
    repeat: { type: "daily", days: ["monday", "wednesday", "friday"] },
    startDate: new Date("2025-05-01"),
    goal: { value: 5, unit: "km", frequency: "per day" },
    category: { id: "1", name: "Exercise", color: "#9039FF" },
    reminder: "06:00",
    comment: null,
    completed: true,
    completedDates: ["2025-06-01", "2025-06-02", "2025-06-03"],
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-06-03"),
  },
  {
    id: "5",
    name: "Running",
    repeat: { type: "daily", days: ["monday", "wednesday", "friday"] },
    startDate: new Date("2025-05-15"),
    goal: { value: 5, unit: "km", frequency: "per day" },
    category: { id: "1", name: "Exercise", color: "#9039FF" },
    reminder: "06:00",
    comment: null,
    completed: true,
    completedDates: ["2025-06-01", "2025-06-02", "2025-06-03"],
    createdAt: new Date("2025-05-15"),
    updatedAt: new Date("2025-06-03"),
  },
  {
    id: "6",
    name: "Running",
    repeat: { type: "daily", days: ["monday", "wednesday", "friday"] },
    startDate: new Date("2025-05-20"),
    goal: { value: 5, unit: "km", frequency: "per day" },
    category: { id: "1", name: "Exercise", color: "#9039FF" },
    reminder: "06:00",
    comment: null,
    completed: true,
    completedDates: ["2025-06-01", "2025-06-02", "2025-06-03"],
    createdAt: new Date("2025-05-20"),
    updatedAt: new Date("2025-06-03"),
  },
];

export const MOCK_HABIT_STATS: HabitStats = {
  totalDays: 30,
  completedDays: 26,
  currentStreak: 5,
  longestStreak: 12,
  completionRate: 88,
  weeklyData: [40, 55, 35, 60, 70, 85, 75],
};

export const MOCK_SINGLE_HABIT_STATS: HabitStats = {
  totalDays: 30,
  completedDays: 20,
  currentStreak: 3,
  longestStreak: 8,
  completionRate: 65,
  weeklyData: [30, 45, 25, 55, 65, 80, 70],
};

// Filter category counts
export const getCategoryFilterCounts = (habits: Habit[]) => {
  const counts: Record<string, number> = { all: habits.length };

  habits.forEach((habit) => {
    if (habit.category) {
      const categoryName = habit.category.name;
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    }
  });

  return counts;
};

// Get habits by completion status for today
export const getHabitsByStatus = (habits: Habit[], date: Date = new Date()) => {
  const dateStr = date.toISOString().split("T")[0];

  const today: Habit[] = [];
  const completed: Habit[] = [];

  habits.forEach((habit) => {
    if (habit.completedDates.includes(dateStr) || habit.completed) {
      completed.push(habit);
    } else {
      today.push(habit);
    }
  });

  return { today, completed };
};
