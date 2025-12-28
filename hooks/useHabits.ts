/**
 * Habit Management Hook
 * Handles habit CRUD operations with API integration
 * Provides loading states, error handling, and optimistic updates
 */

import {
  CompleteHabitRequest,
  CreateHabitRequest,
  HabitApi,
  HabitCategoryApi,
  HabitProgressStats,
  HabitQueryParams,
  habitService,
  OverallProgressStats,
  UpdateHabitRequest,
} from "@/services/api/habit.service";
import { useCallback, useEffect, useState } from "react";

interface UseHabitsOptions {
  autoFetch?: boolean;
  initialParams?: HabitQueryParams;
}

interface UseHabitsReturn {
  // Data
  habits: HabitApi[];
  todayHabits: HabitApi[];
  categories: HabitCategoryApi[];
  selectedHabit: HabitApi | null;
  habitProgress: HabitProgressStats | null;
  overallProgress: OverallProgressStats | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isCompleting: boolean;
  isFetchingCategories: boolean;
  isFetchingProgress: boolean;

  // Error state
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchHabits: (params?: HabitQueryParams) => Promise<void>;
  fetchTodayHabits: () => Promise<void>;
  fetchHabitsByDate: (date: string) => Promise<void>;
  fetchHabit: (id: string) => Promise<HabitApi | null>;
  createHabit: (data: CreateHabitRequest) => Promise<HabitApi | null>;
  updateHabit: (
    id: string,
    data: UpdateHabitRequest
  ) => Promise<HabitApi | null>;
  deleteHabit: (id: string) => Promise<boolean>;
  setSelectedHabit: (habit: HabitApi | null) => void;

  // Completion actions
  completeHabit: (id: string, data?: CompleteHabitRequest) => Promise<boolean>;
  uncompleteHabit: (id: string) => Promise<boolean>;
  completeHabitForDate: (
    id: string,
    date: string,
    data?: CompleteHabitRequest
  ) => Promise<boolean>;
  toggleHabitCompletion: (id: string) => Promise<boolean>;

  // Category actions
  fetchCategories: () => Promise<void>;
  createCategory: (
    name: string,
    icon?: string,
    color?: string
  ) => Promise<HabitCategoryApi | null>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Progress actions
  fetchHabitProgress: (id: string, days?: number) => Promise<void>;
  fetchOverallProgress: (days?: number) => Promise<void>;

