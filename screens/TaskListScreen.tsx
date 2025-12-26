/**
 * Task List Screen
 * Complete task management flow with all interactions
 * Matches Figma design pixel-perfect
 */

import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSound } from "@/hooks";

import { CreateButton } from "@/components/buttons";
import { WeekCalendar } from "@/components/calendar";
import { ScreenHeader } from "@/components/navigation/screen-header";
import {
  AddCategorySheet,
  AddCustomDateSheet,
  AddCustomHoursSheet,
  AddCustomMinutesSheet,
  AddPeopleSheet,
  AddTimeSheet,
  CreateTaskSheet,
  ReminderValue,
  SelectDateSheet,
  SetReminderSheet,
  TaskEditModal,
  TaskSection,
} from "@/components/task";

import { MOCK_PEOPLE, MOCK_TASKS } from "@/constants/mockData";
import {
  Category,
  DateOption,
  Person,
  Task,
  TaskFormState,
} from "@/types/task";

export const TaskListScreen: React.FC = () => {
  const router = useRouter();
  const { playCompletionSound } = useSound();

  // Task data state
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modal visibility states
  const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);
  const [isSelectDateVisible, setIsSelectDateVisible] = useState(false);
  const [isAddCustomDateVisible, setIsAddCustomDateVisible] = useState(false);
  const [isAddTimeVisible, setIsAddTimeVisible] = useState(false);
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [isAddPeopleVisible, setIsAddPeopleVisible] = useState(false);
  const [isTaskOptionsVisible, setIsTaskOptionsVisible] = useState(false);
  const [isSetReminderVisible, setIsSetReminderVisible] = useState(false);
  const [isAddCustomMinutesVisible, setIsAddCustomMinutesVisible] = useState(false);
  const [isAddCustomHoursVisible, setIsAddCustomHoursVisible] = useState(false);

  // FAB compact state while scrolling
  const [isFabCompact, setIsFabCompact] = useState(false);
  const scrollDebounceRef = useRef<number | null>(null);

  // Selected task for options
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states for create task
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [taskDueTime, setTaskDueTime] = useState<string | null>(null);
  const [taskCategory, setTaskCategory] = useState<Category | null>(null);
  const [taskAssignedPeople, setTaskAssignedPeople] = useState<Person[]>([]);
  const [taskReminder, setTaskReminder] = useState<ReminderValue | null>(null);
  const [customMinutes, setCustomMinutes] = useState<number[]>([]);
  const [customHours, setCustomHours] = useState<number[]>([]);

  // Computed task groups
  const todayTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      task.dueDate.toDateString() === new Date().toDateString()
  );

  const completedTasks = tasks.filter((task) => task.completed);

  const upcomingTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      task.dueDate.toDateString() !== new Date().toDateString()
  );

  // Handlers
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateTask = useCallback((formState: TaskFormState) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: formState.title,
      description: formState.description,
      dueDate: formState.dueDate ?? undefined,
      dueTime: formState.dueTime ?? undefined,
      category: formState.category ?? undefined,
      assignedPeople: formState.assignedPeople,
      reminder: formState.reminder ?? undefined,
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

    // Reset form states
    setTaskDueDate(null);
    setTaskDueTime(null);
    setTaskCategory(null);
    setTaskAssignedPeople([]);
  }, []);

  const handleToggleTask = useCallback((task: Task) => {
    const isCompleting = !task.completed;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, completed: !t.completed, updatedAt: new Date() }
          : t
      )
    );

    // Play sound only when completing a task (not when uncompleting)
    if (isCompleting) {
      playCompletionSound();
    }
  }, [playCompletionSound]);

  const handleTaskPress = useCallback((task: Task) => {
    router.push({
      pathname: "/task-details",
      params: { taskId: task.id },
    });
  }, [router]);

  const handleTaskMore = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsTaskOptionsVisible(true);
  }, []);

  const handleEditTask = useCallback(() => {
    if (!selectedTask) return;
    // Open edit task sheet with pre-filled data
    console.log("Edit task:", selectedTask.title);
    // Could set states and open CreateTaskSheet in edit mode
  }, [selectedTask]);

  const handleDeleteTask = useCallback(() => {
    if (!selectedTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
  }, [selectedTask]);

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

  const handleSelectCategory = useCallback((category: Category) => {
    setTaskCategory(category);
    setIsAddCategoryVisible(false);
  }, []);

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

  const openCreateTask = () => {
    setIsCreateTaskVisible(true);
  };

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

      {/* Tasks List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={() => {
          // mark compact while scrolling
          if (scrollDebounceRef.current) {
            clearTimeout(scrollDebounceRef.current);
          }
          if (!isFabCompact) setIsFabCompact(true);
          // when user stops scrolling for 300ms, expand FAB
          // @ts-ignore - window.setTimeout returns number in RN
          scrollDebounceRef.current = window.setTimeout(() => {
            setIsFabCompact(false);
            scrollDebounceRef.current = null;
          }, 300);
        }}
      >
        {/* Today Section */}
        {todayTasks.length > 0 && (
          <TaskSection
            title="Today"
            count={todayTasks.length}
            tasks={todayTasks}
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
        onSelectCategory={() => setIsAddCategoryVisible(true)}
        onSelectPeople={() => setIsAddPeopleVisible(true)}
        onSetReminder={() => setIsSetReminderVisible(true)}
        selectedDate={taskDueDate}
        selectedTime={taskDueTime}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundGradient: {
    flex: 1,
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
    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});

export default TaskListScreen;
