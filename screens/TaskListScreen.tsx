/**
 * Task List Screen
 * Complete task management flow with API integration
 */

import { useGoals, useSound, useTasks } from "@/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CreateButton } from "@/components/buttons";
import { WeekCalendar } from "@/components/calendar";
import { ScreenHeader } from "@/components/navigation/screen-header";
import {
  AddCustomDateSheet,
  AddCustomHoursSheet,
  AddCustomMinutesSheet,
  GoalSelectionSheet,
  RepeatSheet,
  SelectDateSheet,
  SetReminderSheet,
} from "@/components/shared";
import {
  AddCategorySheet,
  AddPeopleSheet,
  AddTimeSheet,
  CreateTaskSheet,
  DeleteAllTasksConfirmModal,
  SetFocusDurationSheet,
  TaskEditModal,
  TaskHeaderOptionsModal,
  TaskSection,
} from "@/components/task";
import { CreateGoalSheet } from "@/components/goal/CreateGoalSheet";
import { AddLevelSheet } from "@/components/goal/AddLevelSheet";

import { Colors } from "@/constants/colors";
import { RepeatConfig } from "@/types/habit";
import { Goal, GoalFormState } from "@/types/goal";
import type {
  CreateTaskRequest,
  Person,
  ReminderValue,
  Task,
  TaskCategory,
  TaskFormState,
} from "@/types/task";
import { isTaskCompleted, collaboratorToPerson } from "@/types/task";
import { formatDateForApi } from "@/utils/dateTime";

// Helper to convert form to API request
const formToApiRequest = (
  form: TaskFormState,
  dueDate: Date | null,
  dueTime: string | null,
  category: TaskCategory | null,
  reminder: ReminderValue | null,
  assignedPeople: Person[],
  goalId?: string | null
): CreateTaskRequest => {
  return {
    title: form.title,
    description: form.description || undefined,
    priority: form.priority,
    dueDate: dueDate ? formatDateForApi(dueDate) : undefined,
    dueTime: dueTime || undefined,
    repeat: form.repeat,
    categoryId: category?.id,
    goalId: goalId || undefined,
    status: "TODO",
    // Include inline subtasks if form has them
    subtasks:
      form.subtasks && form.subtasks.length > 0
        ? form.subtasks.map((s, idx) => ({
            title: s.title,
            order: idx,
          }))
        : undefined,
    // Include inline collaborators from assigned people
    collaborators:
      assignedPeople.length > 0
        ? assignedPeople.map((p) => ({ email: p.email }))
        : undefined,
  };
};

