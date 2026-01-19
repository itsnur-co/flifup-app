/**
 * Habits API Service
 * Handles all habit-related API calls
 */

import { httpClient, ApiResponse } from './client';

// ============================================
// Types
// ============================================

export type HabitRepeatType = 'DAILY' | 'MONTHLY' | 'INTERVAL';
export type HabitGoalUnit = 'KM' | 'METERS' | 'MINUTES' | 'HOURS' | 'COUNT' | 'LITERS' | 'GLASSES';
export type HabitGoalFrequency = 'PER_DAY' | 'PER_WEEK' | 'PER_MONTH';
export type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface HabitCategoryApi {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    habits: number;
  };
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  value?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitApi {
  id: string;
  name: string;
  description?: string;
  repeatType: HabitRepeatType;
  repeatDays: number[];
  repeatInterval?: number;
  startDate: string;
  goalValue?: number;
  goalUnit?: HabitGoalUnit;
  goalFrequency?: HabitGoalFrequency;
  categoryId?: string;
  category?: HabitCategoryApi;
  reminderTime?: string;
  comment?: string;
  status: HabitStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completions: HabitCompletion[];
  isCompletedToday?: boolean;
  _count?: {
    completions: number;
  };
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  repeatType: HabitRepeatType;
  repeatDays?: number[];
  repeatInterval?: number;
  startDate: string;
  goalValue?: number;
  goalUnit?: HabitGoalUnit;
  goalFrequency?: HabitGoalFrequency;
  categoryId?: string;
  reminderTime?: string;
  comment?: string;
  status?: HabitStatus;
}

export interface UpdateHabitRequest {
  name?: string;
  description?: string;
  repeatType?: HabitRepeatType;
  repeatDays?: number[];
  repeatInterval?: number;
  startDate?: string;
  goalValue?: number;
  goalUnit?: HabitGoalUnit;
  goalFrequency?: HabitGoalFrequency;
  categoryId?: string;
  reminderTime?: string;
  comment?: string;
  status?: HabitStatus;
}

export interface HabitListResponse {
  data: HabitApi[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HabitQueryParams {
  status?: HabitStatus;
  repeatType?: HabitRepeatType;
  category?: string;
  categoryId?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: 'name' | 'startDate' | 'createdAt' | 'category';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CompleteHabitRequest {
  value?: number;
  note?: string;
}

export interface HabitProgressStats {
  totalScheduled: number;
  totalCompleted: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  dailyProgress: Array<{
    date: string;
    dayName: string;
    scheduled: boolean;
    completed: boolean;
    value?: number;
  }>;
}

export interface OverallProgressStats {
  period: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  habits: {
    total: number;
    active: number;
    paused: number;
    archived: number;
  };
  completions: {
    totalScheduled: number;
    totalCompleted: number;
    completionRate: number;
  };
  streaks: {
    currentOverallStreak: number;
    longestOverallStreak: number;
  };
  dailySummary: Array<{
    date: string;
    dayName: string;
    totalScheduled: number;
    totalCompleted: number;
    rate: number;
  }>;
}

// ============================================
// Helper Functions
// ============================================

const buildQueryString = (params: Record<string, any>): string => {
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `?${query}` : '';
};

// ============================================
// Habit Service
// ============================================

export const habitService = {
  // ============================================
  // Habit CRUD Operations
  // ============================================

  /**
   * Create a new habit
   */
  async createHabit(data: CreateHabitRequest): Promise<ApiResponse<HabitApi>> {
    return httpClient.post<HabitApi>('/habits', data, true);
  },

  /**
   * Get all habits with pagination and filtering
   */
  async getHabits(params?: HabitQueryParams): Promise<ApiResponse<HabitListResponse>> {
    const queryString = params ? buildQueryString(params) : '';
    return httpClient.get<HabitListResponse>(`/habits${queryString}`, true);
  },

  /**
   * Get a single habit by ID
   */
  async getHabit(id: string): Promise<ApiResponse<HabitApi>> {
    return httpClient.get<HabitApi>(`/habits/${id}`, true);
  },

  /**
   * Update a habit
   */
  async updateHabit(id: string, data: UpdateHabitRequest): Promise<ApiResponse<HabitApi>> {
    return httpClient.patch<HabitApi>(`/habits/${id}`, data, true);
  },

  /**
   * Delete a habit
   */
  async deleteHabit(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`/habits/${id}`, true);
  },

  /**
   * Delete all habits for the current user
   */
  async deleteAllHabits(): Promise<ApiResponse<{ message: string; count: number }>> {
    return httpClient.delete<{ message: string; count: number }>('/habits', true);
  },

  // ============================================
  // Today & Date Operations
  // ============================================

  /**
   * Get today's habits
   */
  async getTodayHabits(): Promise<ApiResponse<HabitApi[]>> {
    return httpClient.get<HabitApi[]>('/habits/today', true);
  },

  /**
   * Get habits for a specific date
   */
  async getHabitsByDate(date: string): Promise<ApiResponse<HabitApi[]>> {
    return httpClient.get<HabitApi[]>(`/habits/date/${date}`, true);
  },

  // ============================================
  // Completion Operations
  // ============================================

  /**
   * Mark habit as complete for today
   */
  async completeHabit(id: string, data?: CompleteHabitRequest): Promise<ApiResponse<HabitCompletion>> {
    const requestData = {
      date: new Date().toISOString(),
      ...data,
    };
    return httpClient.post<HabitCompletion>(`/habits/${id}/complete`, requestData, true);
  },

  /**
   * Uncomplete habit for today
   */
  async uncompleteHabit(id: string): Promise<ApiResponse<{ message: string }>> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return httpClient.delete<{ message: string }>(`/habits/${id}/complete/${today}`, true);
  },

  /**
   * Mark habit complete for a specific date
   */
  async completeHabitForDate(
    id: string,
    date: string,
    data?: CompleteHabitRequest
  ): Promise<ApiResponse<HabitCompletion>> {
    const requestData = {
      date: date,
      ...data,
    };
    return httpClient.post<HabitCompletion>(`/habits/${id}/complete`, requestData, true);
  },

  /**
   * Uncomplete habit for a specific date
   */
  async uncompleteHabitForDate(id: string, date: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`/habits/${id}/complete/${date}`, true);
  },

