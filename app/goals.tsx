/**
 * Goals Screen Route
 * Main screen for goal list with create/edit functionality
 */

import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { GoalListScreen } from "@/components/goal";
import { CreateGoalSheet } from "@/components/goal/CreateGoalSheet";
import { AddLevelSheet } from "@/components/goal/AddLevelSheet";
import { GoalOptionsModal } from "@/components/goal/GoalOptionsModal";
import { SelectDateSheet } from "@/components/shared/SelectDateSheet";
import { AddCategorySheet } from "@/components/shared/AddCategorySheet";
import { useGoals } from "@/hooks";
import { useTasks } from "@/hooks";
import { Goal, GoalFormState } from "@/types/goal";
import { TaskCategory } from "@/types/task";

export default function GoalsScreen() {
  const router = useRouter();
  const {
    goals,
    ongoingGoals,
    completedGoals,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createGoal,
    updateGoal,
    deleteGoal,
    duplicateGoal,
    refresh,
    searchGoals,
  } = useGoals();

  const { categories, fetchCategories } = useTasks();

  // Sheet states
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showLevelSheet, setShowLevelSheet] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Form states
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Load categories on mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreatePress = () => {
    setSelectedGoal(null);
    setSelectedDate(null);
    setSelectedCategory(null);
    setSelectedLevels([]);
    setShowCreateSheet(true);
  };

  const handleGoalPress = (goalId: string) => {
    router.push(`/goal-details?goalId=${goalId}`);
  };

  const handleGoalMore = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowOptionsModal(true);
  };

  const handleCreateGoal = async (formData: GoalFormState) => {
    const result = await createGoal(formData);
    if (result) {
      setShowCreateSheet(false);
      resetFormState();
    }
  };

  const handleEditGoal = async (formData: GoalFormState) => {
    if (!selectedGoal) return;

    const result = await updateGoal(selectedGoal.id, formData);
    if (result) {
      setShowCreateSheet(false);
      resetFormState();
    }
  };

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setSelectedDate(goal.deadline ? new Date(goal.deadline) : null);
    setSelectedCategory(goal.category || null);
    setSelectedLevels(goal.levels || []);
    setShowCreateSheet(true);
  };

  const handleDuplicate = async (goal: Goal) => {
    const result = await duplicateGoal(goal.id);
    if (result) {
      Alert.alert("Success", "Goal duplicated successfully");
    }
  };

  const handleFocus = (goal: Goal) => {
    router.push(`/goal-details?goalId=${goal.id}`);
  };

  const handleDelete = (goal: Goal) => {
    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete "${goal.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteGoal(goal.id);
            if (success) {
              Alert.alert("Success", "Goal deleted successfully");
            }
          },
        },
      ]
    );
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
    setSelectedGoal(null);
    setSelectedDate(null);
    setSelectedCategory(null);
    setSelectedLevels([]);
  };

  return (
    <>
      <GoalListScreen
        goals={goals}
        ongoingGoals={ongoingGoals}
        completedGoals={completedGoals}
        isLoading={isLoading}
        onRefresh={refresh}
        onSearch={searchGoals}
        onGoalPress={handleGoalPress}
        onGoalMore={handleGoalMore}
        onCreatePress={handleCreatePress}
        onBack={() => router.back()}
      />

      {/* Create/Edit Goal Sheet */}
      <CreateGoalSheet
        visible={showCreateSheet}
        onClose={() => {
          setShowCreateSheet(false);
          resetFormState();
        }}
        onSubmit={selectedGoal ? handleEditGoal : handleCreateGoal}
        goal={selectedGoal}
        categories={categories}
        onOpenDateSheet={() => setShowDateSheet(true)}
        onOpenCategorySheet={() => setShowCategorySheet(true)}
        onOpenLevelSheet={() => setShowLevelSheet(true)}
        selectedDate={selectedDate}
        selectedCategory={selectedCategory}
        selectedLevels={selectedLevels}
        isLoading={isCreating || isUpdating}
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

      {/* Options Modal */}
      <GoalOptionsModal
        visible={showOptionsModal}
        goal={selectedGoal}
        onClose={() => setShowOptionsModal(false)}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onFocus={handleFocus}
        onDelete={handleDelete}
      />
    </>
  );
}
