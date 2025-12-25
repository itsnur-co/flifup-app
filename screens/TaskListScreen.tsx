/**
 * Task List Screen
 * Complete task management flow with all interactions
 * Matches Figma design pixel-perfect
 */

import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CreateButton } from "@/components/buttons";
import { WeekCalendar } from "@/components/calendar";
import { ScreenHeader } from "@/components/navigation/screen-header";
import {
  AddPeopleSheet,
  CreateTaskSheet,
  SelectDateSheet,
  TaskOptionsSheet,
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

  // Task data state
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modal visibility states
  const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);
  const [isSelectDateVisible, setIsSelectDateVisible] = useState(false);
  const [isAddPeopleVisible, setIsAddPeopleVisible] = useState(false);
  const [isTaskOptionsVisible, setIsTaskOptionsVisible] = useState(false);

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
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, completed: !t.completed, updatedAt: new Date() }
          : t
      )
    );
  }, []);

  const handleTaskPress = useCallback((task: Task) => {
    // Navigate to task detail or open edit
    console.log("Task pressed:", task.title);
  }, []);

  const handleTaskMore = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsTaskOptionsVisible(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    // Open edit task sheet with pre-filled data
    console.log("Edit task:", task.title);
    // Could set states and open CreateTaskSheet in edit mode
  }, []);

  const handleDeleteTask = useCallback((task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }, []);

  const handleSelectDate = useCallback(
    (date: Date | null, option: DateOption) => {
      setTaskDueDate(date);
      console.log("Selected date option:", option);
    },
    []
  );

  const handleAddPeople = useCallback((people: Person[]) => {
    setTaskAssignedPeople(people);
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
        onSelectTime={() => console.log("Select time")}
        onSelectCategory={() => console.log("Select category")}
        onSelectPeople={() => setIsAddPeopleVisible(true)}
        onSetReminder={() => console.log("Set reminder")}
        selectedDate={taskDueDate}
        selectedTime={taskDueTime}
        selectedCategory={taskCategory}
        selectedPeople={taskAssignedPeople}
      />

      {/* Select Date Bottom Sheet */}
      <SelectDateSheet
        visible={isSelectDateVisible}
        onClose={() => setIsSelectDateVisible(false)}
        onSelectDate={handleSelectDate}
        selectedDate={taskDueDate}
      />

      {/* Add People Bottom Sheet */}
      <AddPeopleSheet
        visible={isAddPeopleVisible}
        onClose={() => setIsAddPeopleVisible(false)}
        onConfirm={handleAddPeople}
        availablePeople={MOCK_PEOPLE}
        selectedPeople={taskAssignedPeople}
      />

      {/* Task Options Bottom Sheet */}
      <TaskOptionsSheet
        visible={isTaskOptionsVisible}
        onClose={() => setIsTaskOptionsVisible(false)}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
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
