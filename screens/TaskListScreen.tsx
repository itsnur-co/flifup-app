/**
 * Task List Screen
 * Complete task management flow with API integration
 */

import { useSound, useTasks } from "@/hooks";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  ReminderValue,
  RepeatSheet,
  SelectDateSheet,
  SetReminderSheet,
} from "@/components/shared";
import {
  AddCategorySheet,
  AddPeopleSheet,
  AddTimeSheet,
  CreateTaskSheet,
  TaskEditModal,
  TaskSection,
} from "@/components/task";

import { Colors } from "@/constants/colors";
import { MOCK_PEOPLE } from "@/constants/mockData";
import {
  Task as ApiTask,
  CreateTaskRequest,
  TaskCategory,
} from "@/services/api/task.service";
import { RepeatConfig } from "@/types/habit";
import {
  Category,
  DateOption,
  Task as LocalTask,
  Person,
  Task,
  TaskFormState,
} from "@/types/task";

// Helper to convert API task to local task type
const mapApiTaskToLocal = (apiTask: ApiTask): LocalTask => {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : undefined,
    dueTime: apiTask.dueTime || undefined,
    repeat: undefined, // API uses different repeat structure
    category: apiTask.category
      ? {
          id: apiTask.category.id,
          name: apiTask.category.name,
          icon: apiTask.category.icon || "📋",
          color: apiTask.category.color || Colors.primary,
        }
      : undefined,
    assignedPeople: [], // Would need collaborators mapping
    reminder: apiTask.reminderAt ? new Date(apiTask.reminderAt) : undefined,
    subTasks:
      apiTask.subtasks?.map((st) => ({
        id: st.id,
        title: st.title,
        description: "",
        completed: st.isCompleted,
        createdAt: new Date(st.createdAt),
      })) || [],
    completed: apiTask.status === "COMPLETED",
    createdAt: new Date(apiTask.createdAt),
    updatedAt: new Date(apiTask.updatedAt),
  };
};

// Helper to convert form to API request
const mapFormToApiRequest = (form: TaskFormState): CreateTaskRequest => {
  return {
    title: form.title,
    description: form.description || undefined,
    priority: "MEDIUM",
    dueDate: form.dueDate?.toISOString().split("T")[0],
    dueTime: form.dueTime || undefined,
    repeat: "NONE",
    categoryId: form.category?.id,
    status: "TODO",
  };
};

