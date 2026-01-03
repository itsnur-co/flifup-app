/**
 * Goal Management Hook
 * Handles goal CRUD operations with API integration
 * Provides loading states, error handling, and optimistic updates
 */

import { goalService } from "@/services/api/goal.service";
import {
  calculateGoalProgress,
  calculateTaskCounts,
  CreateGoalRequest,
  Goal,
  GoalDetail,
  goalFormToRequest,
  GoalFormState,
  groupTasksByCompletion,
  QueryGoalsRequest,
  UpdateGoalRequest,
} from "@/types/goal";
import { useCallback, useEffect, useState } from "react";

interface UseGoalsOptions {
  autoFetch?: boolean;
  initialFilters?: QueryGoalsRequest;
}

interface UseGoalsReturn {
  // Data
  goals: Goal[];
  ongoingGoals: Goal[];
  completedGoals: Goal[];
  selectedGoal: GoalDetail | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;

  // Error state
  error: string | null;

  // Actions
  fetchGoals: (filters?: QueryGoalsRequest) => Promise<void>;
  fetchGoal: (id: string) => Promise<GoalDetail | null>;
  createGoal: (data: GoalFormState | CreateGoalRequest) => Promise<Goal | null>;
  updateGoal: (
    id: string,
    data: Partial<GoalFormState> | UpdateGoalRequest
  ) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<boolean>;
  duplicateGoal: (id: string) => Promise<Goal | null>;
  toggleCompletion: (id: string, isCompleted: boolean) => Promise<Goal | null>;
  setSelectedGoal: (goal: GoalDetail | null) => void;

  // Utility
  clearError: () => void;
  refresh: () => Promise<void>;
  searchGoals: (searchText: string) => Promise<void>;
}

