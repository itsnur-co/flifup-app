/**
 * Habit List Screen
 * Main screen for viewing and managing habits
 * Integrated with API services
 */

import { useGoals, useHabits, useSound } from "@/hooks";
import React, { useCallback, useMemo, useState } from "react";
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
import { ChartIcon } from "@/components/icons/HabitIcons";
import { PlusIcon } from "@/components/icons/TaskIcons";
import { ScreenHeader } from "@/components/navigation/screen-header";
import {
  AddCustomHoursSheet,
  AddCustomMinutesSheet,
  GoalSelectionSheet,
  ModalOption,
  OptionsModal,
  ReminderValue,
  SelectDateSheet,
  SetReminderSheet,
} from "@/components/shared";
import { AddCategorySheet } from "./AddCategorySheet";
import { CreateGoalSheet } from "@/components/goal/CreateGoalSheet";
import { AddLevelSheet } from "@/components/goal/AddLevelSheet";
import { CategoryFilter } from "./CategoryFilter";
import { CreateHabitSheet } from "./CreateHabitSheet";
import { HabitEditModal } from "./HabitEditModal";
import { HabitSection } from "./HabitSection";
import { RepeatSheet } from "./RepeatSheet";
import { Goal, GoalFormState } from "@/types/goal";
import { TaskCategory } from "@/types/task";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/colors";
import {
  CreateHabitRequest,
  HabitApi,
  HabitCategoryApi,
} from "@/services/api/habit.service";
import {
  DayOfWeek,
  Habit,
  HabitCategory,
  HabitFormState,
  HabitGoal,
  IntervalOption,
  RepeatConfig,
} from "@/types/habit";

interface HabitListScreenProps {
  onBack?: () => void;
  onNavigateToProgress?: (habit?: Habit) => void;
}

// Helper to convert API habit to local habit type
const mapApiHabitToLocal = (apiHabit: HabitApi): Habit => {
  // Map repeat type correctly based on the API type
  const repeatType = apiHabit.repeatType.toLowerCase() as "daily" | "monthly" | "interval";
  let repeat: RepeatConfig;

  if (repeatType === "daily") {
    // Convert day numbers (0-6) to day names
    const dayNames: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const days = apiHabit.repeatDays.map(dayNum => dayNames[dayNum]).filter(Boolean) as DayOfWeek[];
    repeat = { type: "daily", days };
  } else if (repeatType === "monthly") {
    repeat = { type: "monthly", dayOfMonth: apiHabit.repeatDays[0] || 1 };
  } else {
    repeat = { type: "interval", everyDays: (apiHabit.repeatInterval || 2) as IntervalOption };
  }

  return {
    id: apiHabit.id,
    name: apiHabit.name,
    repeat,
    startDate: new Date(apiHabit.startDate),
    goal: apiHabit.goalValue
      ? {
          value: apiHabit.goalValue,
          unit: apiHabit.goalUnit || "COUNT",
          frequency: apiHabit.goalFrequency || "PER_DAY",
        }
      : undefined,
    category: apiHabit.category
      ? {
          id: apiHabit.category.id,
          name: apiHabit.category.name,
          icon: apiHabit.category.icon || "📌",
          color: apiHabit.category.color || "#9039FF",
        }
      : undefined,
    reminder: apiHabit.reminderTime || undefined,
    comment: apiHabit.comment || undefined,
    completed: apiHabit.isCompletedToday || false,
    completedDates:
      apiHabit.completions?.map((c) => c.date.split("T")[0]) || [],
    createdAt: new Date(apiHabit.createdAt),
    updatedAt: new Date(apiHabit.updatedAt),
  };
};

// Helper to convert local form to API request
const mapFormToApiRequest = (form: HabitFormState): CreateHabitRequest => {
  // Convert repeat config to API format
  const repeatType = (form.repeat?.type?.toUpperCase() || "DAILY") as "DAILY" | "MONTHLY" | "INTERVAL";
  let repeatDays: number[] = [];
  let repeatInterval: number | undefined;

  if (form.repeat?.type === "daily") {
    // Convert day names to day numbers (0-6)
    const dayMap: Record<DayOfWeek, number> = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    repeatDays = form.repeat.days.map(day => dayMap[day]);
  } else if (form.repeat?.type === "monthly") {
    repeatDays = [form.repeat.dayOfMonth];
  } else if (form.repeat?.type === "interval") {
    repeatInterval = form.repeat.everyDays;
  }

  return {
    name: form.name,
    description: form.comment || undefined,
    repeatType,
    repeatDays,
    repeatInterval,
    startDate: form.startDate?.toISOString() || new Date().toISOString(),
    goalValue: form.goal?.value,
    goalUnit: form.goal?.unit as any,
    goalFrequency: form.goal?.frequency as any,
    categoryId: form.category?.id,
    goalId: form.goalId || undefined,
    reminderTime: form.reminder || undefined,
    comment: form.comment,
    status: "ACTIVE",
  };
};

