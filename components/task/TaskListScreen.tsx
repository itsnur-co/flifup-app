/**
 * Task List Screen
 * Main screen for viewing and managing tasks
 * Implements full task flow from Figma design
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { WeekCalendar } from '@/components/calendar';
import { CreateButton } from '@/components/buttons';
import {
  TaskSection,
  CreateTaskSheet,
  SelectDateSheet,
  AddPeopleSheet,
  TaskOptionsSheet,
} from '@/components/task';

import { Task, TaskFormState, Person, DateOption, Category } from '@/types/task';
import { MOCK_TASKS, MOCK_PEOPLE, getUpcomingTasks } from '@/constants/mockData';

interface TaskListScreenProps {
  onBack?: () => void;
}

export const TaskListScreen: React.FC<TaskListScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  // Task State
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Sheet visibility states
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showPeopleSheet, setShowPeopleSheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);

  // Form states
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [formTime, setFormTime] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState<Category | null>(null);
  const [formPeople, setFormPeople] = useState<Person[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Group tasks by status
  const { todayTasks, completedTasks, upcomingTasks } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysList = tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });

    const completedList = tasks.filter((task) => task.completed);

    const upcomingList = tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime();
    });

    return {
      todayTasks: todaysList,
      completedTasks: completedList,
      upcomingTasks: upcomingList,
    };
  }, [tasks]);

  // Handlers
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

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
        completed: st.completed,
        createdAt: new Date(),
      })),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    
    // Reset form state
    setFormDate(null);
    setFormTime(null);
    setFormCategory(null);
    setFormPeople([]);
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
    // Could navigate to task detail or open edit sheet
    console.log('Task pressed:', task.title);
  }, []);

  const handleTaskMore = useCallback((task: Task) => {
    setSelectedTask(task);
    setShowOptionsSheet(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    // Pre-fill form with task data and open create sheet
    setFormDate(task.dueDate ?? null);
    setFormTime(task.dueTime ?? null);
    setFormCategory(task.category ?? null);
    setFormPeople(task.assignedPeople);
    setShowCreateSheet(true);
  }, []);

  const handleDeleteTask = useCallback((task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }, []);

  const handleSelectDate = useCallback((date: Date | null, option: DateOption) => {
    setFormDate(date);
    setShowDateSheet(false);
  }, []);

  const handleSelectPeople = useCallback((people: Person[]) => {
    setFormPeople(people);
  }, []);

  const openCreateSheet = useCallback(() => {
    // Reset form state before opening
    setFormDate(null);
    setFormTime(null);
    setFormCategory(null);
    setFormPeople([]);
    setShowCreateSheet(true);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#6D28D9', '#5B21B6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <ScreenHeader
          title="Task List"
          useGlassmorphism
          onBack={onBack}
          hideBackButton={!onBack}
        />

        {/* Week Calendar */}
        <WeekCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthPress={() => console.log('Month pressed')}
          onTodayPress={() => setSelectedDate(new Date())}
        />

        {/* Task List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Today's Tasks */}
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

          {/* Completed Tasks */}
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

          {/* Upcoming Tasks */}
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
        </ScrollView>

        {/* Floating Create Button */}
        <View style={[styles.floatingButton, { bottom: insets.bottom + 24 }]}>
          <CreateButton
            label="New Task"
            onPress={openCreateSheet}
          />
        </View>
      </LinearGradient>

      {/* Bottom Sheets */}
      <CreateTaskSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onCreateTask={handleCreateTask}
        onSelectDate={() => setShowDateSheet(true)}
        onSelectTime={() => console.log('Select time')}
        onSelectCategory={() => console.log('Select category')}
        onSelectPeople={() => setShowPeopleSheet(true)}
        onSetReminder={() => console.log('Set reminder')}
        selectedDate={formDate}
        selectedTime={formTime}
        selectedCategory={formCategory}
        selectedPeople={formPeople}
      />

      <SelectDateSheet
        visible={showDateSheet}
        onClose={() => setShowDateSheet(false)}
        onSelectDate={handleSelectDate}
        selectedDate={formDate}
      />

      <AddPeopleSheet
        visible={showPeopleSheet}
        onClose={() => setShowPeopleSheet(false)}
        onConfirm={handleSelectPeople}
        selectedPeople={formPeople}
        availablePeople={MOCK_PEOPLE}
      />

      <TaskOptionsSheet
        visible={showOptionsSheet}
        onClose={() => setShowOptionsSheet(false)}
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
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
  },
});

export default TaskListScreen;
