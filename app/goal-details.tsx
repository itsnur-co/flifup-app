/**
 * Goal Details Screen Route
 * Displays goal information with tasks/levels
 */

import { GoalDetailsScreen } from "@/components/goal";
import { AddLevelSheet } from "@/components/goal/AddLevelSheet";
import { CreateGoalSheet } from "@/components/goal/CreateGoalSheet";
import { AddCategorySheet } from "@/components/shared/AddCategorySheet";
import { SelectDateSheet } from "@/components/shared/SelectDateSheet";
import { HabitOptionsSheet } from "@/components/habit/HabitOptionsSheet";
import { useGoals, useHabits, useTasks, useSound } from "@/hooks";
import { GoalFormState } from "@/types/goal";
import { TaskCategory } from "@/types/task";
import { Habit } from "@/types/habit";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function GoalDetailsRoute() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();

  const {
    selectedGoal,
    isFetchingDetail,
    isUpdating,
    isDeleting,
    fetchGoal,
    updateGoal,
    deleteGoal,
  } = useGoals({ autoFetch: false });

  const { categories, fetchCategories, toggleTaskStatus } = useTasks();
  const { completeHabitForDate, uncompleteHabitForDate, deleteHabit } = useHabits();
  const { playCompletionSound } = useSound();

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sheet states
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showLevelSheet, setShowLevelSheet] = useState(false);
  const [showHabitOptionsModal, setShowHabitOptionsModal] = useState(false);

  // Habit management state
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  // Form states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(
    null
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Fetch goal and categories on mount
  useEffect(() => {
    if (goalId) {
      fetchGoal(goalId);
      fetchCategories();
    }
  }, [goalId]);

  const handleEdit = () => {
    if (selectedGoal) {
      setSelectedDate(
        selectedGoal.deadline ? new Date(selectedGoal.deadline) : null
      );
      setSelectedCategory(selectedGoal.category || null);
      setSelectedLevels(selectedGoal.levels || []);
      setShowEditSheet(true);
    }
  };

  const handleDelete = () => {
    if (!selectedGoal) return;

    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete "${selectedGoal.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteGoal(selectedGoal.id);
            if (success) {
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleCreateLevel = () => {
    if (!selectedGoal) return;

    // Navigate to appropriate creation screen based on goal type
    if (selectedGoal.type === "HABIT") {
      router.push(`/habit?goalId=${goalId}&mode=create`);
    } else {
      router.push(`/tasks?goalId=${goalId}&mode=create`);
    }
  };

  const handleRefresh = async () => {
    if (!goalId) return;
    setIsRefreshing(true);
    try {
      await fetchGoal(goalId);
    } catch (err) {
      console.error('handleRefresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!selectedGoal) return;

    // Toggle task or habit based on goal type
    if (selectedGoal.type === "HABIT") {
      // Get today's date string
      const todayStr = new Date().toISOString().split('T')[0];

      // Find the habit to check if it's completed today
      const habit = selectedGoal.habits?.find(h => h.id === taskId);

      if (!habit) {
        console.log('[DEBUG] Habit not found:', taskId);
        return;
      }

      // Check if habit is completed today
      const isCompletedToday = (habit.completedDates || []).includes(todayStr);

      try {
        // API call (no full screen reload - habit hooks handle state updates)
        if (isCompletedToday) {
          await uncompleteHabitForDate(taskId, todayStr);
        } else {
          await completeHabitForDate(taskId, todayStr);
          // Play sound when habit is completed
          playCompletionSound();
        }
      } catch (err) {
        console.error('[DEBUG] Habit toggle error:', err);
        Alert.alert("Error", "Failed to update habit. Please try again.");
      }
    } else {
      // TASK type
      const task = selectedGoal.tasks?.find(t => t.id === taskId);
      const isCompleted = task?.status === "COMPLETED";

      try {
        // API call (no full screen reload - task hooks handle state updates)
        await toggleTaskStatus(taskId);

        // Play sound when task is marked as complete
        if (isCompleted === false) {
          playCompletionSound();
        }
      } catch (err) {
        console.error('[DEBUG] Task toggle error:', err);
        Alert.alert("Error", "Failed to update task. Please try again.");
      }
    }
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/task-details?taskId=${taskId}`);
  };

  const handleTaskMore = (taskId: string) => {
    // Handle task or habit based on goal type
    if (selectedGoal?.type === "HABIT") {
      // Find habit and show options modal
      const allHabits = [...(selectedGoal.habits || [])];
      const habit = allHabits.find(h => h.id === taskId);
      if (habit) {
        setSelectedHabit(habit);
        setShowHabitOptionsModal(true);
      }
    } else {
      // Could implement task options modal here
      console.log("Task more:", taskId);
    }
  };

  const handleHabitEdit = (habit: Habit) => {
    // Navigate to habit edit screen
    router.push(`/habit?habitId=${habit.id}&mode=edit`);
  };

  const handleHabitProgress = (habit: Habit) => {
    // Navigate to habit progress screen
    router.push(`/habit-progress?habitId=${habit.id}`);
  };

  const handleHabitDelete = async (habit: Habit) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit(habit.id);
              // Hook will handle state update - no full refresh needed
            } catch (err) {
              console.error('handleHabitDelete error:', err);
              Alert.alert("Error", "Failed to delete habit. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleUpdateGoal = async (formData: GoalFormState) => {
    if (!selectedGoal) return;

    try {
      await updateGoal(selectedGoal.id, formData);
      // updateGoal hook handles state - no full refresh needed
      setShowEditSheet(false);
      resetFormState();
    } catch (err) {
      console.error('handleUpdateGoal error:', err);
      Alert.alert("Error", "Failed to update goal. Please try again.");
    }
  };

  const handleSelectDate = (date: Date | null) => {
    setSelectedDate(date);
    setShowDateSheet(false);
  };

  const handleSelectCategory = (category: TaskCategory) => {
    setSelectedCategory(category);
    setShowCategorySheet(false);
  };

  const handleSelectLevels = (levels: string[]) => {
    setSelectedLevels(levels);
    setShowLevelSheet(false);
  };

  const resetFormState = () => {
    setSelectedDate(null);
    setSelectedCategory(null);
    setSelectedLevels([]);
  };

  return (
    <>
      <GoalDetailsScreen
        goal={selectedGoal}
        isLoading={isFetchingDetail}
        isRefreshing={isRefreshing}
        onBack={() => router.back()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateLevel={handleCreateLevel}
        onRefresh={handleRefresh}
        onToggleTask={handleToggleTask}
        onTaskPress={handleTaskPress}
        onTaskMore={handleTaskMore}
      />

      {/* Edit Goal Sheet */}
      <CreateGoalSheet
        visible={showEditSheet}
        onClose={() => {
          setShowEditSheet(false);
          resetFormState();
        }}
        onSubmit={handleUpdateGoal}
        goal={selectedGoal}
        categories={categories}
        onOpenDateSheet={() => setShowDateSheet(true)}
        onOpenCategorySheet={() => setShowCategorySheet(true)}
        onOpenLevelSheet={() => setShowLevelSheet(true)}
        selectedDate={selectedDate}
        selectedCategory={selectedCategory}
        selectedLevels={selectedLevels}
        isLoading={isUpdating}
      />

      {/* Date Selection Sheet */}
      <SelectDateSheet
        visible={showDateSheet}
        onClose={() => setShowDateSheet(false)}
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />

      {/* Category Selection Sheet */}
      <AddCategorySheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        categories={categories}
      />

      {/* Level Selection Sheet */}
      <AddLevelSheet
        visible={showLevelSheet}
        onClose={() => setShowLevelSheet(false)}
        onSelectLevels={handleSelectLevels}
        selectedLevels={selectedLevels}
      />

      {/* Habit Options Sheet */}
      <HabitOptionsSheet
        visible={showHabitOptionsModal}
        onClose={() => setShowHabitOptionsModal(false)}
        habit={selectedHabit}
        onEdit={handleHabitEdit}
        onProgress={handleHabitProgress}
        onDelete={handleHabitDelete}
      />
    </>
  );
}