export const HabitListScreen: React.FC<HabitListScreenProps> = ({
  onBack,
  onNavigateToProgress,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { playCompletionSound } = useSound();

  // API Hooks
  const {
    todayHabits: apiTodayHabits,
    categories: apiCategories,
    isLoading,
    isCreating,
    isDeleting,
    isCompleting,
    error,
    createHabit,
    deleteHabit,
    toggleHabitCompletion,
    createCategory,
    refresh,
  } = useHabits({ autoFetch: true });

  const {
    goals,
    fetchGoals,
    createGoal,
  } = useGoals({ autoFetch: true });

  // Map API habits to local format
  const habits = useMemo(() => {
    return apiTodayHabits.map(mapApiHabitToLocal);
  }, [apiTodayHabits]);

  // Map API categories to local format
  const categories: HabitCategory[] = useMemo(() => {
    return apiCategories.map((c: HabitCategoryApi) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "📌",
      color: c.color || "#9039FF",
    }));
  }, [apiCategories]);

  // Local state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FAB compact state while scrolling
  const [isFabCompact, setIsFabCompact] = useState(false);
  const scrollDebounceRef = React.useRef<number | null>(null);

  // Sheet visibility states
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showRepeatSheet, setShowRepeatSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showGoalSelectionSheet, setShowGoalSelectionSheet] = useState(false);
  const [showGoalCreateSheet, setShowGoalCreateSheet] = useState(false);
  const [showGoalDateSheet, setShowGoalDateSheet] = useState(false);
  const [showGoalCategorySheet, setShowGoalCategorySheet] = useState(false);
  const [showGoalLevelSheet, setShowGoalLevelSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [showReminderSheet, setShowReminderSheet] = useState(false);
  const [showCustomMinutesSheet, setShowCustomMinutesSheet] = useState(false);
  const [showCustomHoursSheet, setShowCustomHoursSheet] = useState(false);

  // Form states
  const [formRepeat, setFormRepeat] = useState<RepeatConfig | undefined>();
  const [formStartDate, setFormStartDate] = useState<Date | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState<HabitCategory | null>(null);
  const [formReminder, setFormReminder] = useState<ReminderValue | null>(null);
  const [customMinutes, setCustomMinutes] = useState<number[]>([]);
  const [customHours, setCustomHours] = useState<number[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  // Goal creation form states
  const [goalFormDate, setGoalFormDate] = useState<Date | null>(null);
  const [goalFormCategory, setGoalFormCategory] = useState<TaskCategory | null>(null);
  const [goalFormLevels, setGoalFormLevels] = useState<string[]>([]);

  // Category filter data
  const categoryFilters = useMemo(() => {
    const counts: Record<string, number> = { all: habits.length };

    habits.forEach((habit) => {
      if (habit.category?.name) {
        counts[habit.category.name] = (counts[habit.category.name] || 0) + 1;
      }
    });

    const filters = [{ id: "all", name: "All Habits", count: counts.all || 0 }];

    categories.forEach((cat) => {
      if (counts[cat.name]) {
        filters.push({ id: cat.id, name: cat.name, count: counts[cat.name] });
      }
    });

    return filters;
  }, [habits, categories]);

  // Filtered habits by category
  const filteredHabits = useMemo(() => {
    if (selectedCategory === "all") return habits;
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return habits;
    return habits.filter((h) => h.category?.name === category.name);
  }, [habits, selectedCategory, categories]);

  // Group habits by completion status
  const { todayHabits, completedHabits } = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];

    const today = filteredHabits.filter(
      (h) => !h.completedDates.includes(dateStr)
    );
    const completed = filteredHabits.filter((h) =>
      h.completedDates.includes(dateStr)
    );

    return { todayHabits: today, completedHabits: completed };
  }, [filteredHabits, selectedDate]);

  // Handlers
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleCreateHabit = useCallback(
    async (formState: HabitFormState) => {
      const apiRequest = mapFormToApiRequest(formState);
      const result = await createHabit(apiRequest);

      if (result) {
        resetFormState();
        setShowCreateSheet(false);
      }
    },
    [createHabit]
  );

  const resetFormState = () => {
    setFormRepeat(undefined);
    setFormStartDate(null);
    setSelectedGoalId(null);
    setFormCategory(null);
    setFormReminder(null);
  };

  const handleToggleHabit = useCallback(
    async (habit: Habit) => {
      const wasCompleted = habit.completedDates.includes(
        selectedDate.toISOString().split("T")[0]
      );

      const success = await toggleHabitCompletion(habit.id);

      if (success && !wasCompleted) {
        playCompletionSound();
      }
    },
    [selectedDate, toggleHabitCompletion, playCompletionSound]
  );

  const handleHabitMore = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setShowOptionsSheet(true);
  }, []);

  const handleEditHabit = useCallback(() => {
    if (!selectedHabit) return;
    setFormRepeat(selectedHabit.repeat);
    setFormStartDate(selectedHabit.startDate);
    setFormCategory(selectedHabit.category);
    setShowCreateSheet(true);
  }, [selectedHabit]);

  const handleDeleteHabit = useCallback(async () => {
    if (!selectedHabit) return;
    const success = await deleteHabit(selectedHabit.id);
    if (success) {
      setSelectedHabit(null);
      setShowOptionsSheet(false);
    }
  }, [selectedHabit, deleteHabit]);

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

  // Header options configuration
  const headerOptions: ModalOption[] = useMemo(
    () => [
      {
        id: "add-new",
        label: "Add New Habit",
        icon: <PlusIcon size={22} color="#FFFFFF" />,
        onPress: openCreateSheet,
      },
      {
        id: "overall-progress",
        label: "Overall Progress",
        icon: <ChartIcon size={22} color="#FFFFFF" />,
        onPress: handleOverallProgress,
      },
    ],
    [openCreateSheet, handleOverallProgress]
  );

  const handleSetReminder = useCallback((reminder: ReminderValue) => {
    setFormReminder(reminder);
    setShowReminderSheet(false);
  }, []);

  const handleOpenCustomMinutes = useCallback(() => {
    setShowReminderSheet(false);
    setShowCustomMinutesSheet(true);
  }, []);

  const handleOpenCustomHours = useCallback(() => {
    setShowReminderSheet(false);
    setShowCustomHoursSheet(true);
  }, []);

  const handleAddCustomMinutes = useCallback((minutes: number) => {
    setCustomMinutes((prev) => [...prev, minutes]);
    setShowCustomMinutesSheet(false);
    setShowReminderSheet(true);
  }, []);

  const handleAddCustomHours = useCallback((hours: number) => {
    setCustomHours((prev) => [...prev, hours]);
    setShowCustomHoursSheet(false);
    setShowReminderSheet(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const handleCategorySelect = useCallback(
    async (category: HabitCategory) => {
      const exists = categories.find((c) => c.name === category.name);
      if (!exists) {
        await createCategory(category.name, category.icon, category.color);
      }
      setFormCategory(category);
      setShowCategorySheet(false);
    },
    [categories, createCategory]
  );

  // Goal selection handlers
  const handleSelectGoal = useCallback((goal: Goal) => {
    setSelectedGoalId(goal.id);
    setShowGoalSelectionSheet(false);
  }, []);

  const handleCreateNewGoal = useCallback(() => {
    setShowGoalSelectionSheet(false);
    setShowGoalCreateSheet(true);
  }, []);

  const handleSubmitGoal = useCallback(async (formData: GoalFormState) => {
    const result = await createGoal(formData);
    if (result) {
      setSelectedGoalId(result.id);
      setShowGoalCreateSheet(false);
      setGoalFormDate(null);
      setGoalFormCategory(null);
      setGoalFormLevels([]);
    }
  }, [createGoal]);

  // Loading state for initial load
  if (isLoading && habits.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Habit List"
          onBack={onBack}
          hideBackButton={!onBack}
          rightIcon="more-horizontal"
          onRightPress={() => setShowHeaderOptions(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading habits...</Text>
        </View>
      </View>
    );
  }

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

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Habit List */}
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
        {/* Today's Habits */}
        {todayHabits.length > 0 && (
          <HabitSection
            title="Today"
            count={todayHabits.length}
            habits={todayHabits}
            initialExpanded={true}
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
            initialExpanded={false}
            onHabitToggle={handleToggleHabit}
            onHabitMore={handleHabitMore}
          />
        )}

        {/* Empty State */}
        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first habit to start building good routines
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.fabContainer}>
        <CreateButton
          label="New Habit"
          onPress={openCreateSheet}
          compact={isFabCompact}
        />
      </View>

      {/* Bottom Sheets */}

      {/* Header Options Modal */}
      <OptionsModal
        visible={showHeaderOptions}
        onClose={() => setShowHeaderOptions(false)}
        options={headerOptions}
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
        onSelectGoal={() => setShowGoalSelectionSheet(true)}
        onSelectCategory={() => setShowCategorySheet(true)}
        onSetReminder={() => setShowReminderSheet(true)}
        selectedRepeat={formRepeat}
        selectedStartDate={formStartDate}
        selectedGoal={selectedGoalId ? goals.find(g => g.id === selectedGoalId) : null}
        selectedCategory={formCategory}
        selectedReminder={formReminder}
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

      {/* Goal Selection Sheet */}
      <GoalSelectionSheet
        visible={showGoalSelectionSheet}
        onClose={() => setShowGoalSelectionSheet(false)}
        onSelectGoal={handleSelectGoal}
        onCreateGoal={handleCreateNewGoal}
        goals={goals}
        type="HABIT"
      />

      {/* Create Goal Sheet */}
      <CreateGoalSheet
        visible={showGoalCreateSheet}
        onClose={() => {
          setShowGoalCreateSheet(false);
          setGoalFormDate(null);
          setGoalFormCategory(null);
          setGoalFormLevels([]);
        }}
        onSubmit={handleSubmitGoal}
        onOpenDateSheet={() => setShowGoalDateSheet(true)}
        onOpenCategorySheet={() => setShowGoalCategorySheet(true)}
        onOpenLevelSheet={() => setShowGoalLevelSheet(true)}
        selectedDate={goalFormDate}
        selectedCategory={goalFormCategory}
        selectedLevels={goalFormLevels}
      />

      {/* Goal Form - Date Sheet */}
      <SelectDateSheet
        visible={showGoalDateSheet}
        onClose={() => setShowGoalDateSheet(false)}
        onSelectDate={(date) => {
          setGoalFormDate(date);
          setShowGoalDateSheet(false);
        }}
        selectedDate={goalFormDate}
      />

      {/* Goal Form - Category Sheet */}
      <AddCategorySheet
        visible={showGoalCategorySheet}
        onClose={() => setShowGoalCategorySheet(false)}
        onSelectCategory={(category) => {
          setGoalFormCategory(category);
          setShowGoalCategorySheet(false);
        }}
        selectedCategory={goalFormCategory}
        categories={categories}
      />

      {/* Goal Form - Level Sheet */}
      <AddLevelSheet
        visible={showGoalLevelSheet}
        onClose={() => setShowGoalLevelSheet(false)}
        onSelectLevels={(levels) => {
          setGoalFormLevels(levels);
          setShowGoalLevelSheet(false);
        }}
        selectedLevels={goalFormLevels}
      />

      {/* Add Category Sheet */}
      <AddCategorySheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelectCategory={handleCategorySelect}
        selectedCategory={formCategory}
        categories={categories}
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

      {/* Set Reminder Sheet */}
      <SetReminderSheet
        visible={showReminderSheet}
        onClose={() => setShowReminderSheet(false)}
        onSetReminder={handleSetReminder}
        onOpenCustomMinutes={handleOpenCustomMinutes}
        onOpenCustomHours={handleOpenCustomHours}
        selectedReminder={formReminder}
        customMinutes={customMinutes}
        customHours={customHours}
      />

      {/* Add Custom Minutes Sheet */}
      <AddCustomMinutesSheet
        visible={showCustomMinutesSheet}
        onClose={() => setShowCustomMinutesSheet(false)}
        onAddMinutes={handleAddCustomMinutes}
      />

      {/* Add Custom Hours Sheet */}
      <AddCustomHoursSheet
        visible={showCustomHoursSheet}
        onClose={() => setShowCustomHoursSheet(false)}
        onAddHours={handleAddCustomHours}
      />

      {/* Operation Loading Overlay */}
      {(isCreating || isDeleting || isCompleting) && (
        <View style={styles.operationOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.operationText}>
            {isCreating
              ? "Creating habit..."
              : isDeleting
              ? "Deleting habit..."
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    marginHorizontal: 20,
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

export default HabitListScreen;
