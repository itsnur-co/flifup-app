/**
 * Task-related type definitions
 * Centralized types for task management feature
 * Aligned with API contract from TASKS-API.md
 */

// ============================================
// Enums (matching API exactly)
// ============================================

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskRepeat = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
export type ReminderUnit = "MINUTES" | "HOURS" | "DAYS";
export type CollaboratorRole = "VIEWER" | "EDITOR";

// ============================================
// Core Interfaces (matching API)
// ============================================

export interface TaskCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    tasks: number;
  };
}

export interface TaskSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  order: number;
  completedAt?: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCollaborator {
  id: string;
  role: CollaboratorRole;
  addedAt?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
}

export interface TaskReminder {
  id: string;
  value: number;
  unit: ReminderUnit;
  scheduledAt: string;
  sentAt?: string;
  isCustom?: boolean;
  label?: string;
}

export interface TaskGoal {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  isCompleted: boolean;
  completedAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  repeat: TaskRepeat;
  project?: string;
  reminderAt?: string;
  completedAt?: string;
  categoryId?: string;
  goalId?: string;
  estimatedTime?: number;
  actualTime?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
  isCollaborator?: boolean;
  subtasks: TaskSubtask[];
  category?: TaskCategory;
  goal?: TaskGoal;
  collaborators?: TaskCollaborator[];
  reminders?: TaskReminder[];
  _count?: {
    subtasks: number;
  };
}

// Enhanced task detail with grouped subtasks
export interface TaskDetail extends Task {
  subtaskCounts: {
    total: number;
    completed: number;
    incomplete: number;
  };
  subtasksGrouped: {
    incomplete: TaskSubtask[];
    completed: TaskSubtask[];
  };
}

// ============================================
// Request Types
// ============================================

// Inline subtask for creating with task
export interface CreateSubtaskInline {
  title: string;
  order?: number;
  isCompleted?: boolean;
}

// Inline collaborator for creating with task
export interface CreateCollaboratorInline {
  email: string;
}

// Inline reminder for creating with task
export interface CreateReminderInline {
  value: number;
  unit: ReminderUnit;
  isCustom?: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  project?: string;
  priority?: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  repeat?: TaskRepeat;
  reminderAt?: string;
  status?: TaskStatus;
  categoryId?: string;
  goalId?: string;
  estimatedTime?: number;
  // Inline subtasks - created with the task
  subtasks?: CreateSubtaskInline[];
  // Inline collaborators - added when task is created
  collaborators?: CreateCollaboratorInline[];
  // Inline reminders - created with the task
  reminders?: CreateReminderInline[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  project?: string;
  priority?: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  repeat?: TaskRepeat;
  reminderAt?: string;
  status?: TaskStatus;
  categoryId?: string;
  goalId?: string;
  estimatedTime?: number;
}

export interface CreateSubtaskRequest {
  title: string;
  order?: number;
}

export interface UpdateSubtaskRequest {
  title?: string;
  isCompleted?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  icon?: string;
  color?: string;
}

export interface CreateReminderRequest {
  value: number;
  unit: ReminderUnit;
  isCustom?: boolean;
}

// ============================================
// Response Types
// ============================================

export interface TaskListResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  project?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: "dueDate" | "priority" | "createdAt" | "project";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ============================================
// UI/Form State Types
// ============================================

export type DateOption =
  | "today"
  | "tomorrow"
  | "later-this-week"
  | "this-weekend"
  | "next-week"
  | "no-date"
  | "custom";

export interface DateOptionItem {
  id: DateOption;
  label: string;
  icon: string;
  dayLabel?: string;
  getDate: () => Date | null;
}

export type TaskFilterType =
  | "all"
  | "today"
  | "upcoming"
  | "completed"
  | "overdue";

export interface TaskGroup {
  title: string;
  count: number;
  tasks: Task[];
  isExpanded: boolean;
}

// Form state for creating/editing tasks
export interface TaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
  dueTime: string | null;
  repeat: TaskRepeat;
  categoryId: string | null;
  category: TaskCategory | null;
  goalId: string | null;
  estimatedTime: number | null;
  subtasks: { title: string; description?: string }[];
  collaboratorEmails: string[];
  reminders: { value: number; unit: ReminderUnit }[];
}

export const DEFAULT_TASK_FORM: TaskFormState = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: null,
  dueTime: null,
  repeat: "NONE",
  categoryId: null,
  category: null,
  goalId: null,
  estimatedTime: null,
  subtasks: [],
  collaboratorEmails: [],
  reminders: [],
};

// ============================================
// Utility Types
// ============================================

// Reminder value for UI (matches SetReminderSheet)
export interface ReminderValue {
  type: ReminderUnit;
  value: number;
  isCustom?: boolean;
  customDate?: Date;
}

// Person type for collaborators (simplified for UI)
export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Helper to convert collaborator to person
export const collaboratorToPerson = (collab: TaskCollaborator): Person => ({
  id: collab.user.id,
  name: collab.user.fullName,
  email: collab.user.email,
  avatar: collab.user.profileImage,
});

// Helper to check if task is completed
export const isTaskCompleted = (task: Task): boolean =>
  task.status === "COMPLETED";

// Helper to check if task is overdue
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === "COMPLETED") return false;
  return new Date(task.dueDate) < new Date();
};
