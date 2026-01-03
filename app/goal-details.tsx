/**
 * Goal Details Screen Route
 * Displays goal information with tasks/levels
 */

import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GoalDetailsScreen } from "@/components/goal";
import { CreateGoalSheet } from "@/components/goal/CreateGoalSheet";
import { SelectDateSheet } from "@/components/shared/SelectDateSheet";
import { AddCategorySheet } from "@/components/shared/AddCategorySheet";
import { AddLevelSheet } from "@/components/goal/AddLevelSheet";
import { useGoals, useTasks } from "@/hooks";
import { GoalFormState } from "@/types/goal";
import { TaskCategory } from "@/types/task";

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

  const { categories, fetchCategories, toggleTaskCompletion } = useTasks();

  // Sheet states
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showLevelSheet, setShowLevelSheet] = useState(false);

  // Form states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
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
      setSelectedDate(selectedGoal.deadline ? new Date(selectedGoal.deadline) : null);
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
    // Navigate to task creation with goalId pre-filled
    router.push(`/tasks?goalId=${goalId}&mode=create`);
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTaskCompletion(taskId);
    // Refresh goal to update progress
    if (goalId) {
      await fetchGoal(goalId);
    }
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/task-details?taskId=${taskId}`);
  };

  const handleTaskMore = (taskId: string) => {
    // Could implement task options modal here
    console.log("Task more:", taskId);
  };

  const handleUpdateGoal = async (formData: GoalFormState) => {
    if (!selectedGoal) return;

    const result = await updateGoal(selectedGoal.id, formData);
    if (result) {
      setShowEditSheet(false);
      resetFormState();
      // Refresh goal
      if (goalId) {
        await fetchGoal(goalId);
      }
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
        onBack={() => router.back()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateLevel={handleCreateLevel}
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
    </>
  );
}
