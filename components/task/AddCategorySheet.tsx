/**
 * Task Add Category Sheet
 * Re-exports shared AddCategorySheet with task-specific defaults
 */

import { Category } from "@/types/task";

// Re-export the shared component
export { AddCategorySheet } from "@/components/shared";

// Default task categories
export const DEFAULT_TASK_CATEGORIES: Category[] = [
  { id: "1", name: "Exercise", color: "#10B981" },
  { id: "2", name: "Prayer", color: "#9039FF" },
  { id: "3", name: "Diet", color: "#F59E0B" },
  { id: "4", name: "Meditation", color: "#3B82F6" },
  { id: "5", name: "Sleep", color: "#8B5CF6" },
  { id: "6", name: "Hydration", color: "#06B6D4" },
];
