/**
 * Journal Management Hook
 * Handles journal CRUD operations with API integration
 * Provides loading states, error handling, and optimistic updates
 */

import { journalService } from "@/services/api/journal.service";
import {
  CreateJournalRequest,
  Journal,
  JournalCategory,
  JournalFormState,
  JournalQueryParams,
  JournalStatisticsResponse,
  MoodInsightsResponse,
  UpdateJournalRequest,
} from "@/types/journal";
import { useCallback, useEffect, useState } from "react";

interface UseJournalsOptions {
  autoFetch?: boolean;
  initialParams?: JournalQueryParams;
}

interface UseJournalsReturn {
  // Data
  journals: Journal[];
  categories: JournalCategory[];
  selectedJournal: Journal | null;
  insights: MoodInsightsResponse | null;
  statistics: JournalStatisticsResponse | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingCategories: boolean;
  isFetchingInsights: boolean;

  // Error states
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchJournals: (params?: JournalQueryParams) => Promise<void>;
  fetchJournal: (id: string) => Promise<Journal | null>;
  createJournal: (data: JournalFormState) => Promise<Journal | null>;
  updateJournal: (
    id: string,
    data: Partial<JournalFormState>
  ) => Promise<Journal | null>;
  deleteJournal: (id: string) => Promise<boolean>;
  setSelectedJournal: (journal: Journal | null) => void;

  // Category actions
  fetchCategories: () => Promise<void>;
  createCategory: (
    name: string,
    icon?: string,
    color?: string
  ) => Promise<JournalCategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Insights actions
  fetchInsights: (days?: number) => Promise<void>;
  fetchStatistics: () => Promise<void>;

  // Utility
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useJournals = (
  options: UseJournalsOptions = {}
): UseJournalsReturn => {
  const { autoFetch = true, initialParams } = options;

  // Data state
  const [journals, setJournals] = useState<Journal[]>([]);
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [insights, setInsights] = useState<MoodInsightsResponse | null>(null);
  const [statistics, setStatistics] =
    useState<JournalStatisticsResponse | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);

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
  const [queryParams, setQueryParams] = useState<JournalQueryParams>(
    initialParams || {}
  );

  // ============================================
  // Journal CRUD Operations
  // ============================================

  /**
   * Fetch journals with optional filters
   */
  const fetchJournals = useCallback(
    async (params?: JournalQueryParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const mergedParams = { ...queryParams, ...params };
        setQueryParams(mergedParams);

        const response = await journalService.getJournals(mergedParams);

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.data) {
          setJournals(response.data.data);
          setPagination({
            page: response.data.meta.page,
            limit: response.data.meta.limit,
            total: response.data.meta.total,
            totalPages: response.data.meta.totalPages,
          });
        }
      } catch (err) {
        setError("Failed to fetch journals");
        console.error("fetchJournals error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [queryParams]
  );

  /**
   * Fetch single journal by ID
   */
  const fetchJournal = useCallback(
    async (id: string): Promise<Journal | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await journalService.getJournal(id);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setSelectedJournal(response.data);
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to fetch journal");
        console.error("fetchJournal error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Create new journal
   */
  const createJournal = useCallback(
    async (data: JournalFormState): Promise<Journal | null> => {
      setIsCreating(true);
      setError(null);

      try {
        const requestData: CreateJournalRequest = {
          title: data.title,
          description: data.description || undefined,
          categoryId: data.categoryId || undefined,
          mood: data.mood || undefined,
          visibility: data.visibility,
        };

        const response = await journalService.createJournal(requestData);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Optimistic update - add to beginning of list
          setJournals((prev) => [response.data!, ...prev]);
          setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to create journal");
        console.error("createJournal error:", err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  /**
   * Update existing journal
   */
  const updateJournal = useCallback(
    async (
      id: string,
      data: Partial<JournalFormState>
    ): Promise<Journal | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        const requestData: UpdateJournalRequest = {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId || undefined,
          mood: data.mood || undefined,
          visibility: data.visibility,
        };

        // Remove undefined values
        Object.keys(requestData).forEach((key) => {
          if (requestData[key as keyof UpdateJournalRequest] === undefined) {
            delete requestData[key as keyof UpdateJournalRequest];
          }
        });

        const response = await journalService.updateJournal(id, requestData);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Update in local state
          setJournals((prev) =>
            prev.map((j) => (j.id === id ? response.data! : j))
          );

          // Update selected journal if it's the same
          if (selectedJournal?.id === id) {
            setSelectedJournal(response.data);
          }

          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to update journal");
        console.error("updateJournal error:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedJournal]
  );

  /**
   * Delete journal
   */
  const deleteJournal = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await journalService.deleteJournal(id);

        if (response.error) {
          setError(response.error);
          return false;
        }

        // Remove from local state
        setJournals((prev) => prev.filter((j) => j.id !== id));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));

        // Clear selected if it was deleted
        if (selectedJournal?.id === id) {
          setSelectedJournal(null);
        }

        return true;
      } catch (err) {
        setError("Failed to delete journal");
        console.error("deleteJournal error:", err);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [selectedJournal]
  );

  // ============================================
  // Category Operations
  // ============================================

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    setIsFetchingCategories(true);
    setError(null);

    try {
      const response = await journalService.getCategories();

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

  /**
   * Create new category
   */
  const createCategory = useCallback(
    async (
      name: string,
      icon?: string,
      color?: string
    ): Promise<JournalCategory | null> => {
      setError(null);

      try {
        const response = await journalService.createCategory({
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

  /**
   * Delete category
   */
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await journalService.deleteCategory(id);

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
  // Insights & Statistics
  // ============================================

  /**
   * Fetch mood insights
   */
  const fetchInsights = useCallback(async (days: number = 7) => {
    setIsFetchingInsights(true);
    setError(null);

    try {
      const response = await journalService.getMoodInsights({ days });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setInsights(response.data);
      }
    } catch (err) {
      setError("Failed to fetch insights");
      console.error("fetchInsights error:", err);
    } finally {
      setIsFetchingInsights(false);
    }
  }, []);

  /**
   * Fetch statistics
   */
  const fetchStatistics = useCallback(async () => {
    setError(null);

    try {
      const response = await journalService.getStatistics();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setStatistics(response.data);
      }
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error("fetchStatistics error:", err);
    }
  }, []);

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh all data
   */
  const refresh = useCallback(async () => {
    await Promise.all([fetchJournals(), fetchCategories()]);
  }, [fetchJournals, fetchCategories]);

  // ============================================
  // Auto-fetch on mount
  // ============================================

  useEffect(() => {
    if (autoFetch) {
      fetchJournals(initialParams);
      fetchCategories();
    }
  }, [autoFetch]); // Only run on mount

  return {
    // Data
    journals,
    categories,
    selectedJournal,
    insights,
    statistics,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isFetchingCategories,
    isFetchingInsights,

    // Error state
    error,

    // Pagination
    pagination,

    // Actions
    fetchJournals,
    fetchJournal,
    createJournal,
    updateJournal,
    deleteJournal,
    setSelectedJournal,

    // Category actions
    fetchCategories,
    createCategory,
    deleteCategory,

    // Insights actions
    fetchInsights,
    fetchStatistics,

    // Utility
    clearError,
    refresh,
  };
};

export default useJournals;
