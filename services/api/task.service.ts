/**
 * Tasks API Service
 * Complete task management with collaborators, categories, goals,
 * reminders, focus mode, time tracking, and productivity reports.
 */

import { ApiResponse, httpClient } from "./client";

// Re-export types from centralized location
export type {
  CollaboratorRole,
  CreateCategoryRequest,
  CreateReminderRequest,
  CreateSubtaskRequest,
  CreateTaskRequest,
  ReminderUnit,
  Task,
  TaskCategory,
  TaskCollaborator,
  TaskDetail,
  TaskGoal,
  TaskListResponse,
  TaskPriority,
  TaskQueryParams,
  TaskReminder,
  TaskRepeat,
  TaskStatus,
  TaskSubtask,
  UpdateSubtaskRequest,
  UpdateTaskRequest,
} from "@/types/task";

import type {
  CreateCategoryRequest,
  CreateReminderRequest,
  CreateSubtaskRequest,
  CreateTaskRequest,
  Task,
  TaskCategory,
  TaskCollaborator,
  TaskDetail,
  TaskGoal,
  TaskListResponse,
  TaskQueryParams,
  TaskReminder,
  TaskStatus,
  TaskSubtask,
  UpdateSubtaskRequest,
  UpdateTaskRequest,
} from "@/types/task";

// ============================================
// Focus Mode Types
// ============================================

export type FocusSessionStatus = "RUNNING" | "PAUSED" | "COMPLETED" | "QUIT";

