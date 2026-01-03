/**
 * Goal-related type definitions
 * Centralized types for goal management feature
 * Aligned with backend Goal model
 */

import type { Task } from "./task";
import type { TaskCategory } from "./task";

// ============================================
// Core Interfaces
// ============================================

export interface Goal {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  targetValue?: number;
  currentValue: number;
  unit?: string;
  deadline?: string;
  levels?: string[]; // Array of level names: ["Level 1", "Level 2"]
  categoryId?: string;
  category?: TaskCategory;
  isCompleted: boolean;
  completedAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
  // Computed fields (calculated on frontend)
  progress?: number; // 0-100
  taskCounts?: {
    total: number;
    completed: number;
    incomplete: number;
  };
}

export interface GoalDetail extends Goal {
  tasks: Task[];
  tasksGrouped?: {
    incomplete: Task[];
    completed: Task[];
  };
}

// ============================================
// DTOs (Request/Response)
// ============================================

export interface CreateGoalRequest {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  targetValue?: number;
  unit?: string;
  deadline?: string;
  levels?: string[];
  categoryId?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  levels?: string[];
  categoryId?: string;
  isCompleted?: boolean;
}

export interface QueryGoalsRequest {
  isCompleted?: boolean;
  search?: string;
}

// ============================================
// Form State
// ============================================

export interface GoalFormState {
  title: string;
  description: string;
  deadline: Date | null;
  levels: string[]; // Selected level types
  category: TaskCategory | null;
  icon?: string;
  color?: string;
  targetValue?: number;
  unit?: string;
}

export const DEFAULT_GOAL_FORM: GoalFormState = {
  title: "",
  description: "",
  deadline: null,
  levels: [],
  category: null,
  icon: undefined,
  color: undefined,
  targetValue: undefined,
  unit: undefined,
};

// ============================================
// Level Options
// ============================================

export interface LevelOption {
  id: string;
  name: string;
  label: string;
}

export const LEVEL_OPTIONS: LevelOption[] = [
  { id: "level-1", name: "Level 1", label: "Level 1" },
  { id: "level-2", name: "Level 2", label: "Level 2" },
  { id: "level-3", name: "Level 3", label: "Level 3" },
  { id: "level-4", name: "Level 4", label: "Level 4" },
];

// ============================================
// Utility Types
// ============================================

export type GoalSortField = "createdAt" | "deadline" | "title" | "progress";
export type GoalSortOrder = "asc" | "desc";

export interface GoalFilters {
  isCompleted?: boolean;
  categoryId?: string;
  search?: string;
  hasDeadline?: boolean;
}

export interface GoalSort {
  field: GoalSortField;
  order: GoalSortOrder;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate progress percentage based on task completion
 */
export function calculateGoalProgress(goal: Goal): number {
  if (!goal._count?.tasks || goal._count.tasks === 0) {
    return 0;
  }

  const completedCount = goal.taskCounts?.completed || 0;
  const totalCount = goal._count.tasks;

  return Math.round((completedCount / totalCount) * 100);
}

/**
 * Calculate task counts for a goal
 */
export function calculateTaskCounts(tasks: Task[]): {
  total: number;
  completed: number;
  incomplete: number;
} {
  const total = tasks.length;
  const completed = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const incomplete = total - completed;

  return { total, completed, incomplete };
}

/**
 * Group tasks by completion status
 */
export function groupTasksByCompletion(tasks: Task[]): {
  incomplete: Task[];
  completed: Task[];
} {
  const incomplete = tasks.filter((task) => task.status !== "COMPLETED");
  const completed = tasks.filter((task) => task.status === "COMPLETED");

  return { incomplete, completed };
}

/**
 * Check if goal is overdue
 */
export function isGoalOverdue(goal: Goal): boolean {
  if (!goal.deadline || goal.isCompleted) {
    return false;
  }

  const deadlineDate = new Date(goal.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return deadlineDate < today;
}

/**
 * Format goal deadline as human-readable text
 */
export function formatGoalDeadline(goal: Goal): string | null {
  if (!goal.deadline) {
    return null;
  }

  const deadlineDate = new Date(goal.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if it's today
  if (deadlineDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Check if it's tomorrow
  if (deadlineDate.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  // Format as date
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: deadlineDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  };

  return deadlineDate.toLocaleDateString("en-US", options);
}

/**
 * Convert GoalFormState to CreateGoalRequest
 */
export function goalFormToRequest(
  form: GoalFormState
): CreateGoalRequest {
  return {
    title: form.title,
    description: form.description || undefined,
    icon: form.icon,
    color: form.color,
    targetValue: form.targetValue,
    unit: form.unit,
    deadline: form.deadline ? form.deadline.toISOString() : undefined,
    levels: form.levels.length > 0 ? form.levels : undefined,
    categoryId: form.category?.id,
  };
}
