/**
 * Goal API Service
 * Handles all goal-related API calls
 */

import {
  CreateGoalRequest,
  Goal,
  GoalDetail,
  QueryGoalsRequest,
  UpdateGoalRequest,
} from "@/types/goal";
import { ApiResponse, httpClient } from "./client";

// Build query string from params
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

export const goalService = {
  // ============================================
  // Goal CRUD Operations
  // ============================================

  /**
   * Create a new goal
   */
  async createGoal(data: CreateGoalRequest): Promise<ApiResponse<Goal>> {
    return httpClient.post<Goal>("/tasks/goals", data, true);
  },

  /**
   * Get all goals with filtering
   */
  async getGoals(params?: QueryGoalsRequest): Promise<ApiResponse<Goal[]>> {
    const queryString = params ? buildQueryString(params) : "";
    return httpClient.get<Goal[]>(`/tasks/goals/list${queryString}`, true);
  },

  /**
   * Get a single goal by ID with tasks
   */
  async getGoal(goalId: string): Promise<ApiResponse<GoalDetail>> {
    return httpClient.get<GoalDetail>(`/tasks/goals/${goalId}`, true);
  },

  /**
   * Update a goal
   */
  async updateGoal(
    goalId: string,
    data: UpdateGoalRequest
  ): Promise<ApiResponse<Goal>> {
    return httpClient.patch<Goal>(`/tasks/goals/${goalId}`, data, true);
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

  /**
   * Toggle goal completion status
   */
  async toggleGoalCompletion(
    goalId: string,
    isCompleted: boolean
  ): Promise<ApiResponse<Goal>> {
    return goalService.updateGoal(goalId, { isCompleted });
  },

  /**
   * Duplicate a goal
   */
  async duplicateGoal(goalId: string): Promise<ApiResponse<Goal>> {
    const response = await goalService.getGoal(goalId);
    const originalGoal = response.data;

    const duplicateData: CreateGoalRequest = {
      title: `${originalGoal.title} (Copy)`,
      description: originalGoal.description,
      icon: originalGoal.icon,
      color: originalGoal.color,
      targetValue: originalGoal.targetValue,
      unit: originalGoal.unit,
      deadline: originalGoal.deadline,
      levels: originalGoal.levels,
      categoryId: originalGoal.categoryId,
    };

    return goalService.createGoal(duplicateData);
  },

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get only ongoing goals (not completed)
   */
  async getOngoingGoals(): Promise<ApiResponse<Goal[]>> {
    return goalService.getGoals({ isCompleted: false });
  },

  /**
   * Get only completed goals
   */
  async getCompletedGoals(): Promise<ApiResponse<Goal[]>> {
    return goalService.getGoals({ isCompleted: true });
  },

  /**
   * Search goals by text
   */
  async searchGoals(searchText: string): Promise<ApiResponse<Goal[]>> {
    return goalService.getGoals({ search: searchText });
  },
};

export default goalService;