export interface FocusSession {
  id: string;
  taskId: string;
  status: FocusSessionStatus;
  initialDuration: number;
  totalDuration: number;
  remainingTime: number;
  pausedAt?: string;
  completedAt?: string;
  finishesAt?: string;
  formattedDuration?: string;
  formattedRemaining?: string;
  formattedTotal?: string;
  currentRemainingTime?: number;
  progress?: number;
  task?: {
    id: string;
    title: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartFocusRequest {
  taskId: string;
  duration: number; // in seconds (60-7200)
}

export interface AddTimeRequest {
  additionalTime: number; // in seconds
}

export interface FocusHistoryItem {
  id: string;
  taskId: string;
  status: FocusSessionStatus;
  totalDuration: number;
  formattedDuration: string;
  completedAt?: string;
  task: {
    id: string;
    title: string;
  };
  createdAt: string;
}

// ============================================
// Statistics Types
// ============================================

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
// Helper Types
// ============================================

export interface DateShortcut {
  key: string;
  label: string;
  date: string | null;
  dayName: string | null;
}

export interface ReminderPreset {
  value: number;
  label: string;
  isPreset: boolean;
}

export interface ReminderPresetsResponse {
  minutes: ReminderPreset[];
  hours: ReminderPreset[];
  days: ReminderPreset[];
}

export interface UserSearchResult {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime: string;
  duration: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeEntryRequest {
  startTime: string;
  endTime: string;
  note?: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  targetValue?: number;
  unit?: string;
  deadline?: string;
}

// ============================================
// Reports Types
// ============================================

export interface TaskReportsOverview {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  overview: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    completionRate: number;
  };
  focus: {
    totalSessions: number;
    totalFocusTime: number;
    totalFocusTimeFormatted: string;
    avgFocusPerSession: number;
    avgFocusPerSessionFormatted: string;
  };
  byCategory: Array<{
    categoryId: string;
    categoryName?: string;
    count: number;
  }>;
  byPriority: Array<{
    priority: string;
    count: number;
  }>;
  dailyStats: Array<{
    date: string;
    dayName: string;
    tasksCompleted: number;
    focusSessions: number;
    focusTime: number;
    focusTimeFormatted: string;
  }>;
}

export interface ProductivityScore {
  score: number;
  breakdown: {
    tasksCompleted: number;
    completionScore: number;
    focusSessions: number;
    totalFocusTime: number;
    totalFocusTimeFormatted: string;
    avgDailyFocusMinutes: number;
    focusScore: number;
    overdueTasks: number;
    overdueScore: number;
  };
  insights: string[];
}

// ============================================
// Helper Functions
// ============================================

const buildQueryString = (params: Record<string, unknown>): string => {
  const query = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
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
   * Returns tasks where user is owner OR collaborator
   */
  async getTasks(
    params?: TaskQueryParams
  ): Promise<ApiResponse<TaskListResponse>> {
    const queryString = params
      ? buildQueryString(params as Record<string, unknown>)
      : "";
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
   * Get enhanced task detail with subtask counts and grouping
   */
  async getTaskDetail(id: string): Promise<ApiResponse<TaskDetail>> {
    return httpClient.get<TaskDetail>(`/tasks/detail/${id}`, true);
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

  /**
   * Delete all tasks by date
   * @param date - Date in YYYY-MM-DD format
   */
  async deleteTasksByDate(
    date: string
  ): Promise<ApiResponse<{ message: string; count: number }>> {
    return httpClient.delete<{ message: string; count: number }>(
      `/tasks/date/${date}`,
      true
    );
  },

  // ============================================
  // Subtask Operations
  // ============================================

  /**
   * Get all subtasks for a task
   */
  async getSubtasks(taskId: string): Promise<ApiResponse<TaskSubtask[]>> {
    return httpClient.get<TaskSubtask[]>(`/tasks/${taskId}/subtasks`, true);
  },

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
   * Reorder subtasks
   */
  async reorderSubtasks(
    taskId: string,
    orderedIds: string[]
  ): Promise<ApiResponse<TaskSubtask[]>> {
    return httpClient.patch<TaskSubtask[]>(
      `/tasks/${taskId}/subtasks/reorder`,
      { orderedIds },
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

  // ============================================
  // Category Operations
  // ============================================

  /**
   * Get all task categories (creates defaults if none exist)
   */
  async getCategories(): Promise<ApiResponse<TaskCategory[]>> {
    return httpClient.get<TaskCategory[]>("/tasks/categories/list", true);
  },

  /**
   * Create a task category
   */
  async createCategory(
    data: CreateCategoryRequest
  ): Promise<ApiResponse<TaskCategory>> {
    return httpClient.post<TaskCategory>("/tasks/categories", data, true);
  },

  /**
   * Update a task category
   */
  async updateCategory(
    id: string,
    data: Partial<CreateCategoryRequest>
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
  // Collaborator Operations
  // ============================================

  /**
   * Search users by email or name to add as collaborators
   * @param query - Search query (email or name), min 2 chars
   * @param limit - Max results to return (default: 10)
   */
  async searchUsers(
    query: string,
    limit?: number
  ): Promise<ApiResponse<UserSearchResult[]>> {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append("limit", String(limit));
    return httpClient.get<UserSearchResult[]>(
      `/tasks/users/search?${params.toString()}`,
      true
    );
  },

  /**
   * Get frequently added collaborators (contacts)
   */
  async getContacts(): Promise<ApiResponse<UserSearchResult[]>> {
    return httpClient.get<UserSearchResult[]>("/tasks/users/contacts", true);
  },

  /**
   * Add collaborator to a task
   */
  async addCollaborator(
    taskId: string,
    email: string,
    role?: "VIEWER" | "EDITOR"
  ): Promise<ApiResponse<TaskCollaborator>> {
    return httpClient.post<TaskCollaborator>(
      `/tasks/${taskId}/collaborators`,
      { email, role },
      true
    );
  },

  /**
   * Get all collaborators for a task
   */
  async getCollaborators(
    taskId: string
  ): Promise<ApiResponse<TaskCollaborator[]>> {
    return httpClient.get<TaskCollaborator[]>(
      `/tasks/${taskId}/collaborators`,
      true
    );
  },

  /**
   * Remove collaborator from a task
   */
  async removeCollaborator(
    taskId: string,
    collaboratorId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/tasks/${taskId}/collaborators/${collaboratorId}`,
      true
    );
  },

  // ============================================
  // Goal Operations
  // ============================================

  /**
   * Create a goal
   */
  async createGoal(data: CreateGoalRequest): Promise<ApiResponse<TaskGoal>> {
    return httpClient.post<TaskGoal>("/tasks/goals", data, true);
  },

  /**
   * Get all goals
   */
  async getGoals(params?: {
    isCompleted?: boolean;
    search?: string;
  }): Promise<ApiResponse<TaskGoal[]>> {
    const queryString = params
      ? buildQueryString(params as Record<string, unknown>)
      : "";
    return httpClient.get<TaskGoal[]>(`/tasks/goals/list${queryString}`, true);
  },

  /**
   * Get goal with all linked tasks
   */
  async getGoal(
    goalId: string
  ): Promise<ApiResponse<TaskGoal & { tasks: Task[] }>> {
    return httpClient.get<TaskGoal & { tasks: Task[] }>(
      `/tasks/goals/${goalId}`,
      true
    );
  },

  /**
   * Update a goal
   */
  async updateGoal(
    goalId: string,
    data: Partial<CreateGoalRequest>
  ): Promise<ApiResponse<TaskGoal>> {
    return httpClient.patch<TaskGoal>(`/tasks/goals/${goalId}`, data, true);
  },

  /**
   * Delete a goal
   */
  async deleteGoal(goalId: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/tasks/goals/${goalId}`,
      true
    );
  },

  // ============================================
  // Reminder Operations
  // ============================================

  /**
   * Get reminder presets
   */
  async getReminderPresets(): Promise<ApiResponse<ReminderPresetsResponse>> {
    return httpClient.get<ReminderPresetsResponse>(
      "/tasks/helpers/reminder-presets",
      true
    );
  },

  /**
   * Add reminder to a task
   */
  async addReminder(
    taskId: string,
    data: CreateReminderRequest
  ): Promise<ApiResponse<TaskReminder>> {
    return httpClient.post<TaskReminder>(
      `/tasks/${taskId}/reminders`,
      data,
      true
    );
  },

  /**
   * Get all reminders for a task
   */
  async getReminders(taskId: string): Promise<ApiResponse<TaskReminder[]>> {
    return httpClient.get<TaskReminder[]>(`/tasks/${taskId}/reminders`, true);
  },

  /**
   * Delete a reminder
   */
  async deleteReminder(
    taskId: string,
    reminderId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/tasks/${taskId}/reminders/${reminderId}`,
      true
    );
  },

  // ============================================
  // Date Shortcuts
  // ============================================

  /**
   * Get dynamic date shortcuts for quick task scheduling
   */
  async getDateShortcuts(): Promise<ApiResponse<DateShortcut[]>> {
    return httpClient.get<DateShortcut[]>(
      "/tasks/helpers/date-shortcuts",
      true
    );
  },

  // ============================================
  // Focus Mode Operations
  // ============================================

  /**
   * Start a focus session
   * @param data.taskId - Task to focus on
   * @param data.duration - Duration in seconds (60-7200, i.e., 1 min to 2 hours)
   */
  async startFocusSession(
    data: StartFocusRequest
  ): Promise<ApiResponse<FocusSession>> {
    return httpClient.post<FocusSession>("/tasks/focus/start", data, true);
  },

  /**
   * Get active focus session (running or paused)
   * Returns null if no active session
   */
  async getActiveSession(): Promise<ApiResponse<FocusSession | null>> {
    return httpClient.get<FocusSession | null>("/tasks/focus/active", true);
  },

  /**
   * Pause a focus session
   */
  async pauseSession(sessionId: string): Promise<ApiResponse<FocusSession>> {
    return httpClient.post<FocusSession>(
      `/tasks/focus/${sessionId}/pause`,
      {},
      true
    );
  },

  /**
   * Resume a paused focus session
   */
  async resumeSession(sessionId: string): Promise<ApiResponse<FocusSession>> {
    return httpClient.post<FocusSession>(
      `/tasks/focus/${sessionId}/resume`,
      {},
      true
    );
  },

  /**
   * Add time to a focus session
   * @param additionalTime - Additional time in seconds
   */
  async addTimeToSession(
    sessionId: string,
    additionalTime: number
  ): Promise<ApiResponse<FocusSession>> {
    return httpClient.post<FocusSession>(
      `/tasks/focus/${sessionId}/add-time`,
      { additionalTime },
      true
    );
  },

  /**
   * Complete a focus session
   * Marks session as completed and updates task's actual time
   */
  async completeSession(sessionId: string): Promise<ApiResponse<FocusSession>> {
    return httpClient.post<FocusSession>(
      `/tasks/focus/${sessionId}/complete`,
      {},
      true
    );
  },

  /**
   * Quit a focus session early
   * Time is still tracked if > 1 minute
   */
  async quitSession(sessionId: string): Promise<ApiResponse<FocusSession>> {
    return httpClient.post<FocusSession>(
      `/tasks/focus/${sessionId}/quit`,
      {},
      true
    );
  },

  /**
   * Get focus session history
   */
  async getFocusHistory(
    taskId?: string
  ): Promise<ApiResponse<FocusHistoryItem[]>> {
    const queryString = taskId ? `?taskId=${taskId}` : "";
    return httpClient.get<FocusHistoryItem[]>(
      `/tasks/focus/history${queryString}`,
      true
    );
  },

  // ============================================
  // Time Entry Operations
  // ============================================

  /**
   * Add manual time entry to a task
   */
  async addTimeEntry(
    taskId: string,
    data: CreateTimeEntryRequest
  ): Promise<ApiResponse<TimeEntry>> {
    return httpClient.post<TimeEntry>(
      `/tasks/${taskId}/time-entries`,
      data,
      true
    );
  },

  /**
   * Get all time entries for a task
   */
  async getTimeEntries(taskId: string): Promise<
    ApiResponse<{
      entries: TimeEntry[];
      totalMinutes: number;
      estimatedMinutes?: number;
    }>
  > {
    return httpClient.get<{
      entries: TimeEntry[];
      totalMinutes: number;
      estimatedMinutes?: number;
    }>(`/tasks/${taskId}/time-entries`, true);
  },

  /**
   * Update a time entry
   */
  async updateTimeEntry(
    taskId: string,
    entryId: string,
    data: Partial<CreateTimeEntryRequest>
  ): Promise<ApiResponse<TimeEntry>> {
    return httpClient.patch<TimeEntry>(
      `/tasks/${taskId}/time-entries/${entryId}`,
      data,
      true
    );
  },

  /**
   * Delete a time entry
   */
  async deleteTimeEntry(
    taskId: string,
    entryId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/tasks/${taskId}/time-entries/${entryId}`,
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
    const queryString = params
      ? buildQueryString(params as Record<string, unknown>)
      : "";
    return httpClient.get<TaskMonthlyStats>(
      `/tasks/stats/monthly${queryString}`,
      true
    );
  },

  // ============================================
  // Reports Operations
  // ============================================

  /**
   * Get comprehensive task reports
   */
  async getReportsOverview(params?: {
    days?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<TaskReportsOverview>> {
    const queryString = params
      ? buildQueryString(params as Record<string, unknown>)
      : "";
    return httpClient.get<TaskReportsOverview>(
      `/tasks/reports/overview${queryString}`,
      true
    );
  },

  /**
   * Get weekly productivity score (0-100) with insights
   */
  async getProductivityScore(): Promise<ApiResponse<ProductivityScore>> {
    return httpClient.get<ProductivityScore>(
      "/tasks/reports/productivity",
      true
    );
  },
};

export default taskService;