export const useGoals = (
  options: UseGoalsOptions = {}
): UseGoalsReturn => {
  const { autoFetch = true, initialFilters } = options;

  // Data state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalDetail | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<QueryGoalsRequest>(
    initialFilters || {}
  );

  // ============================================
  // Computed Values
  // ============================================

  const ongoingGoals = goals.filter((goal) => !goal.isCompleted);
  const completedGoals = goals.filter((goal) => goal.isCompleted);

  // ============================================
  // Goal CRUD Operations
  // ============================================

  /**
   * Fetch goals with optional filters
   */
  const fetchGoals = useCallback(
    async (newFilters?: QueryGoalsRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const mergedFilters = { ...filters, ...newFilters };
        setFilters(mergedFilters);

        const response = await goalService.getGoals(mergedFilters);

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.data) {
          // Calculate progress for each goal
          const goalsWithProgress = response.data.map((goal) => ({
            ...goal,
            progress: calculateGoalProgress(goal),
          }));

          setGoals(goalsWithProgress);
        }
      } catch (err) {
        setError("Failed to fetch goals");
        console.error("fetchGoals error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  /**
   * Fetch single goal by ID with tasks
   */
  const fetchGoal = useCallback(
    async (id: string): Promise<GoalDetail | null> => {
      setIsFetchingDetail(true);
      setError(null);

      try {
        const response = await goalService.getGoal(id);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Calculate task counts and grouping
          const taskCounts = calculateTaskCounts(response.data.tasks);
          const tasksGrouped = groupTasksByCompletion(response.data.tasks);
          const progress = calculateGoalProgress({
            ...response.data,
            taskCounts,
          });

          const enrichedGoal: GoalDetail = {
            ...response.data,
            taskCounts,
            tasksGrouped,
            progress,
          };

          setSelectedGoal(enrichedGoal);
          return enrichedGoal;
        }

        return null;
      } catch (err) {
        setError("Failed to fetch goal details");
        console.error("fetchGoal error:", err);
        return null;
      } finally {
        setIsFetchingDetail(false);
      }
    },
    []
  );

  /**
   * Create new goal
   */
  const createGoal = useCallback(
    async (data: GoalFormState | CreateGoalRequest): Promise<Goal | null> => {
      setIsCreating(true);
      setError(null);

      try {
        // Convert GoalFormState to CreateGoalRequest if needed
        const requestData: CreateGoalRequest =
          "deadline" in data && data.deadline instanceof Date
            ? goalFormToRequest(data as GoalFormState)
            : (data as CreateGoalRequest);

        const response = await goalService.createGoal(requestData);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Add to goals list (optimistic update)
          const newGoal = {
            ...response.data,
            progress: 0,
          };
          setGoals((prev) => [newGoal, ...prev]);
          return newGoal;
        }

        return null;
      } catch (err) {
        setError("Failed to create goal");
        console.error("createGoal error:", err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  /**
   * Update existing goal
   */
  const updateGoal = useCallback(
    async (
      id: string,
      data: Partial<GoalFormState> | UpdateGoalRequest
    ): Promise<Goal | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        // Convert GoalFormState to UpdateGoalRequest if needed
        const requestData: UpdateGoalRequest =
          "deadline" in data && data.deadline instanceof Date
            ? (goalFormToRequest(data as GoalFormState) as UpdateGoalRequest)
            : (data as UpdateGoalRequest);

        const response = await goalService.updateGoal(id, requestData);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Update in goals list
          const updatedGoal = {
            ...response.data,
            progress: calculateGoalProgress(response.data),
          };

          setGoals((prev) =>
            prev.map((goal) => (goal.id === id ? updatedGoal : goal))
          );

          // Update selected goal if it matches
          if (selectedGoal && selectedGoal.id === id) {
            setSelectedGoal((prev) =>
              prev ? { ...prev, ...updatedGoal } : null
            );
          }

          return updatedGoal;
        }

        return null;
      } catch (err) {
        setError("Failed to update goal");
        console.error("updateGoal error:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedGoal]
  );

  /**
   * Delete goal
   */
  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await goalService.deleteGoal(id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      // Remove from goals list
      setGoals((prev) => prev.filter((goal) => goal.id !== id));

      // Clear selected goal if it matches
      if (selectedGoal && selectedGoal.id === id) {
        setSelectedGoal(null);
      }

      return true;
    } catch (err) {
      setError("Failed to delete goal");
      console.error("deleteGoal error:", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [selectedGoal]);

  /**
   * Duplicate goal
   */
  const duplicateGoal = useCallback(
    async (id: string): Promise<Goal | null> => {
      setIsCreating(true);
      setError(null);

      try {
        const response = await goalService.duplicateGoal(id);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          const newGoal = {
            ...response.data,
            progress: 0,
          };
          setGoals((prev) => [newGoal, ...prev]);
          return newGoal;
        }

        return null;
      } catch (err) {
        setError("Failed to duplicate goal");
        console.error("duplicateGoal error:", err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  /**
   * Toggle goal completion status
   */
  const toggleCompletion = useCallback(
    async (id: string, isCompleted: boolean): Promise<Goal | null> => {
      return updateGoal(id, { isCompleted });
    },
    [updateGoal]
  );

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh goals list
   */
  const refresh = useCallback(async () => {
    await fetchGoals(filters);
  }, [fetchGoals, filters]);

  /**
   * Search goals
   */
  const searchGoals = useCallback(
    async (searchText: string) => {
      await fetchGoals({ search: searchText });
    },
    [fetchGoals]
  );

  // ============================================
  // Effects
  // ============================================

  /**
   * Auto-fetch goals on mount
   */
  useEffect(() => {
    if (autoFetch) {
      fetchGoals();
    }
  }, []); // Only run on mount

  // ============================================
  // Return Hook Interface
  // ============================================

  return {
    // Data
    goals,
    ongoingGoals,
    completedGoals,
    selectedGoal,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isFetchingDetail,

    // Error state
    error,

    // Actions
    fetchGoals,
    fetchGoal,
    createGoal,
    updateGoal,
    deleteGoal,
    duplicateGoal,
    toggleCompletion,
    setSelectedGoal,

    // Utility
    clearError,
    refresh,
    searchGoals,
  };
};

export default useGoals;