export const TaskListScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ goalId?: string; mode?: string }>();
  const insets = useSafeAreaInsets();
  const { playCompletionSound } = useSound();

  // API Hooks
  const {
    todayTasks,
    upcomingTasks,
    selectedDateTasks,
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasksByDate,
    toggleTaskStatus,
    addSubtask,
    toggleSubtask,
    createCategory,
    refresh,
    fetchUpcomingTasks,
    fetchTasksByDate,
    fetchTodayTasks,
  } = useTasks({ autoFetch: true });

  const {
    goals,
    fetchGoals,
    createGoal,
  } = useGoals({ autoFetch: true });

  // Fetch linked goal if goalId is provided
  const [linkedGoalTitle, setLinkedGoalTitle] = useState<string | null>(null);

  useEffect(() => {
    if (params.goalId) {
      // Fetch goal details to show which goal this task will be linked to
      import('@/services/api/goal.service').then(({ goalService }) => {
        goalService.getGoal(params.goalId!).then((response) => {
          if (response.data) {
            setLinkedGoalTitle(response.data.title);
          }
        }).catch((error) => {
          console.error('Error fetching goal:', error);
        });
      });
    } else {
      setLinkedGoalTitle(null);
    }
  }, [params.goalId]);

  // Local state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal visibility states
  const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);
  const [isSelectDateVisible, setIsSelectDateVisible] = useState(false);
  const [isAddCustomDateVisible, setIsAddCustomDateVisible] = useState(false);
  const [isAddTimeVisible, setIsAddTimeVisible] = useState(false);
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [isAddPeopleVisible, setIsAddPeopleVisible] = useState(false);
  const [isTaskOptionsVisible, setIsTaskOptionsVisible] = useState(false);
  const [isSetFocusVisible, setIsSetFocusVisible] = useState(false);
  const [isHeaderOptionsVisible, setIsHeaderOptionsVisible] = useState(false);
  const [isDeleteAllConfirmVisible, setIsDeleteAllConfirmVisible] =
    useState(false);
  const [isRepeatVisible, setIsRepeatVisible] = useState(false);
  const [isSetReminderVisible, setIsSetReminderVisible] = useState(false);
  const [isAddCustomMinutesVisible, setIsAddCustomMinutesVisible] =
    useState(false);
  const [isAddCustomHoursVisible, setIsAddCustomHoursVisible] = useState(false);
  const [isGoalSelectionVisible, setIsGoalSelectionVisible] = useState(false);
  const [isGoalCreateVisible, setIsGoalCreateVisible] = useState(false);
  const [isGoalDateVisible, setIsGoalDateVisible] = useState(false);
  const [isGoalCategoryVisible, setIsGoalCategoryVisible] = useState(false);
  const [isGoalLevelVisible, setIsGoalLevelVisible] = useState(false);

  // FAB compact state while scrolling
  const [isFabCompact, setIsFabCompact] = useState(false);
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Selected task for options
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states for create task
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskDueTime, setTaskDueTime] = useState<string | null>(null);
  const [taskRepeat, setTaskRepeat] = useState<RepeatConfig | null>(null);
  const [taskCategory, setTaskCategory] = useState<TaskCategory | null>(null);
  const [taskAssignedPeople, setTaskAssignedPeople] = useState<Person[]>([]);
  const [taskReminder, setTaskReminder] = useState<ReminderValue | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [customMinutes, setCustomMinutes] = useState<number[]>([]);
  const [customHours, setCustomHours] = useState<number[]>([]);

  // Goal creation form states
  const [goalFormDate, setGoalFormDate] = useState<Date | null>(null);
  const [goalFormCategory, setGoalFormCategory] = useState<TaskCategory | null>(null);
  const [goalFormLevels, setGoalFormLevels] = useState<string[]>([]);

  // Edit task states
  const [isEditTaskVisible, setIsEditTaskVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskDueDate, setEditTaskDueDate] = useState<Date | null>(null);
  const [editTaskDueTime, setEditTaskDueTime] = useState<string | null>(null);
  const [editTaskRepeat, setEditTaskRepeat] = useState<RepeatConfig | null>(null);
  const [editTaskCategory, setEditTaskCategory] = useState<TaskCategory | null>(null);
  const [editTaskAssignedPeople, setEditTaskAssignedPeople] = useState<Person[]>([]);
  const [editTaskReminder, setEditTaskReminder] = useState<ReminderValue | null>(null);
  const [editSelectedGoalId, setEditSelectedGoalId] = useState<string | null>(null);

  // Track which sheet context we're in (create vs edit)
  const [sheetContext, setSheetContext] = useState<'create' | 'edit'>('create');

  // Open create task sheet if mode=create (from goal details)
  useEffect(() => {
    if (params.mode === 'create' && params.goalId) {
      setIsCreateTaskVisible(true);
    }
  }, [params.mode, params.goalId]);

  // Check if selected date is today
  const isToday = useMemo(() => {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  }, [selectedDate]);

  // Get tasks to display based on selected date (with fallback for undefined)
  const displayTasks = useMemo(() => {
    if (isToday) {
      return todayTasks || [];
    }
    return selectedDateTasks || [];
  }, [isToday, todayTasks, selectedDateTasks]);

  // Computed completed/pending tasks based on selected date
  const pendingTasks = useMemo(
    () => displayTasks.filter((t) => !isTaskCompleted(t)),
    [displayTasks]
  );

  // Filter upcoming tasks into pending and completed
  const pendingUpcomingTasks = useMemo(
    () => upcomingTasks.filter((t) => !isTaskCompleted(t)),
    [upcomingTasks]
  );

  const completedUpcomingTasks = useMemo(
    () => upcomingTasks.filter((t) => isTaskCompleted(t)),
    [upcomingTasks]
  );

  // Combine completed tasks from display tasks and upcoming tasks
  const completedTasks = useMemo(
    () => [...displayTasks.filter((t) => isTaskCompleted(t)), ...completedUpcomingTasks],
    [displayTasks, completedUpcomingTasks]
  );

  // Format selected date for section title
  const selectedDateTitle = useMemo(() => {
    if (isToday) return "Today";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return selectedDate.toLocaleDateString("en-US", options);
  }, [selectedDate, isToday]);

  // Handlers
  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      // Check if selected date is today
      const today = new Date();
      const isSelectedToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      if (isSelectedToday) {
        // Refresh today's tasks
        fetchTodayTasks();
      } else {
        // Fetch tasks for the selected date
        fetchTasksByDate(date);
      }
    },
    [fetchTodayTasks, fetchTasksByDate]
  );

  const handleCreateTask = useCallback(
    async (formState: TaskFormState) => {
      const apiRequest = formToApiRequest(
        formState,
        taskDueDate,
        taskDueTime,
        taskCategory,
        taskReminder,
        taskAssignedPeople,
        params.goalId || selectedGoalId || null
      );
      const result = await createTask(apiRequest);

      if (result) {
        // Reset form states
        setTaskDueDate(null);
        setTaskDueTime(null);
        setTaskRepeat(null);
        setTaskCategory(null);
        setTaskAssignedPeople([]);
        setTaskReminder(null);
        setSelectedGoalId(null);
        setIsCreateTaskVisible(false);

        // If created from goal, navigate back to goal details
        if (params.goalId) {
          router.back();
        }
        // Note: No need to refresh - the createTask hook already updates the state optimistically
      }
    },
    [
      createTask,
      taskDueDate,
      taskDueTime,
      taskCategory,
      taskReminder,
      taskAssignedPeople,
      selectedGoalId,
      params.goalId,
      router,
    ]
  );

  const handleToggleTask = useCallback(
    async (task: Task) => {
      const wasCompleted = isTaskCompleted(task);
      const success = await toggleTaskStatus(task.id);

      if (success && !wasCompleted) {
        playCompletionSound();
      }
    },
    [toggleTaskStatus, playCompletionSound]
  );

  const handleTaskPress = useCallback(
    (task: Task) => {
      router.push({
        pathname: "/task-details",
        params: { taskId: task.id },
      });
    },
    [router]
  );

  const handleTaskMore = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsTaskOptionsVisible(true);
  }, []);

  const handleSetFocusFromModal = useCallback(() => {
    setIsTaskOptionsVisible(false);
    setIsSetFocusVisible(true);
  }, []);

  const handleEditTask = useCallback(() => {
    if (!selectedTask) return;

    // Set up edit state with existing task data
    setEditingTask(selectedTask);

    // Pre-fill date
    if (selectedTask.dueDate) {
      setEditTaskDueDate(new Date(selectedTask.dueDate));
    } else {
      setEditTaskDueDate(null);
    }

    // Pre-fill time
    setEditTaskDueTime(selectedTask.dueTime || null);

    // Pre-fill category
    setEditTaskCategory(selectedTask.category || null);

    // Pre-fill goal
    setEditSelectedGoalId(selectedTask.goalId || null);

    // Pre-fill collaborators/people
    if (selectedTask.collaborators && selectedTask.collaborators.length > 0) {
      setEditTaskAssignedPeople(
        selectedTask.collaborators.map(collaboratorToPerson)
      );
    } else {
      setEditTaskAssignedPeople([]);
    }

    // Close options modal and open edit sheet
    setIsTaskOptionsVisible(false);
    setSheetContext('edit');
    setIsEditTaskVisible(true);
  }, [selectedTask]);

  const handleUpdateTask = useCallback(
    async (formState: TaskFormState) => {
      if (!editingTask) return;

      const updateData = {
        title: formState.title,
        description: formState.description || undefined,
        priority: formState.priority,
        dueDate: editTaskDueDate ? formatDateForApi(editTaskDueDate) : undefined,
        dueTime: editTaskDueTime || undefined,
        categoryId: editTaskCategory?.id,
        goalId: editSelectedGoalId || undefined,
      };

      const result = await updateTask(editingTask.id, updateData);

      if (result) {
        // Reset edit states
        setEditingTask(null);
        setEditTaskDueDate(null);
        setEditTaskDueTime(null);
        setEditTaskRepeat(null);
        setEditTaskCategory(null);
        setEditTaskAssignedPeople([]);
        setEditTaskReminder(null);
        setEditSelectedGoalId(null);
        setIsEditTaskVisible(false);
        setSheetContext('create');
      }
    },
    [
      editingTask,
      editTaskDueDate,
      editTaskDueTime,
      editTaskCategory,
      editSelectedGoalId,
      updateTask,
    ]
  );

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTask) return;
    const success = await deleteTask(selectedTask.id);
    if (success) {
      setSelectedTask(null);
      setIsTaskOptionsVisible(false);
    }
  }, [selectedTask, deleteTask]);

  const handleDeleteAllTasks = useCallback(() => {
    setIsDeleteAllConfirmVisible(true);
  }, []);

  const handleConfirmDeleteAll = useCallback(async () => {
    const dateStr = formatDateForApi(selectedDate);
    const result = await deleteAllTasksByDate(dateStr);

    if (result.success) {
      console.log(`Deleted ${result.count} tasks`);
    }
  }, [selectedDate, deleteAllTasksByDate]);

  const handleSelectDate = useCallback((date: Date | null) => {
    if (sheetContext === 'edit') {
      setEditTaskDueDate(date);
    } else {
      setTaskDueDate(date);
    }
  }, [sheetContext]);

  const handleOpenCustomDate = useCallback(() => {
    setIsSelectDateVisible(false);
    setIsAddCustomDateVisible(true);
  }, []);

  const handleCustomDateSelect = useCallback((date: Date) => {
    if (sheetContext === 'edit') {
      setEditTaskDueDate(date);
    } else {
      setTaskDueDate(date);
    }
    setIsAddCustomDateVisible(false);
  }, [sheetContext]);

  const handleAddPeople = useCallback((people: Person[]) => {
    if (sheetContext === 'edit') {
      setEditTaskAssignedPeople(people);
    } else {
      setTaskAssignedPeople(people);
    }
  }, [sheetContext]);

  const handleSelectTime = useCallback((time: string) => {
    if (sheetContext === 'edit') {
      setEditTaskDueTime(time);
    } else {
      setTaskDueTime(time);
    }
    setIsAddTimeVisible(false);
  }, [sheetContext]);

  const handleSelectCategory = useCallback(
    async (category: TaskCategory) => {
      // Check if category already exists
      const exists = categories.find((c) => c.name === category.name);
      if (!exists) {
        await createCategory(category.name, category.icon, category.color);
      }
      if (sheetContext === 'edit') {
        setEditTaskCategory(category);
      } else {
        setTaskCategory(category);
      }
      setIsAddCategoryVisible(false);
    },
    [categories, createCategory, sheetContext]
  );

  const handleSetReminder = useCallback((reminder: ReminderValue) => {
    if (sheetContext === 'edit') {
      setEditTaskReminder(reminder);
    } else {
      setTaskReminder(reminder);
    }
    setIsSetReminderVisible(false);
  }, [sheetContext]);

  const handleOpenCustomMinutes = useCallback(() => {
    setIsSetReminderVisible(false);
    setIsAddCustomMinutesVisible(true);
  }, []);

  const handleOpenCustomHours = useCallback(() => {
    setIsSetReminderVisible(false);
    setIsAddCustomHoursVisible(true);
  }, []);

  const handleOpenCustomDateFromReminder = useCallback(() => {
    setIsSetReminderVisible(false);
    setIsAddCustomDateVisible(true);
  }, []);

  const handleAddCustomMinutes = useCallback((minutes: number) => {
    setCustomMinutes((prev) => [...prev, minutes]);
    setIsAddCustomMinutesVisible(false);
    setIsSetReminderVisible(true);
  }, []);

  const handleAddCustomHours = useCallback((hours: number) => {
    setCustomHours((prev) => [...prev, hours]);
    setIsAddCustomHoursVisible(false);
    setIsSetReminderVisible(true);
  }, []);

  const handleSelectRepeat = useCallback((repeat: RepeatConfig) => {
    if (sheetContext === 'edit') {
      setEditTaskRepeat(repeat);
    } else {
      setTaskRepeat(repeat);
    }
    setIsRepeatVisible(false);
  }, [sheetContext]);

  // Goal selection handlers
  const handleSelectGoal = useCallback((goal: Goal) => {
    if (sheetContext === 'edit') {
      setEditSelectedGoalId(goal.id);
    } else {
      setSelectedGoalId(goal.id);
    }
    setIsGoalSelectionVisible(false);
  }, [sheetContext]);

  const handleCreateNewGoal = useCallback(() => {
    setIsGoalSelectionVisible(false);
    setIsGoalCreateVisible(true);
  }, []);

  const handleSubmitGoal = useCallback(async (formData: GoalFormState) => {
    const result = await createGoal(formData);
    if (result) {
      setSelectedGoalId(result.id);
      setIsGoalCreateVisible(false);
      setGoalFormDate(null);
      setGoalFormCategory(null);
      setGoalFormLevels([]);
    }
  }, [createGoal]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const openCreateTask = () => {
    setIsCreateTaskVisible(true);
  };

  const handleScroll = useCallback(() => {
    if (scrollDebounceRef.current) {
      clearTimeout(scrollDebounceRef.current);
    }
    if (!isFabCompact) setIsFabCompact(true);
    scrollDebounceRef.current = setTimeout(() => {
      setIsFabCompact(false);
      scrollDebounceRef.current = null;
    }, 300);
  }, [isFabCompact]);

  // Loading state for initial load
  if (isLoading && todayTasks.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Task List"
          onBack={() => router.back()}
          onRightPress={() => setIsHeaderOptionsVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Task List"
        onBack={() => router.back()}
        onRightPress={() => setIsHeaderOptionsVisible(true)}
      />

      {/* Calendar */}
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onMonthPress={() => console.log("Month pressed")}
        onTodayPress={() => setSelectedDate(new Date())}
      />

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Tasks List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        onScroll={handleScroll}
      >
        {/* Selected Date Section */}
        {pendingTasks.length > 0 && (
          <TaskSection
            title={selectedDateTitle}
            count={pendingTasks.length}
            tasks={pendingTasks}
            initialExpanded
            onTaskPress={handleTaskPress}
            onTaskToggle={handleToggleTask}
            onTaskMore={handleTaskMore}
          />
        )}

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <TaskSection
            title="Completed"
            count={completedTasks.length}
            tasks={completedTasks}
            initialExpanded
            onTaskPress={handleTaskPress}
            onTaskToggle={handleToggleTask}
            onTaskMore={handleTaskMore}
          />
        )}

        {/* Upcoming Section */}
        {pendingUpcomingTasks.length > 0 && (
          <TaskSection
            title="Upcoming"
            count={pendingUpcomingTasks.length}
            tasks={pendingUpcomingTasks}
            initialExpanded
            onTaskPress={handleTaskPress}
            onTaskToggle={handleToggleTask}
            onTaskMore={handleTaskMore}
          />
        )}

        {/* Empty State */}
        {displayTasks.length === 0 && pendingUpcomingTasks.length === 0 && completedTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {isToday ? "No tasks yet" : `No tasks for ${selectedDateTitle}`}
            </Text>
            <Text style={styles.emptySubtext}>
              {isToday
                ? "Create your first task to get started"
                : "Select another date or create a new task"}
            </Text>
          </View>
        )}

        {/* Spacer for FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Create Task FAB */}
      <View style={styles.fabContainer}>
        <CreateButton
          label="New Task"
          onPress={openCreateTask}
          compact={isFabCompact}
        />
      </View>

      {/* Create Task Bottom Sheet */}
      <CreateTaskSheet
        visible={isCreateTaskVisible}
        onClose={() => setIsCreateTaskVisible(false)}
        onCreateTask={handleCreateTask}
        onSelectDate={() => {
          setSheetContext('create');
          setIsSelectDateVisible(true);
        }}
        onSelectTime={() => {
          setSheetContext('create');
          setIsAddTimeVisible(true);
        }}
        onSelectRepeat={() => {
          setSheetContext('create');
          setIsRepeatVisible(true);
        }}
        onSelectCategory={() => {
          setSheetContext('create');
          setIsAddCategoryVisible(true);
        }}
        onSelectPeople={() => {
          setSheetContext('create');
          setIsAddPeopleVisible(true);
        }}
        onSetReminder={() => {
          setSheetContext('create');
          setIsSetReminderVisible(true);
        }}
        onSelectGoal={() => {
          setSheetContext('create');
          setIsGoalSelectionVisible(true);
        }}
        selectedDate={taskDueDate}
        selectedTime={taskDueTime}
        selectedRepeat={taskRepeat}
        selectedCategory={taskCategory}
        selectedPeople={taskAssignedPeople}
        selectedReminder={taskReminder}
        selectedGoal={selectedGoalId ? goals.find(g => g.id === selectedGoalId) : null}
        linkedGoalTitle={linkedGoalTitle}
      />

      {/* Edit Task Bottom Sheet */}
      <CreateTaskSheet
        visible={isEditTaskVisible}
        onClose={() => {
          setIsEditTaskVisible(false);
          setEditingTask(null);
          setSheetContext('create');
        }}
        onCreateTask={handleUpdateTask}
        onUpdateTask={handleUpdateTask}
        editMode={true}
        initialFormState={editingTask ? {
          title: editingTask.title,
          description: editingTask.description || "",
          priority: editingTask.priority,
          subtasks: editingTask.subtasks?.map(st => ({
            title: st.title,
            description: "",
          })) || [],
        } : undefined}
        onSelectDate={() => {
          setSheetContext('edit');
          setIsSelectDateVisible(true);
        }}
        onSelectTime={() => {
          setSheetContext('edit');
          setIsAddTimeVisible(true);
        }}
        onSelectRepeat={() => {
          setSheetContext('edit');
          setIsRepeatVisible(true);
        }}
        onSelectCategory={() => {
          setSheetContext('edit');
          setIsAddCategoryVisible(true);
        }}
        onSelectPeople={() => {
          setSheetContext('edit');
          setIsAddPeopleVisible(true);
        }}
        onSetReminder={() => {
          setSheetContext('edit');
          setIsSetReminderVisible(true);
        }}
        onSelectGoal={() => {
          setSheetContext('edit');
          setIsGoalSelectionVisible(true);
        }}
        selectedDate={editTaskDueDate}
        selectedTime={editTaskDueTime}
        selectedRepeat={editTaskRepeat}
        selectedCategory={editTaskCategory}
        selectedPeople={editTaskAssignedPeople}
        selectedReminder={editTaskReminder}
        selectedGoal={editSelectedGoalId ? goals.find(g => g.id === editSelectedGoalId) : null}
      />

      {/* Select Date Bottom Sheet */}
      <SelectDateSheet
        visible={isSelectDateVisible}
        onClose={() => setIsSelectDateVisible(false)}
        onSelectDate={handleSelectDate}
        onOpenCustomDate={handleOpenCustomDate}
        selectedDate={sheetContext === 'edit' ? editTaskDueDate : taskDueDate}
      />

      {/* Add Custom Date Bottom Sheet */}
      <AddCustomDateSheet
        visible={isAddCustomDateVisible}
        onClose={() => setIsAddCustomDateVisible(false)}
        onSelectDate={handleCustomDateSelect}
        selectedDate={sheetContext === 'edit' ? editTaskDueDate : taskDueDate}
      />

      {/* Add Time Bottom Sheet */}
      <AddTimeSheet
        visible={isAddTimeVisible}
        onClose={() => setIsAddTimeVisible(false)}
        onSelectTime={handleSelectTime}
        initialTime={(sheetContext === 'edit' ? editTaskDueTime : taskDueTime) || undefined}
      />

      {/* Add Category Bottom Sheet */}
      <AddCategorySheet
        visible={isAddCategoryVisible}
        onClose={() => setIsAddCategoryVisible(false)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={sheetContext === 'edit' ? editTaskCategory : taskCategory}
      />

      {/* Add People Bottom Sheet */}
      <AddPeopleSheet
        visible={isAddPeopleVisible}
        onClose={() => setIsAddPeopleVisible(false)}
        onConfirm={handleAddPeople}
        selectedPeople={sheetContext === 'edit' ? editTaskAssignedPeople : taskAssignedPeople}
      />

      {/* Repeat Bottom Sheet */}
      <RepeatSheet
        visible={isRepeatVisible}
        onClose={() => setIsRepeatVisible(false)}
        onConfirm={handleSelectRepeat}
        initialValue={(sheetContext === 'edit' ? editTaskRepeat : taskRepeat) ?? undefined}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        visible={isTaskOptionsVisible}
        onClose={() => setIsTaskOptionsVisible(false)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onSetFocus={handleSetFocusFromModal}
      />

      {/* Set Focus Duration Sheet */}
      <SetFocusDurationSheet
        visible={isSetFocusVisible}
        onClose={() => setIsSetFocusVisible(false)}
        onStart={(durationMinutes) => {
          const taskId = selectedTask?.id || "";
          const taskTitle = selectedTask?.title || "Focus Session";
          setIsSetFocusVisible(false);
          setSelectedTask(null);
          router.push({
            pathname: "/focus",
            params: { taskId, taskTitle, duration: String(durationMinutes) },
          });
        }}
        taskTitle={selectedTask?.title || ""}
      />

      {/* Header options modal */}
      <TaskHeaderOptionsModal
        visible={isHeaderOptionsVisible}
        onClose={() => setIsHeaderOptionsVisible(false)}
        onViewReports={() => {
          setIsHeaderOptionsVisible(false);
          router.push("/task-progress");
        }}
        onDeleteAll={handleDeleteAllTasks}
      />

      {/* Delete All Tasks Confirmation Modal */}
      <DeleteAllTasksConfirmModal
        visible={isDeleteAllConfirmVisible}
        onClose={() => setIsDeleteAllConfirmVisible(false)}
        onConfirm={handleConfirmDeleteAll}
        dateText={selectedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        taskCount={selectedDateTasks.length}
      />

      {/* Set Reminder Bottom Sheet */}
      <SetReminderSheet
        visible={isSetReminderVisible}
        onClose={() => setIsSetReminderVisible(false)}
        onSetReminder={handleSetReminder}
        onOpenCustomMinutes={handleOpenCustomMinutes}
        onOpenCustomHours={handleOpenCustomHours}
        onOpenCustomDate={handleOpenCustomDateFromReminder}
        selectedReminder={sheetContext === 'edit' ? editTaskReminder : taskReminder}
        customMinutes={customMinutes}
        customHours={customHours}
      />

      {/* Add Custom Minutes Bottom Sheet */}
      <AddCustomMinutesSheet
        visible={isAddCustomMinutesVisible}
        onClose={() => setIsAddCustomMinutesVisible(false)}
        onAddMinutes={handleAddCustomMinutes}
      />

      {/* Add Custom Hours Bottom Sheet */}
      <AddCustomHoursSheet
        visible={isAddCustomHoursVisible}
        onClose={() => setIsAddCustomHoursVisible(false)}
        onAddHours={handleAddCustomHours}
      />

      {/* Goal Selection Sheet */}
      <GoalSelectionSheet
        visible={isGoalSelectionVisible}
        onClose={() => setIsGoalSelectionVisible(false)}
        onSelectGoal={handleSelectGoal}
        onCreateGoal={handleCreateNewGoal}
        goals={goals}
        type="TASK"
      />

      {/* Create Goal Sheet */}
      <CreateGoalSheet
        visible={isGoalCreateVisible}
        onClose={() => {
          setIsGoalCreateVisible(false);
          setGoalFormDate(null);
          setGoalFormCategory(null);
          setGoalFormLevels([]);
        }}
        onSubmit={handleSubmitGoal}
        onOpenDateSheet={() => setIsGoalDateVisible(true)}
        onOpenCategorySheet={() => setIsGoalCategoryVisible(true)}
        onOpenLevelSheet={() => setIsGoalLevelVisible(true)}
        selectedDate={goalFormDate}
        selectedCategory={goalFormCategory}
        selectedLevels={goalFormLevels}
      />

      {/* Goal Form - Date Sheet */}
      <SelectDateSheet
        visible={isGoalDateVisible}
        onClose={() => setIsGoalDateVisible(false)}
        onSelectDate={(date) => {
          setGoalFormDate(date);
          setIsGoalDateVisible(false);
        }}
        selectedDate={goalFormDate}
      />

      {/* Goal Form - Category Sheet */}
      <AddCategorySheet
        visible={isGoalCategoryVisible}
        onClose={() => setIsGoalCategoryVisible(false)}
        onSelectCategory={(category) => {
          setGoalFormCategory(category);
          setIsGoalCategoryVisible(false);
        }}
        selectedCategory={goalFormCategory}
      />

      {/* Goal Form - Level Sheet */}
      <AddLevelSheet
        visible={isGoalLevelVisible}
        onClose={() => setIsGoalLevelVisible(false)}
        onSelectLevels={(levels) => {
          setGoalFormLevels(levels);
          setIsGoalLevelVisible(false);
        }}
        selectedLevels={goalFormLevels}
      />

      {/* Operation Loading Overlay */}
      {(isCreating || isUpdating || isDeleting) && (
        <View style={styles.operationOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.operationText}>
            {isCreating
              ? "Creating task..."
              : isDeleting
              ? "Deleting task..."
              : "Updating..."}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  bottomSpacer: {
    height: 80,
  },
  fabContainer: {
    position: "absolute",
    zIndex: 9999,
    elevation: 20,
    bottom: 32,
    right: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#1C1C1E",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  operationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    zIndex: 10000,
  },
  operationText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default TaskListScreen;
