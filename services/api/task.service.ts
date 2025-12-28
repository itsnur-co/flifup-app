/**
 * Tasks API Service
 * Handles all task-related API calls
 */

import { ApiResponse, httpClient } from "./client";

// ============================================
// Types
// ============================================

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskRepeat = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
export type ReminderUnit = "MINUTES" | "HOURS" | "DAYS";
export type CollaboratorRole = "VIEWER" | "EDITOR";

export interface TaskCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  userId?: string;
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
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface TaskReminder {
  id: string;
  value: number;
  unit: ReminderUnit;
  scheduledAt: string;
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
  estimatedTime?: number;
  actualTime?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  subtasks: TaskSubtask[];
  category?: TaskCategory;
  collaborators?: TaskCollaborator[];
  reminders?: TaskReminder[];
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
  estimatedTime?: number;
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
  estimatedTime?: number;
}

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

export interface CreateSubtaskRequest {
  title: string;
}

export interface UpdateSubtaskRequest {
  title?: string;
  isCompleted?: boolean;
}

export interface ReorderSubtasksRequest {
  subtaskIds: string[];
}

export interface TaskOverviewStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  overdue: number;
  dueToday: number;
  avgCompletionTime: number;
  thisWeek: {
    total: number;
    completed: number;
  };
  thisMonth: {
    completed: number;
  };
}

export interface TaskWeeklyStats {
  week: Array<{
    date: string;
    dayName: string;
    total: number;
    completed: number;
  }>;
}

export interface TaskMonthlyStats {
  year: number;
  month: number;
  daysInMonth: number;
  days: Array<{
    day: number;
    date: string;
    total: number;
    completed: number;
  }>;
  summary: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
}

// ============================================
// Helper Functions
// ============================================

const buildQueryString = (params: Record<string, any>): string => {
  const query = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return query ? `?${query}` : "";
};

// ============================================
// Task Service
// ============================================

export const taskService = {
  // ============================================
  // Task CRUD Operations
  // ============================================

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return httpClient.post<Task>("/tasks", data, true);
  },

  /**
   * Get all tasks with pagination and filtering
   */
  async getTasks(
    params?: TaskQueryParams
  ): Promise<ApiResponse<TaskListResponse>> {
    const queryString = params ? buildQueryString(params) : "";
    return httpClient.get<TaskListResponse>(`/tasks${queryString}`, true);
  },

  /**
   * Get today's tasks
   */
  async getTodayTasks(): Promise<ApiResponse<Task[]>> {
    return httpClient.get<Task[]>("/tasks/today", true);
  },

  /**
   * Get upcoming tasks (next 7 days)
   */
  async getUpcomingTasks(): Promise<ApiResponse<Task[]>> {
    return httpClient.get<Task[]>("/tasks/upcoming", true);
  },

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<ApiResponse<Task[]>> {
    return httpClient.get<Task[]>("/tasks/overdue", true);
  },

  /**
   * Get list of projects
   */
  async getProjects(): Promise<ApiResponse<string[]>> {
    return httpClient.get<string[]>("/tasks/projects", true);
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<ApiResponse<Task>> {
    return httpClient.get<Task>(`/tasks/${id}`, true);
  },

  /**
   * Update a task
   */
  async updateTask(
    id: string,
    data: UpdateTaskRequest
  ): Promise<ApiResponse<Task>> {
    return httpClient.patch<Task>(`/tasks/${id}`, data, true);
  },

  /**
   * Update task status
   */
  async updateTaskStatus(
    id: string,
    status: TaskStatus
  ): Promise<ApiResponse<Task>> {
    return httpClient.patch<Task>(`/tasks/${id}/status`, { status }, true);
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`/tasks/${id}`, true);
  },

  // ============================================
  // Subtask Operations
  // ============================================

  /**
   * Add a subtask to a task
   */
  async addSubtask(
    taskId: string,
    data: CreateSubtaskRequest
  ): Promise<ApiResponse<TaskSubtask>> {
    return httpClient.post<TaskSubtask>(
      `/tasks/${taskId}/subtasks`,
      data,
      true
    );
  },

  /**
   * Update a subtask
   */
  async updateSubtask(
    taskId: string,
    subtaskId: string,
    data: UpdateSubtaskRequest
  ): Promise<ApiResponse<TaskSubtask>> {
    return httpClient.patch<TaskSubtask>(
      `/tasks/${taskId}/subtasks/${subtaskId}`,
      data,
      true
    );
  },

  /**
   * Toggle subtask completion
   */
  async toggleSubtask(
    taskId: string,
    subtaskId: string
  ): Promise<ApiResponse<TaskSubtask>> {
    return httpClient.patch<TaskSubtask>(
      `/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
      {},
      true
    );
  },

  /**
   * Delete a subtask
   */
  async deleteSubtask(
    taskId: string,
    subtaskId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/tasks/${taskId}/subtasks/${subtaskId}`,
      true
    );
  },

  /**
   * Reorder subtasks
   */
  async reorderSubtasks(
    taskId: string,
    subtaskIds: string[]
  ): Promise<ApiResponse<TaskSubtask[]>> {
    return httpClient.patch<TaskSubtask[]>(
      `/tasks/${taskId}/subtasks/reorder`,
      { subtaskIds },
      true
    );
  },

  // ============================================
  // Category Operations
  // ============================================

  /**
   * Get all task categories
   */
  async getCategories(): Promise<ApiResponse<TaskCategory[]>> {
    return httpClient.get<TaskCategory[]>("/tasks/categories", true);
  },

  /**
   * Create a task category
   */
  async createCategory(data: {
    name: string;
    icon?: string;
    color?: string;
  }): Promise<ApiResponse<TaskCategory>> {
    return httpClient.post<TaskCategory>("/tasks/categories", data, true);
  },

  /**
   * Update a task category
   */
  async updateCategory(
    id: string,
    data: { name?: string; icon?: string; color?: string }
  ): Promise<ApiResponse<TaskCategory>> {
    return httpClient.patch<TaskCategory>(
      `/tasks/categories/${id}`,
      data,
      true
    );
  },

  /**
   * Delete a task category
   */
  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/tasks/categories/${id}`,
      true
    );
  },

  // ============================================
  // Statistics Operations
  // ============================================

  /**
   * Get overview statistics
   */
  async getOverviewStats(): Promise<ApiResponse<TaskOverviewStats>> {
    return httpClient.get<TaskOverviewStats>("/tasks/stats/overview", true);
  },

  /**
   * Get weekly statistics
   */
  async getWeeklyStats(): Promise<ApiResponse<TaskWeeklyStats>> {
    return httpClient.get<TaskWeeklyStats>("/tasks/stats/weekly", true);
  },

  /**
   * Get monthly statistics
   */
  async getMonthlyStats(params?: {
    year?: number;
    month?: number;
  }): Promise<ApiResponse<TaskMonthlyStats>> {
    const queryString = params ? buildQueryString(params) : "";
    return httpClient.get<TaskMonthlyStats>(
      `/tasks/stats/monthly${queryString}`,
      true
    );
  },
};

export default taskService;
