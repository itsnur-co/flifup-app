/**
 * Habit List Screen
 * Main screen for viewing and managing habits
 */

import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSound } from "@/hooks";

import { CreateButton } from "@/components/buttons";
import { WeekCalendar } from "@/components/calendar";
import {
  AddCategorySheet,
  AddGoalSheet,
  CategoryFilter,
  CreateHabitSheet,
  HabitEditModal,
  HabitSection,
  HeaderOptionsSheet,
  RepeatSheet,
} from "@/components/habit";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { SelectDateSheet } from "@/components/task";

import {
  MOCK_HABITS,
  MOCK_HABIT_CATEGORIES,
  getCategoryFilterCounts,
  getHabitsByStatus,
} from "@/constants/habitMockData";
import {
  Habit,
  HabitCategory,
  HabitFormState,
  HabitGoal,
  RepeatConfig,
} from "@/types/habit";

interface HabitListScreenProps {
  onBack?: () => void;
  onNavigateToProgress?: (habit?: Habit) => void;
}

export const HabitListScreen: React.FC<HabitListScreenProps> = ({
  onBack,
  onNavigateToProgress,
}) => {
  const insets = useSafeAreaInsets();
  const { playCompletionSound } = useSound();

  // Habit State
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("all");

  // FAB compact state while scrolling
  const [isFabCompact, setIsFabCompact] = useState(false);
  const scrollDebounceRef = React.useRef<number | null>(null);

  // Sheet visibility states
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showRepeatSheet, setShowRepeatSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showGoalSheet, setShowGoalSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);

  // Form states
  const [formRepeat, setFormRepeat] = useState<RepeatConfig | undefined>();
  const [formStartDate, setFormStartDate] = useState<Date | null>(null);
  const [formGoal, setFormGoal] = useState<HabitGoal | null>(null);
  const [formCategory, setFormCategory] = useState<HabitCategory | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  // Category filter data
  const categoryFilters = useMemo(() => {
    const counts = getCategoryFilterCounts(habits);
    const filters = [{ id: "all", name: "All Habits", count: counts.all || 0 }];

    MOCK_HABIT_CATEGORIES.forEach((cat) => {
      if (counts[cat.name]) {
        filters.push({ id: cat.id, name: cat.name, count: counts[cat.name] });
      }
    });

    return filters;
  }, [habits]);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    if (selectedCategory === "all") return habits;
    const category = MOCK_HABIT_CATEGORIES.find(
      (c) => c.id === selectedCategory
    );
    if (!category) return habits;
    return habits.filter((h) => h.category?.name === category.name);
  }, [habits, selectedCategory]);

  // Group habits by status
  const { today: todayHabits, completed: completedHabits } = useMemo(() => {
    return getHabitsByStatus(filteredHabits, selectedDate);
  }, [filteredHabits, selectedDate]);

  // Handlers
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleCreateHabit = useCallback((formState: HabitFormState) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formState.name,
      repeat: formState.repeat,
      startDate: formState.startDate,
      goal: formState.goal,
      category: formState.category,
      reminder: formState.reminder,
      comment: formState.comment,
      completed: false,
      completedDates: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setHabits((prev) => [newHabit, ...prev]);
    resetFormState();
  }, []);

  const resetFormState = () => {
    setFormRepeat(undefined);
    setFormStartDate(null);
    setFormGoal(null);
    setFormCategory(null);
  };

  const handleToggleHabit = useCallback(
    (habit: Habit) => {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const isCompleting = !habit.completedDates.includes(dateStr);

      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habit.id) return h;

          const isCompleted = h.completedDates.includes(dateStr);
          const newCompletedDates = isCompleted
            ? h.completedDates.filter((d) => d !== dateStr)
            : [...h.completedDates, dateStr];

          return {
            ...h,
            completedDates: newCompletedDates,
            updatedAt: new Date(),
          };
        })
      );

      // Play sound only when completing a habit (not when uncompleting)
      if (isCompleting) {
        playCompletionSound();
      }
    },
    [selectedDate, playCompletionSound]
  );

  const handleHabitMore = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setShowOptionsSheet(true);
  }, []);

  const handleEditHabit = useCallback(() => {
    if (!selectedHabit) return;
    setFormRepeat(selectedHabit.repeat);
    setFormStartDate(selectedHabit.startDate);
    setFormGoal(selectedHabit.goal);
    setFormCategory(selectedHabit.category);
    setShowCreateSheet(true);
  }, [selectedHabit]);

  const handleDeleteHabit = useCallback(() => {
    if (!selectedHabit) return;
    setHabits((prev) => prev.filter((h) => h.id !== selectedHabit.id));
  }, [selectedHabit]);

  const handleHabitProgress = useCallback(() => {
    if (!selectedHabit) return;
    onNavigateToProgress?.(selectedHabit);
  }, [selectedHabit, onNavigateToProgress]);

  const handleOverallProgress = useCallback(() => {
    onNavigateToProgress?.();
  }, [onNavigateToProgress]);

  const openCreateSheet = useCallback(() => {
    resetFormState();
    setShowCreateSheet(true);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Habit List"
        onBack={onBack}
        hideBackButton={!onBack}
        rightIcon="more-horizontal"
        onRightPress={() => setShowHeaderOptions(true)}
      />

      {/* Week Calendar */}
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onMonthPress={() => console.log("Month pressed")}
        onTodayPress={() => setSelectedDate(new Date())}
      />

      {/* Category Filter */}
      <CategoryFilter
        categories={categoryFilters}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={() => setShowCategorySheet(true)}
      />

      {/* Habit List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
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
        {/* Today's Habits */}
        {todayHabits.length > 0 && (
          <HabitSection
            title="Today"
            count={todayHabits.length}
            habits={todayHabits}
            initialExpanded
            onHabitToggle={handleToggleHabit}
            onHabitMore={handleHabitMore}
          />
        )}

        {/* Completed Habits */}
        {completedHabits.length > 0 && (
          <HabitSection
            title="Completed"
            count={completedHabits.length}
            habits={completedHabits}
            initialExpanded
            onHabitToggle={handleToggleHabit}
            onHabitMore={handleHabitMore}
          />
        )}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.fabContainer}>
        <CreateButton label="New Habit" onPress={openCreateSheet} compact={isFabCompact} />
      </View>

      {/* Bottom Sheets */}

      {/* Header Options Sheet */}
      <HeaderOptionsSheet
        visible={showHeaderOptions}
        onClose={() => setShowHeaderOptions(false)}
        onAddNewHabit={openCreateSheet}
        onOverallProgress={handleOverallProgress}
      />

      {/* Create Habit Sheet */}
      <CreateHabitSheet
        visible={showCreateSheet}
        onClose={() => {
          setShowCreateSheet(false);
          resetFormState();
        }}
        onCreateHabit={handleCreateHabit}
        onSelectRepeat={() => setShowRepeatSheet(true)}
        onSelectStartDate={() => setShowDateSheet(true)}
        onSelectGoal={() => setShowGoalSheet(true)}
        onSelectCategory={() => setShowCategorySheet(true)}
        onSetReminder={() => console.log("Set reminder")}
        selectedRepeat={formRepeat}
        selectedStartDate={formStartDate}
        selectedGoal={formGoal}
        selectedCategory={formCategory}
      />

      {/* Repeat Sheet */}
      <RepeatSheet
        visible={showRepeatSheet}
        onClose={() => setShowRepeatSheet(false)}
        onConfirm={(repeat) => setFormRepeat(repeat)}
        initialValue={formRepeat}
      />

      {/* Start Date Sheet */}
      <SelectDateSheet
        visible={showDateSheet}
        onClose={() => setShowDateSheet(false)}
        onSelectDate={(date) => setFormStartDate(date)}
        selectedDate={formStartDate}
      />

      {/* Add Goal Sheet */}
      <AddGoalSheet
        visible={showGoalSheet}
        onClose={() => setShowGoalSheet(false)}
        onConfirm={(goal) => setFormGoal(goal)}
        initialValue={formGoal}
      />

      {/* Add Category Sheet */}
      <AddCategorySheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onConfirm={(category) => setFormCategory(category)}
        selectedCategory={formCategory}
        categories={MOCK_HABIT_CATEGORIES}
      />

      {/* Habit Edit Modal */}
      <HabitEditModal
        visible={showOptionsSheet}
        onClose={() => {
          setShowOptionsSheet(false);
          setSelectedHabit(null);
        }}
        onEdit={handleEditHabit}
        onProgress={handleHabitProgress}
        onDelete={handleDeleteHabit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
});

export default HabitListScreen;
