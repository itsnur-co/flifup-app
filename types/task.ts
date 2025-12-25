/**
 * Task-related type definitions
 * Centralized types for task management feature
 */

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  dueTime?: string;
  category?: Category;
  assignedPeople: Person[];
  reminder?: Date;
  subTasks: SubTask[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type DateOption = 
  | 'today'
  | 'tomorrow'
  | 'later-this-week'
  | 'this-weekend'
  | 'next-week'
  | 'no-date'
  | 'custom';

export interface DateOptionItem {
  id: DateOption;
  label: string;
  icon: string;
  dayLabel?: string;
  getDate: () => Date | null;
}

export type TaskFilterType = 'all' | 'today' | 'upcoming' | 'completed';

export interface TaskGroup {
  title: string;
  count: number;
  tasks: Task[];
  isExpanded: boolean;
}

// Form state for creating/editing tasks
export interface TaskFormState {
  title: string;
  description: string;
  dueDate: Date | null;
  dueTime: string | null;
  category: Category | null;
  assignedPeople: Person[];
  reminder: Date | null;
  subTasks: Omit<SubTask, 'id' | 'createdAt'>[];
}

export const DEFAULT_TASK_FORM: TaskFormState = {
  title: '',
  description: '',
  dueDate: null,
  dueTime: null,
  category: null,
  assignedPeople: [],
  reminder: null,
  subTasks: [],
};
