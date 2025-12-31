/**
 * Task Management Hook
 * Handles task CRUD operations with API integration
 * Provides loading states, error handling, and optimistic updates
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  taskService,
  Task,
  TaskCategory,
  TaskQueryParams,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  TaskSubtask,
  TaskOverviewStats,
  TaskWeeklyStats,
  TaskMonthlyStats,
} from "@/services/api/task.service";

interface UseTasksOptions {
  autoFetch?: boolean;
  initialParams?: TaskQueryParams;
}

interface UseTasksReturn {
  // Data
  tasks: Task[];
  todayTasks: Task[];
  upcomingTasks: Task[];
  overdueTasks: Task[];
  completedTasks: Task[];
  categories: TaskCategory[];
  projects: string[];
  selectedTask: Task | null;
  overviewStats: TaskOverviewStats | null;
  weeklyStats: TaskWeeklyStats | null;
  monthlyStats: TaskMonthlyStats | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingCategories: boolean;
  isFetchingStats: boolean;

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
  fetchTasks: (params?: TaskQueryParams) => Promise<void>;
  fetchTodayTasks: () => Promise<void>;
  fetchUpcomingTasks: () => Promise<void>;
  fetchOverdueTasks: () => Promise<void>;
  fetchTask: (id: string) => Promise<Task | null>;
  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  setSelectedTask: (task: Task | null) => void;

  // Status actions
  toggleTaskStatus: (id: string) => Promise<boolean>;
  markTaskCompleted: (id: string) => Promise<boolean>;
  markTaskTodo: (id: string) => Promise<boolean>;

  // Subtask actions
  addSubtask: (taskId: string, title: string) => Promise<TaskSubtask | null>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<boolean>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<boolean>;

  // Category actions
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, icon?: string, color?: string) => Promise<TaskCategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Project actions
  fetchProjects: () => Promise<void>;

  // Stats actions
  fetchOverviewStats: () => Promise<void>;
  fetchWeeklyStats: () => Promise<void>;
  fetchMonthlyStats: (year?: number, month?: number) => Promise<void>;

  // Utility
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useTasks = (options: UseTasksOptions = {}): UseTasksReturn => {
  const { autoFetch = true, initialParams } = options;

  // Data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [overviewStats, setOverviewStats] = useState<TaskOverviewStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<TaskWeeklyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<TaskMonthlyStats | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingStats, setIsFetchingStats] = useState(false);

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
  const [queryParams, setQueryParams] = useState<TaskQueryParams>(
    initialParams || {}
  );

  // Computed completed tasks
  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "COMPLETED");
  }, [tasks]);

  // ============================================
  // Task CRUD Operations
  // ============================================

  const fetchTasks = useCallback(async (params?: TaskQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const mergedParams = { ...queryParams, ...params };
      setQueryParams(mergedParams);

      const response = await taskService.getTasks(mergedParams);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setTasks(response.data.data);
        setPagination({
          page: response.data.meta.page,
          limit: response.data.meta.limit,
          total: response.data.meta.total,
          totalPages: response.data.meta.totalPages,
        });
      }
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error("fetchTasks error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  const fetchTodayTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskService.getTodayTasks();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setTodayTasks(response.data);
      }
    } catch (err) {
      setError("Failed to fetch today's tasks");
      console.error("fetchTodayTasks error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUpcomingTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskService.getUpcomingTasks();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setUpcomingTasks(response.data);
      }
    } catch (err) {
      setError("Failed to fetch upcoming tasks");
      console.error("fetchUpcomingTasks error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOverdueTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskService.getOverdueTasks();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setOverdueTasks(response.data);
      }
    } catch (err) {
      setError("Failed to fetch overdue tasks");
      console.error("fetchOverdueTasks error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTask = useCallback(async (id: string): Promise<Task | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskService.getTask(id);

      if (response.error) {
        setError(response.error);
        return null;
      }

      if (response.data) {
        setSelectedTask(response.data);
        return response.data;
      }

      return null;
    } catch (err) {
      setError("Failed to fetch task");
      console.error("fetchTask error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (data: CreateTaskRequest): Promise<Task | null> => {
      setIsCreating(true);
      setError(null);

      try {
        const response = await taskService.createTask(data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Add to all relevant lists
          setTasks((prev) => [response.data!, ...prev]);
          setTodayTasks((prev) => [response.data!, ...prev]);
          setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to create task");
        console.error("createTask error:", err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, data: UpdateTaskRequest): Promise<Task | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.updateTask(id, data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          const updateInList = (list: Task[]) =>
            list.map((t) => (t.id === id ? response.data! : t));

          setTasks(updateInList);
          setTodayTasks(updateInList);
          setUpcomingTasks(updateInList);
          setOverdueTasks(updateInList);

          if (selectedTask?.id === id) {
            setSelectedTask(response.data);
          }

          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to update task");
        console.error("updateTask error:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedTask]
  );

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await taskService.deleteTask(id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      const removeFromList = (list: Task[]) => list.filter((t) => t.id !== id);

      setTasks(removeFromList);
      setTodayTasks(removeFromList);
      setUpcomingTasks(removeFromList);
      setOverdueTasks(removeFromList);
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }

      return true;
    } catch (err) {
      setError("Failed to delete task");
      console.error("deleteTask error:", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [selectedTask]);

  // ============================================
  // Status Operations
  // ============================================

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.updateTaskStatus(id, status);

        if (response.error) {
          setError(response.error);
          return false;
        }

        if (response.data) {
          const updateInList = (list: Task[]) =>
            list.map((t) => (t.id === id ? response.data! : t));

          setTasks(updateInList);
          setTodayTasks(updateInList);
          setUpcomingTasks(updateInList);
          setOverdueTasks(updateInList);

          return true;
        }

        return false;
      } catch (err) {
        setError("Failed to update task status");
        console.error("updateTaskStatus error:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const toggleTaskStatus = useCallback(
    async (id: string): Promise<boolean> => {
      const task =
        tasks.find((t) => t.id === id) ||
        todayTasks.find((t) => t.id === id) ||
        upcomingTasks.find((t) => t.id === id);

      if (!task) return false;

      const newStatus: TaskStatus =
        task.status === "COMPLETED" ? "TODO" : "COMPLETED";

      return updateTaskStatus(id, newStatus);
    },
    [tasks, todayTasks, upcomingTasks, updateTaskStatus]
  );

  const markTaskCompleted = useCallback(
    async (id: string): Promise<boolean> => {
      return updateTaskStatus(id, "COMPLETED");
    },
    [updateTaskStatus]
  );

  const markTaskTodo = useCallback(
    async (id: string): Promise<boolean> => {
      return updateTaskStatus(id, "TODO");
    },
    [updateTaskStatus]
  );

  // ============================================
  // Subtask Operations
  // ============================================

  const addSubtask = useCallback(
    async (taskId: string, title: string): Promise<TaskSubtask | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.addSubtask(taskId, { title });

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          // Update subtasks in task lists
          const addSubtaskToTask = (task: Task) =>
            task.id === taskId
              ? { ...task, subtasks: [...task.subtasks, response.data!] }
              : task;

          setTasks((prev) => prev.map(addSubtaskToTask));
          setTodayTasks((prev) => prev.map(addSubtaskToTask));
          setUpcomingTasks((prev) => prev.map(addSubtaskToTask));

          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to add subtask");
        console.error("addSubtask error:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.toggleSubtask(taskId, subtaskId);

        if (response.error) {
          setError(response.error);
          return false;
        }

        if (response.data) {
          // Update subtask in task lists
          const updateSubtaskInTask = (task: Task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((st) =>
                    st.id === subtaskId ? response.data! : st
                  ),
                }
              : task;

          setTasks((prev) => prev.map(updateSubtaskInTask));
          setTodayTasks((prev) => prev.map(updateSubtaskInTask));
          setUpcomingTasks((prev) => prev.map(updateSubtaskInTask));

          return true;
        }

        return false;
      } catch (err) {
        setError("Failed to toggle subtask");
        console.error("toggleSubtask error:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const deleteSubtask = useCallback(
    async (taskId: string, subtaskId: string): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.deleteSubtask(taskId, subtaskId);

        if (response.error) {
          setError(response.error);
          return false;
        }

        // Remove subtask from task lists
        const removeSubtaskFromTask = (task: Task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
              }
            : task;

        setTasks((prev) => prev.map(removeSubtaskFromTask));
        setTodayTasks((prev) => prev.map(removeSubtaskFromTask));
        setUpcomingTasks((prev) => prev.map(removeSubtaskFromTask));

        return true;
      } catch (err) {
        setError("Failed to delete subtask");
        console.error("deleteSubtask error:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  // ============================================
  // Category Operations
  // ============================================

  const fetchCategories = useCallback(async () => {
    setIsFetchingCategories(true);
    setError(null);

    try {
      const response = await taskService.getCategories();

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
    async (name: string, icon?: string, color?: string): Promise<TaskCategory | null> => {
      setError(null);

      try {
        const response = await taskService.createCategory({ name, icon, color });

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
      const response = await taskService.deleteCategory(id);

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
  // Project Operations
  // ============================================

  const fetchProjects = useCallback(async () => {
    setError(null);

    try {
      const response = await taskService.getProjects();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setProjects(response.data);
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error("fetchProjects error:", err);
    }
  }, []);

  // ============================================
  // Statistics Operations
  // ============================================

  const fetchOverviewStats = useCallback(async () => {
    setIsFetchingStats(true);
    setError(null);

    try {
      const response = await taskService.getOverviewStats();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setOverviewStats(response.data);
      }
    } catch (err) {
      setError("Failed to fetch overview stats");
      console.error("fetchOverviewStats error:", err);
    } finally {
      setIsFetchingStats(false);
    }
  }, []);

  const fetchWeeklyStats = useCallback(async () => {
    setIsFetchingStats(true);
    setError(null);

    try {
      const response = await taskService.getWeeklyStats();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setWeeklyStats(response.data);
      }
    } catch (err) {
      setError("Failed to fetch weekly stats");
      console.error("fetchWeeklyStats error:", err);
    } finally {
      setIsFetchingStats(false);
    }
  }, []);

  const fetchMonthlyStats = useCallback(async (year?: number, month?: number) => {
    setIsFetchingStats(true);
    setError(null);

    try {
      const response = await taskService.getMonthlyStats({ year, month });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setMonthlyStats(response.data);
      }
    } catch (err) {
      setError("Failed to fetch monthly stats");
      console.error("fetchMonthlyStats error:", err);
    } finally {
      setIsFetchingStats(false);
    }
  }, []);

  // ============================================
  // Utility Functions
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchTodayTasks(),
      fetchCategories(),
    ]);
  }, [fetchTodayTasks, fetchCategories]);

  // ============================================
  // Auto-fetch on mount
  // ============================================

  useEffect(() => {
    if (autoFetch) {
      fetchTodayTasks();
      fetchCategories();
    }
  }, [autoFetch]);

  return {
    // Data
    tasks,
    todayTasks,
    upcomingTasks,
    overdueTasks,
    completedTasks,
    categories,
    projects,
    selectedTask,
    overviewStats,
    weeklyStats,
    monthlyStats,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isFetchingCategories,
    isFetchingStats,

    // Error state
    error,

    // Pagination
    pagination,

    // Actions
    fetchTasks,
    fetchTodayTasks,
    fetchUpcomingTasks,
    fetchOverdueTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,

    // Status actions
    toggleTaskStatus,
    markTaskCompleted,
    markTaskTodo,

    // Subtask actions
    addSubtask,
    toggleSubtask,
    deleteSubtask,

    // Category actions
    fetchCategories,
    createCategory,
    deleteCategory,

    // Project actions
    fetchProjects,

    // Stats actions
    fetchOverviewStats,
    fetchWeeklyStats,
    fetchMonthlyStats,

    // Utility
    clearError,
    refresh,
  };
};

export default useTasks;
