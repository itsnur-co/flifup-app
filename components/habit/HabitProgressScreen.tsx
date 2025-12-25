/**
 * Habit Progress Screen
 * Shows overall or individual habit progress with chart
 */

import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CreateButton } from "@/components/buttons";
import { ChevronDownIcon } from "@/components/icons/TaskIcons";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { CategoryFilter } from "./CategoryFilter";
import { ProgressChart } from "./ProgressChart";

import {
  MOCK_HABITS,
  MOCK_HABIT_CATEGORIES,
  MOCK_HABIT_STATS,
  MOCK_SINGLE_HABIT_STATS,
  getCategoryFilterCounts,
} from "@/constants/habitMockData";
import { Habit, HabitStats } from "@/types/habit";

interface HabitProgressScreenProps {
  habit?: Habit; // If provided, show single habit progress; otherwise overall
  onBack?: () => void;
  onCreateHabit?: () => void;
}

type TimeRange = "Last 7 days" | "Last 30 days" | "Last 3 months" | "All time";

export const HabitProgressScreen: React.FC<HabitProgressScreenProps> = ({
  habit,
  onBack,
  onCreateHabit,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange>("Last 7 days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const isOverallProgress = !habit;
  const title = isOverallProgress ? "Overall Progress" : habit.name;

  const stats: HabitStats = isOverallProgress
    ? MOCK_HABIT_STATS
    : MOCK_SINGLE_HABIT_STATS;

  // Category filter data (only for overall progress)
  const categoryFilters = useMemo(() => {
    if (!isOverallProgress) return [];

    const counts = getCategoryFilterCounts(MOCK_HABITS);
    const filters = [{ id: "all", name: "All Habits", count: counts.all || 0 }];

    MOCK_HABIT_CATEGORIES.forEach((cat) => {
      if (counts[cat.name]) {
        filters.push({ id: cat.id, name: cat.name, count: counts[cat.name] });
      }
    });

    return filters;
  }, [isOverallProgress]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={title}
        onBack={onBack}
        hideBackButton={!onBack}
        rightIcon="more-horizontal"
        onRightPress={() => console.log("Options")}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Selector */}
        <TouchableOpacity style={styles.timeRangeSelector} activeOpacity={0.7}>
          <Text style={styles.timeRangeText}>{selectedTimeRange}</Text>
          <ChevronDownIcon size={16} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Category Filter (only for overall progress) */}
        {isOverallProgress && (
          <CategoryFilter
            categories={categoryFilters}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={() => console.log("Add category")}
          />
        )}

        {/* Progress Chart */}
        <View style={styles.chartSection}>
          <ProgressChart
            data={stats.weeklyData}
            completionRate={stats.completionRate}
            title="AVG Completion Rate"
          />
        </View>
      </ScrollView>

      {/* Create Button */}
      <CreateButton label="New Habit" onPress={onCreateHabit} />
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
    paddingTop: 16,
  },
  timeRangeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  timeRangeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  chartSection: {
    marginTop: 16,
  },
});

export default HabitProgressScreen;