  // Utility
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useHabits = (options: UseHabitsOptions = {}): UseHabitsReturn => {
  const { autoFetch = true, initialParams } = options;

  // Data state
  const [habits, setHabits] = useState<HabitApi[]>([]);
  const [todayHabits, setTodayHabits] = useState<HabitApi[]>([]);
  const [categories, setCategories] = useState<HabitCategoryApi[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitApi | null>(null);
  const [habitProgress, setHabitProgress] = useState<HabitProgressStats | null>(
    null
  );
  const [overallProgress, setOverallProgress] =
    useState<OverallProgressStats | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingProgress, setIsFetchingProgress] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Query params state
  const [queryParams, setQueryParams] = useState<HabitQueryParams>(
    initialParams || {}
  );

  // ============================================
  // Habit CRUD Operations
  // ============================================

  const fetchHabits = useCallback(
    async (params?: HabitQueryParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const mergedParams = { ...queryParams, ...params };
        setQueryParams(mergedParams);

        const response = await habitService.getHabits(mergedParams);

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.data) {
          setHabits(response.data.data);
          setPagination({
            page: response.data.meta.page,
            limit: response.data.meta.limit,
            total: response.data.meta.total,
            totalPages: response.data.meta.totalPages,
          });
        }
      } catch (err) {
        setError("Failed to fetch habits");
        console.error("fetchHabits error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [queryParams]
  );

  const fetchTodayHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await habitService.getTodayHabits();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setTodayHabits(response.data);
      }
    } catch (err) {
      setError("Failed to fetch today's habits");
      console.error("fetchTodayHabits error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHabitsByDate = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await habitService.getHabitsByDate(date);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setTodayHabits(response.data);
      }
    } catch (err) {
      setError("Failed to fetch habits for date");
      console.error("fetchHabitsByDate error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHabit = useCallback(
    async (id: string): Promise<HabitApi | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await habitService.getHabit(id);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setSelectedHabit(response.data);
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to fetch habit");
        console.error("fetchHabit error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createHabit = useCallback(
    async (data: CreateHabitRequest): Promise<HabitApi | null> => {
      setIsCreating(true);
      setError(null);

      try {
        const response = await habitService.createHabit(data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setHabits((prev) => [response.data!, ...prev]);
          setTodayHabits((prev) => [response.data!, ...prev]);
          setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to create habit");
        console.error("createHabit error:", err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const updateHabit = useCallback(
    async (id: string, data: UpdateHabitRequest): Promise<HabitApi | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await habitService.updateHabit(id, data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setHabits((prev) =>
            prev.map((h) => (h.id === id ? response.data! : h))
          );
          setTodayHabits((prev) =>
            prev.map((h) => (h.id === id ? response.data! : h))
          );

          if (selectedHabit?.id === id) {
            setSelectedHabit(response.data);
          }

          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to update habit");
        console.error("updateHabit error:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedHabit]
  );

  const deleteHabit = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await habitService.deleteHabit(id);

        if (response.error) {
          setError(response.error);
          return false;
        }

        setHabits((prev) => prev.filter((h) => h.id !== id));
        setTodayHabits((prev) => prev.filter((h) => h.id !== id));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));

        if (selectedHabit?.id === id) {
          setSelectedHabit(null);
        }

        return true;
      } catch (err) {
        setError("Failed to delete habit");
        console.error("deleteHabit error:", err);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [selectedHabit]
  );

  // ============================================
  // Completion Operations
  // ============================================

  const completeHabit = useCallback(
    async (id: string, data?: CompleteHabitRequest): Promise<boolean> => {
      setIsCompleting(true);
      setError(null);

      try {
        const response = await habitService.completeHabit(id, data);

        if (response.error) {
          setError(response.error);
          return false;
        }

        // Update local state
        const updateHabitCompletion = (habit: HabitApi) =>
          habit.id === id ? { ...habit, isCompletedToday: true } : habit;

        setHabits((prev) => prev.map(updateHabitCompletion));
        setTodayHabits((prev) => prev.map(updateHabitCompletion));

        return true;
      } catch (err) {
        setError("Failed to complete habit");
        console.error("completeHabit error:", err);
        return false;
      } finally {
        setIsCompleting(false);
      }
    },
    []
  );

  const uncompleteHabit = useCallback(async (id: string): Promise<boolean> => {
    setIsCompleting(true);
    setError(null);

    try {
      const response = await habitService.uncompleteHabit(id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      // Update local state
      const updateHabitCompletion = (habit: HabitApi) =>
        habit.id === id ? { ...habit, isCompletedToday: false } : habit;

      setHabits((prev) => prev.map(updateHabitCompletion));
      setTodayHabits((prev) => prev.map(updateHabitCompletion));

      return true;
    } catch (err) {
      setError("Failed to uncomplete habit");
      console.error("uncompleteHabit error:", err);
      return false;
    } finally {
      setIsCompleting(false);
    }
  }, []);

  const completeHabitForDate = useCallback(
    async (
      id: string,
      date: string,
      data?: CompleteHabitRequest
    ): Promise<boolean> => {
      setIsCompleting(true);
      setError(null);

      try {
        const response = await habitService.completeHabitForDate(
          id,
          date,
          data
        );

        if (response.error) {
          setError(response.error);
          return false;
        }

        return true;
      } catch (err) {
        setError("Failed to complete habit for date");
        console.error("completeHabitForDate error:", err);
        return false;
      } finally {
        setIsCompleting(false);
      }
    },
    []
  );

  const toggleHabitCompletion = useCallback(
    async (id: string): Promise<boolean> => {
      const habit =
        habits.find((h) => h.id === id) || todayHabits.find((h) => h.id === id);

      if (!habit) return false;

      if (habit.isCompletedToday) {
        return uncompleteHabit(id);
      } else {
        return completeHabit(id);
      }
    },
    [habits, todayHabits, completeHabit, uncompleteHabit]
  );

  // ============================================
  // Category Operations
  // ============================================

  const fetchCategories = useCallback(async () => {
    setIsFetchingCategories(true);
    setError(null);

    try {
      const response = await habitService.getCategories();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("fetchCategories error:", err);
    } finally {
      setIsFetchingCategories(false);
    }
  }, []);

  const createCategory = useCallback(
    async (
      name: string,
      icon?: string,
      color?: string
    ): Promise<HabitCategoryApi | null> => {
      setError(null);

      try {
        const response = await habitService.createCategory({
          name,
          icon,
          color,
        });

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setCategories((prev) => [...prev, response.data!]);
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to create category");
        console.error("createCategory error:", err);
        return null;
      }
    },
    []
  );

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await habitService.deleteCategory(id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete category");
      console.error("deleteCategory error:", err);
      return false;
    }
  }, []);

  // ============================================
  // Progress Operations
  // ============================================

  const fetchHabitProgress = useCallback(
    async (id: string, days: number = 7) => {
      setIsFetchingProgress(true);
      setError(null);

      try {
        const response = await habitService.getHabitProgress(id, { days });

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.data) {
          setHabitProgress(response.data);
        }
      } catch (err) {
        setError("Failed to fetch habit progress");
        console.error("fetchHabitProgress error:", err);
      } finally {
        setIsFetchingProgress(false);
      }
    },
    []
  );

  const fetchOverallProgress = useCallback(async (days: number = 7) => {
    setIsFetchingProgress(true);
    setError(null);

    try {
      const response = await habitService.getOverallProgress({ days });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setOverallProgress(response.data);
      }
    } catch (err) {
      setError("Failed to fetch overall progress");
      console.error("fetchOverallProgress error:", err);
    } finally {
      setIsFetchingProgress(false);
    }
  }, []);

  // ============================================
  // Utility Functions
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchTodayHabits(), fetchCategories()]);
  }, [fetchTodayHabits, fetchCategories]);

  // ============================================
  // Auto-fetch on mount
  // ============================================

  useEffect(() => {
    if (autoFetch) {
      fetchTodayHabits();
      fetchCategories();
    }
  }, [autoFetch]);

  return {
    // Data
    habits,
    todayHabits,
    categories,
    selectedHabit,
    habitProgress,
    overallProgress,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isCompleting,
    isFetchingCategories,
    isFetchingProgress,

    // Error state
    error,

    // Pagination
    pagination,

    // Actions
    fetchHabits,
    fetchTodayHabits,
    fetchHabitsByDate,
    fetchHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    setSelectedHabit,

    // Completion actions
    completeHabit,
    uncompleteHabit,
    completeHabitForDate,
    toggleHabitCompletion,

    // Category actions
    fetchCategories,
    createCategory,
    deleteCategory,

    // Progress actions
    fetchHabitProgress,
    fetchOverallProgress,

    // Utility
    clearError,
    refresh,
  };
};

export default useHabits;