  /**
   * Get completion history for a habit
   */
  async getCompletionHistory(
    id: string,
    params?: { startDate?: string; endDate?: string; limit?: number }
  ): Promise<ApiResponse<HabitCompletion[]>> {
    const queryString = params ? buildQueryString(params) : '';
    return httpClient.get<HabitCompletion[]>(`/habits/${id}/history${queryString}`, true);
  },

  // ============================================
  // Category Operations
  // ============================================

  /**
   * Get all habit categories
   */
  async getCategories(): Promise<ApiResponse<HabitCategoryApi[]>> {
    return httpClient.get<HabitCategoryApi[]>('/habits/categories', true);
  },

  /**
   * Create a habit category
   */
  async createCategory(data: { name: string; icon?: string; color?: string }): Promise<ApiResponse<HabitCategoryApi>> {
    return httpClient.post<HabitCategoryApi>('/habits/categories', data, true);
  },

  /**
   * Update a habit category
   */
  async updateCategory(
    id: string,
    data: { name?: string; icon?: string; color?: string }
  ): Promise<ApiResponse<HabitCategoryApi>> {
    return httpClient.patch<HabitCategoryApi>(`/habits/categories/${id}`, data, true);
  },

  /**
   * Delete a habit category
   */
  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`/habits/categories/${id}`, true);
  },

  // ============================================
  // Progress & Statistics Operations
  // ============================================

  /**
   * Get progress stats for a single habit
   */
  async getHabitProgress(
    id: string,
    params?: { days?: number; startDate?: string; endDate?: string }
  ): Promise<ApiResponse<HabitProgressStats>> {
    const queryString = params ? buildQueryString(params) : '';
    return httpClient.get<HabitProgressStats>(`/habits/${id}/progress${queryString}`, true);
  },

  /**
   * Get overall progress across all habits
   */
  async getOverallProgress(params?: {
    days?: number;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }): Promise<ApiResponse<OverallProgressStats>> {
    const queryString = params ? buildQueryString(params) : '';
    return httpClient.get<OverallProgressStats>(`/habits/progress/overall${queryString}`, true);
  },
};

export default habitService;
