/**
 * Task Management Hook
 * Handles task CRUD operations with API integration
 * Provides loading states, error handling, and optimistic updates
 */

import {
  TaskMonthlyStats,
  TaskOverviewStats,
  taskService,
  TaskWeeklyStats,
} from "@/services/api/task.service";
import type {
  CreateCategoryRequest,
  CreateTaskRequest,
  ReminderUnit,
  Task,
  TaskCategory,
  TaskDetail,
  TaskGoal,
  TaskQueryParams,
  TaskReminder,
  TaskStatus,
  TaskSubtask,
  UpdateTaskRequest,
} from "@/types/task";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  selectedDateTasks: Task[];
  categories: TaskCategory[];
  projects: string[];
  goals: TaskGoal[];
  selectedTask: Task | null;
  taskDetail: TaskDetail | null;
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

  // Task CRUD Actions
  fetchTasks: (params?: TaskQueryParams) => Promise<void>;
  fetchTodayTasks: () => Promise<void>;
  fetchUpcomingTasks: () => Promise<void>;
  fetchOverdueTasks: () => Promise<void>;
  fetchTasksByDate: (date: Date) => Promise<void>;
  fetchTask: (id: string) => Promise<Task | null>;
  fetchTaskDetail: (id: string) => Promise<TaskDetail | null>;
  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  setSelectedTask: (task: Task | null) => void;

  // Status actions
  toggleTaskStatus: (id: string) => Promise<boolean>;
  markTaskCompleted: (id: string) => Promise<boolean>;
  markTaskTodo: (id: string) => Promise<boolean>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<boolean>;

  // Subtask actions
  addSubtask: (taskId: string, title: string) => Promise<TaskSubtask | null>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<boolean>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<boolean>;
  updateSubtask: (
    taskId: string,
    subtaskId: string,
    data: { title?: string; isCompleted?: boolean }
  ) => Promise<TaskSubtask | null>;
  reorderSubtasks: (taskId: string, orderedIds: string[]) => Promise<boolean>;

  // Category actions
  fetchCategories: () => Promise<void>;
  createCategory: (
    name: string,
    icon?: string,
    color?: string
  ) => Promise<TaskCategory | null>;
  updateCategory: (
    id: string,
    data: Partial<CreateCategoryRequest>
  ) => Promise<TaskCategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Goal actions
  fetchGoals: (params?: {
    isCompleted?: boolean;
    search?: string;
  }) => Promise<void>;
  createGoal: (data: {
    title: string;
    description?: string;
    icon?: string;
    color?: string;
  }) => Promise<TaskGoal | null>;
  updateGoal: (
    id: string,
    data: Partial<{
      title: string;
      description?: string;
      icon?: string;
      color?: string;
    }>
  ) => Promise<TaskGoal | null>;
  deleteGoal: (id: string) => Promise<boolean>;

  // Reminder actions
  addReminder: (
    taskId: string,
    value: number,
    unit: ReminderUnit
  ) => Promise<TaskReminder | null>;
  deleteReminder: (taskId: string, reminderId: string) => Promise<boolean>;
  getReminders: (taskId: string) => Promise<TaskReminder[]>;

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
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [goals, setGoals] = useState<TaskGoal[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [overviewStats, setOverviewStats] = useState<TaskOverviewStats | null>(
    null
  );
  const [weeklyStats, setWeeklyStats] = useState<TaskWeeklyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<TaskMonthlyStats | null>(
    null
  );

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
  // Helper: Update task in all lists
  // ============================================
  const updateTaskInAllLists = useCallback((updatedTask: Task) => {
    const updateInList = (list: Task[]) =>
      list.map((t) => (t.id === updatedTask.id ? updatedTask : t));

    setTasks(updateInList);
    setTodayTasks(updateInList);
    setUpcomingTasks(updateInList);
    setOverdueTasks(updateInList);
  }, []);

  const removeTaskFromAllLists = useCallback((taskId: string) => {
    const removeFromList = (list: Task[]) =>
      list.filter((t) => t.id !== taskId);

    setTasks(removeFromList);
    setTodayTasks(removeFromList);
    setUpcomingTasks(removeFromList);
    setOverdueTasks(removeFromList);
  }, []);

  // ============================================
  // Task CRUD Operations
  // ============================================

  const fetchTasks = useCallback(
    async (params?: TaskQueryParams) => {
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
    },
    [queryParams]
  );

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

  /**
   * Fetch tasks for a specific date
   * Uses dueDateFrom and dueDateTo filters to get tasks for that day
   */
  const fetchTasksByDate = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      // Format date as YYYY-MM-DD for API
      const dateStr = date.toISOString().split("T")[0];

      const response = await taskService.getTasks({
        dueDateFrom: dateStr,
        dueDateTo: dateStr,
        sortBy: "dueDate",
        sortOrder: "asc",
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setSelectedDateTasks(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch tasks for date");
      console.error("fetchTasksByDate error:", err);
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

  /**
   * Fetch enhanced task detail with subtask counts and grouping
   * Use this for the task details screen
   */
  const fetchTaskDetail = useCallback(
    async (id: string): Promise<TaskDetail | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await taskService.getTaskDetail(id);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setTaskDetail(response.data);
          // Also set selectedTask for compatibility
          setSelectedTask(response.data);
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to fetch task detail");
        console.error("fetchTaskDetail error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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
          // Add to relevant lists
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
          updateTaskInAllLists(response.data);

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
    [selectedTask, updateTaskInAllLists]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await taskService.deleteTask(id);

        if (response.error) {
          setError(response.error);
          return false;
        }

        removeTaskFromAllLists(id);
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));

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
    },
    [selectedTask, removeTaskFromAllLists]
  );

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
          updateTaskInAllLists(response.data);
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
    [updateTaskInAllLists]
  );

  const toggleTaskStatus = useCallback(
    async (id: string): Promise<boolean> => {
      const task =
        tasks.find((t) => t.id === id) ||
        todayTasks.find((t) => t.id === id) ||
        upcomingTasks.find((t) => t.id === id) ||
        overdueTasks.find((t) => t.id === id);

      if (!task) return false;

      const newStatus: TaskStatus =
        task.status === "COMPLETED" ? "TODO" : "COMPLETED";

      return updateTaskStatus(id, newStatus);
    },
    [tasks, todayTasks, upcomingTasks, overdueTasks, updateTaskStatus]
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

          if (selectedTask?.id === taskId) {
            setSelectedTask((prev) =>
              prev
                ? { ...prev, subtasks: [...prev.subtasks, response.data!] }
                : null
            );
          }

          // Also update taskDetail if it matches
          if (taskDetail?.id === taskId) {
            setTaskDetail((prev) =>
              prev
                ? { ...prev, subtasks: [...prev.subtasks, response.data!] }
                : null
            );
          }

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
    [selectedTask, taskDetail]
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

          if (selectedTask?.id === taskId) {
            setSelectedTask((prev) =>
              prev
                ? {
                    ...prev,
                    subtasks: prev.subtasks.map((st) =>
                      st.id === subtaskId ? response.data! : st
                    ),
                  }
                : null
            );
          }

          // Also update taskDetail if it matches
          if (taskDetail?.id === taskId) {
            setTaskDetail((prev) =>
              prev
                ? {
                    ...prev,
                    subtasks: prev.subtasks.map((st) =>
                      st.id === subtaskId ? response.data! : st
                    ),
                  }
                : null
            );
          }

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
    [selectedTask, taskDetail]
  );

  const updateSubtask = useCallback(
    async (
      taskId: string,
      subtaskId: string,
      data: { title?: string; isCompleted?: boolean }
    ): Promise<TaskSubtask | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.updateSubtask(
          taskId,
          subtaskId,
          data
        );

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
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

          // Also update selectedTask if it matches
          if (selectedTask?.id === taskId) {
            setSelectedTask((prev) =>
              prev
                ? {
                    ...prev,
                    subtasks: prev.subtasks.map((st) =>
                      st.id === subtaskId ? response.data! : st
                    ),
                  }
                : null
            );
          }

          // Also update taskDetail if it matches
          if (taskDetail?.id === taskId) {
            setTaskDetail((prev) =>
              prev
                ? {
                    ...prev,
                    subtasks: prev.subtasks.map((st) =>
                      st.id === subtaskId ? response.data! : st
                    ),
                  }
                : null
            );
          }

          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to update subtask");
        console.error("updateSubtask error:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedTask, taskDetail]
  );

  const reorderSubtasks = useCallback(
    async (taskId: string, orderedIds: string[]): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        const response = await taskService.reorderSubtasks(taskId, orderedIds);

        if (response.error) {
          setError(response.error);
          return false;
        }

        if (response.data) {
          const updateSubtasksInTask = (task: Task) =>
            task.id === taskId ? { ...task, subtasks: response.data! } : task;

          setTasks((prev) => prev.map(updateSubtasksInTask));
          setTodayTasks((prev) => prev.map(updateSubtasksInTask));
          setUpcomingTasks((prev) => prev.map(updateSubtasksInTask));

          return true;
        }

        return false;
      } catch (err) {
        setError("Failed to reorder subtasks");
        console.error("reorderSubtasks error:", err);
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

        if (selectedTask?.id === taskId) {
          setSelectedTask((prev) =>
            prev
              ? {
                  ...prev,
                  subtasks: prev.subtasks.filter((st) => st.id !== subtaskId),
                }
              : null
          );
        }

        // Also update taskDetail if it matches
        if (taskDetail?.id === taskId) {
          setTaskDetail((prev) =>
            prev
              ? {
                  ...prev,
                  subtasks: prev.subtasks.filter((st) => st.id !== subtaskId),
                }
              : null
          );
        }

        return true;
      } catch (err) {
        setError("Failed to delete subtask");
        console.error("deleteSubtask error:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedTask, taskDetail]
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
    async (
      name: string,
      icon?: string,
      color?: string
    ): Promise<TaskCategory | null> => {
      setError(null);

      try {
        const response = await taskService.createCategory({
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

  const updateCategory = useCallback(
    async (
      id: string,
      data: Partial<CreateCategoryRequest>
    ): Promise<TaskCategory | null> => {
      setError(null);

      try {
        const response = await taskService.updateCategory(id, data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? response.data! : c))
          );
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to update category");
        console.error("updateCategory error:", err);
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
  // Goal Operations
  // ============================================

  const fetchGoals = useCallback(
    async (params?: { isCompleted?: boolean; search?: string }) => {
      setError(null);

      try {
        const response = await taskService.getGoals(params);

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.data) {
          setGoals(response.data);
        }
      } catch (err) {
        setError("Failed to fetch goals");
        console.error("fetchGoals error:", err);
      }
    },
    []
  );

  const createGoal = useCallback(
    async (data: {
      title: string;
      description?: string;
      icon?: string;
      color?: string;
    }): Promise<TaskGoal | null> => {
      setError(null);

      try {
        const response = await taskService.createGoal(data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setGoals((prev) => [...prev, response.data!]);
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to create goal");
        console.error("createGoal error:", err);
        return null;
      }
    },
    []
  );

  const updateGoal = useCallback(
    async (
      id: string,
      data: Partial<{
        title: string;
        description?: string;
        icon?: string;
        color?: string;
      }>
    ): Promise<TaskGoal | null> => {
      setError(null);

      try {
        const response = await taskService.updateGoal(id, data);

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setGoals((prev) =>
            prev.map((g) => (g.id === id ? response.data! : g))
          );
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to update goal");
        console.error("updateGoal error:", err);
        return null;
      }
    },
    []
  );

  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await taskService.deleteGoal(id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      setGoals((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete goal");
      console.error("deleteGoal error:", err);
      return false;
    }
  }, []);

  // ============================================
  // Reminder Operations
  // ============================================

  const addReminder = useCallback(
    async (
      taskId: string,
      value: number,
      unit: ReminderUnit
    ): Promise<TaskReminder | null> => {
      setError(null);

      try {
        const response = await taskService.addReminder(taskId, { value, unit });

        if (response.error) {
          setError(response.error);
          return null;
        }

        return response.data || null;
      } catch (err) {
        setError("Failed to add reminder");
        console.error("addReminder error:", err);
        return null;
      }
    },
    []
  );

  const deleteReminder = useCallback(
    async (taskId: string, reminderId: string): Promise<boolean> => {
      setError(null);

      try {
        const response = await taskService.deleteReminder(taskId, reminderId);

        if (response.error) {
          setError(response.error);
          return false;
        }

        return true;
      } catch (err) {
        setError("Failed to delete reminder");
        console.error("deleteReminder error:", err);
        return false;
      }
    },
    []
  );

  const getReminders = useCallback(
    async (taskId: string): Promise<TaskReminder[]> => {
      try {
        const response = await taskService.getReminders(taskId);

        if (response.error) {
          return [];
        }

        return response.data || [];
      } catch (err) {
        console.error("getReminders error:", err);
        return [];
      }
    },
    []
  );

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

  const fetchMonthlyStats = useCallback(
    async (year?: number, month?: number) => {
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
    },
    []
  );

  // ============================================
  // Utility Functions
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchTodayTasks(),
      fetchUpcomingTasks(),
      fetchCategories(),
    ]);
  }, [fetchTodayTasks, fetchUpcomingTasks, fetchCategories]);

  // ============================================
  // Auto-fetch on mount
  // ============================================

  useEffect(() => {
    if (autoFetch) {
      fetchTodayTasks();
      fetchUpcomingTasks();
      fetchCategories();
    }
  }, [autoFetch, fetchTodayTasks, fetchUpcomingTasks, fetchCategories]);

  return {
    // Data
    tasks,
    todayTasks,
    upcomingTasks,
    overdueTasks,
    completedTasks,
    selectedDateTasks,
    categories,
    projects,
    goals,
    selectedTask,
    taskDetail,
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

    // Task CRUD Actions
    fetchTasks,
    fetchTodayTasks,
    fetchUpcomingTasks,
    fetchOverdueTasks,
    fetchTasksByDate,
    fetchTask,
    fetchTaskDetail,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,

    // Status actions
    toggleTaskStatus,
    markTaskCompleted,
    markTaskTodo,
    updateTaskStatus,

    // Subtask actions
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateSubtask,
    reorderSubtasks,

    // Category actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    // Goal actions
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,

    // Reminder actions
    addReminder,
    deleteReminder,
    getReminders,

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