export const TaskListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { playCompletionSound } = useSound();

  // API Hook
  const {
    todayTasks: apiTodayTasks,
    upcomingTasks: apiUpcomingTasks,
    categories: apiCategories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createTask,
    deleteTask,
    toggleTaskStatus,
    addSubtask,
    toggleSubtask,
    createCategory,
    refresh,
  } = useTasks({ autoFetch: true });

  // Map API tasks to local format
  const todayTasks = useMemo(
    () => apiTodayTasks.map(mapApiTaskToLocal),
    [apiTodayTasks]
  );

  const upcomingTasks = useMemo(
    () => apiUpcomingTasks.map(mapApiTaskToLocal),
    [apiUpcomingTasks]
  );

  // Computed completed tasks from today
  const completedTasks = useMemo(
    () => todayTasks.filter((t: Task) => t.completed),
    [todayTasks]
  );

  const pendingTodayTasks = useMemo(
    () => todayTasks.filter((t: Task) => !t.completed),
    [todayTasks]
  );

  // Map API categories to local format
  const categories: Category[] = useMemo(() => {
    return apiCategories.map((c: TaskCategory) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "📋",
      color: c.color || Colors.primary,
    }));
  }, [apiCategories]);

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
  const [isRepeatVisible, setIsRepeatVisible] = useState(false);
  const [isSetReminderVisible, setIsSetReminderVisible] = useState(false);
  const [isAddCustomMinutesVisible, setIsAddCustomMinutesVisible] =
    useState(false);
  const [isAddCustomHoursVisible, setIsAddCustomHoursVisible] = useState(false);

  // FAB compact state while scrolling
  const [isFabCompact, setIsFabCompact] = useState(false);
  const scrollDebounceRef = useRef<number | null>(null);

  // Selected task for options
  const [selectedTask, setSelectedTask] = useState<LocalTask | null>(null);

  // Form states for create task
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskDueTime, setTaskDueTime] = useState<string | null>(null);
  const [taskRepeat, setTaskRepeat] = useState<RepeatConfig | null>(null);
  const [taskCategory, setTaskCategory] = useState<Category | null>(null);
  const [taskAssignedPeople, setTaskAssignedPeople] = useState<Person[]>([]);
  const [taskReminder, setTaskReminder] = useState<ReminderValue | null>(null);
  const [customMinutes, setCustomMinutes] = useState<number[]>([]);
  const [customHours, setCustomHours] = useState<number[]>([]);

  // Handlers
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateTask = useCallback(
    async (formState: TaskFormState) => {
      const apiRequest = mapFormToApiRequest(formState);
      const result = await createTask(apiRequest);

      if (result) {
        // Reset form states
        setTaskDueDate(null);
        setTaskDueTime(null);
        setTaskRepeat(null);
        setTaskCategory(null);
        setTaskAssignedPeople([]);
        setTaskReminder(null);
        setIsCreateTaskVisible(false);
      }
    },
    [createTask]
  );

  const handleToggleTask = useCallback(
    async (task: LocalTask) => {
      const wasCompleted = task.completed;
      const success = await toggleTaskStatus(task.id);

      if (success && !wasCompleted) {
        playCompletionSound();
      }
    },
    [toggleTaskStatus, playCompletionSound]
  );

  const handleTaskPress = useCallback(
    (task: LocalTask) => {
      router.push({
        pathname: "/task-details",
        params: { taskId: task.id },
      });
    },
    [router]
  );

  const handleTaskMore = useCallback((task: LocalTask) => {
    setSelectedTask(task);
    setIsTaskOptionsVisible(true);
  }, []);

  const handleEditTask = useCallback(() => {
    if (!selectedTask) return;
    // TODO: Open edit task sheet with pre-filled data
    console.log("Edit task:", selectedTask.title);
  }, [selectedTask]);

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTask) return;
    const success = await deleteTask(selectedTask.id);
    if (success) {
      setSelectedTask(null);
      setIsTaskOptionsVisible(false);
    }
  }, [selectedTask, deleteTask]);

  const handleSelectDate = useCallback(
    (date: Date | null, option: DateOption) => {
      setTaskDueDate(date);
      console.log("Selected date option:", option);
    },
    []
  );

  const handleOpenCustomDate = useCallback(() => {
    setIsSelectDateVisible(false);
    setIsAddCustomDateVisible(true);
  }, []);

  const handleCustomDateSelect = useCallback((date: Date) => {
    setTaskDueDate(date);
    setIsAddCustomDateVisible(false);
  }, []);

  const handleAddPeople = useCallback((people: Person[]) => {
    setTaskAssignedPeople(people);
  }, []);

  const handleSelectTime = useCallback((time: string) => {
    setTaskDueTime(time);
    setIsAddTimeVisible(false);
  }, []);

  const handleSelectCategory = useCallback(
    async (category: Category) => {
      // Check if category already exists
      const exists = categories.find((c) => c.name === category.name);
      if (!exists) {
        await createCategory(category.name, category.icon, category.color);
      }
      setTaskCategory(category);
      setIsAddCategoryVisible(false);
    },
    [categories, createCategory]
  );

  const handleSetReminder = useCallback((reminder: ReminderValue) => {
    setTaskReminder(reminder);
    setIsSetReminderVisible(false);
  }, []);

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
    setTaskRepeat(repeat);
    setIsRepeatVisible(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const openCreateTask = () => {
    setIsCreateTaskVisible(true);
  };

  // Loading state for initial load
  if (isLoading && todayTasks.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Task List" onBack={() => router.back()} />
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
      <ScreenHeader title="Task List" onBack={() => router.back()} />

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
        onScroll={() => {
          if (scrollDebounceRef.current) {
            clearTimeout(scrollDebounceRef.current);
          }
          if (!isFabCompact) setIsFabCompact(true);
          // @ts-ignore
          scrollDebounceRef.current = window.setTimeout(() => {
            setIsFabCompact(false);
            scrollDebounceRef.current = null;
          }, 300);
        }}
      >
        {/* Today Section */}
        {pendingTodayTasks.length > 0 && (
          <TaskSection
            title="Today"
            count={pendingTodayTasks.length}
            tasks={pendingTodayTasks}
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
        {upcomingTasks.length > 0 && (
          <TaskSection
            title="Upcoming"
            count={upcomingTasks.length}
            tasks={upcomingTasks}
            initialExpanded={false}
            onTaskPress={handleTaskPress}
            onTaskToggle={handleToggleTask}
            onTaskMore={handleTaskMore}
          />
        )}

        {/* Empty State */}
        {todayTasks.length === 0 && upcomingTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first task to get started
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
        onSelectDate={() => setIsSelectDateVisible(true)}
        onSelectTime={() => setIsAddTimeVisible(true)}
        onSelectRepeat={() => setIsRepeatVisible(true)}
        onSelectCategory={() => setIsAddCategoryVisible(true)}
        onSelectPeople={() => setIsAddPeopleVisible(true)}
        onSetReminder={() => setIsSetReminderVisible(true)}
        selectedDate={taskDueDate}
        selectedTime={taskDueTime}
        selectedRepeat={taskRepeat}
        selectedCategory={taskCategory}
        selectedPeople={taskAssignedPeople}
        selectedReminder={taskReminder}
      />

      {/* Select Date Bottom Sheet */}
      <SelectDateSheet
        visible={isSelectDateVisible}
        onClose={() => setIsSelectDateVisible(false)}
        onSelectDate={handleSelectDate}
        onOpenCustomDate={handleOpenCustomDate}
        selectedDate={taskDueDate}
      />

      {/* Add Custom Date Bottom Sheet */}
      <AddCustomDateSheet
        visible={isAddCustomDateVisible}
        onClose={() => setIsAddCustomDateVisible(false)}
        onSelectDate={handleCustomDateSelect}
        selectedDate={taskDueDate}
      />

      {/* Add Time Bottom Sheet */}
      <AddTimeSheet
        visible={isAddTimeVisible}
        onClose={() => setIsAddTimeVisible(false)}
        onSelectTime={handleSelectTime}
        initialTime={taskDueTime || undefined}
      />

      {/* Add Category Bottom Sheet */}
      <AddCategorySheet
        visible={isAddCategoryVisible}
        onClose={() => setIsAddCategoryVisible(false)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={taskCategory}
      />

      {/* Add People Bottom Sheet */}
      <AddPeopleSheet
        visible={isAddPeopleVisible}
        onClose={() => setIsAddPeopleVisible(false)}
        onConfirm={handleAddPeople}
        availablePeople={MOCK_PEOPLE}
        selectedPeople={taskAssignedPeople}
      />

      {/* Repeat Bottom Sheet */}
      <RepeatSheet
        visible={isRepeatVisible}
        onClose={() => setIsRepeatVisible(false)}
        onConfirm={handleSelectRepeat}
        initialValue={taskRepeat ?? undefined}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        visible={isTaskOptionsVisible}
        onClose={() => setIsTaskOptionsVisible(false)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* Set Reminder Bottom Sheet */}
      <SetReminderSheet
        visible={isSetReminderVisible}
        onClose={() => setIsSetReminderVisible(false)}
        onSetReminder={handleSetReminder}
        onOpenCustomMinutes={handleOpenCustomMinutes}
        onOpenCustomHours={handleOpenCustomHours}
        onOpenCustomDate={handleOpenCustomDateFromReminder}
        selectedReminder={taskReminder}
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
