/**
 * Task Management Hook
 * Centralized state management for tasks
 * Handles CRUD operations and filtering
 */

import { useCallback, useMemo, useState } from 'react';
import { Task, TaskFormState, SubTask } from '@/types/task';

interface UseTasksReturn {
  tasks: Task[];
  todayTasks: Task[];
  completedTasks: Task[];
  upcomingTasks: Task[];
  addTask: (formState: TaskFormState) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTasks = (initialTasks: Task[] = []): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Filter tasks by status
  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate.toDateString() === today
    );
  }, [tasks]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  const upcomingTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate.toDateString() !== today
    );
  }, [tasks]);

  // Add new task
  const addTask = useCallback((formState: TaskFormState): Task => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: formState.title,
      description: formState.description,
      dueDate: formState.dueDate,
      dueTime: formState.dueTime,
      category: formState.category,
      assignedPeople: formState.assignedPeople,
      reminder: formState.reminder,
      subTasks: formState.subTasks.map((st, index) => ({
        id: `${Date.now()}-${index}`,
        title: st.title,
        description: st.description,
        completed: false,
        createdAt: new Date(),
      })),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // Update task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  // Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  // Toggle subtask completion
  const toggleSubTask = useCallback((taskId: string, subTaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const updatedSubTasks = task.subTasks.map((st) =>
          st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );

        return {
          ...task,
          subTasks: updatedSubTasks,
          updatedAt: new Date(),
        };
      })
    );
  }, []);

  // Get task by ID
  const getTaskById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((task) => task.id === id);
    },
    [tasks]
  );

  return {
    tasks,
    todayTasks,
    completedTasks,
    upcomingTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    toggleSubTask,
    getTaskById,
  };
};

export default useTasks;
