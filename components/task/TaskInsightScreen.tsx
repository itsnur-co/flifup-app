/**
 * Task Insight Screen
 * Displays comprehensive task analytics with semi-circular progress,
 * stat cards, and weekly activity chart
 * 
 * Features:
 * - Semi-circular arc showing completed/in-progress/due ratio
 * - Stat cards for quick metrics
 * - Gradient weekly activity line chart
 * - Period filter dropdown
 * - New Task FAB button
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { Colors } from "@/constants/colors";
import {
  taskService,
  TaskReportsOverview,
  TaskWeeklyStats,
} from "@/services/api/task.service";

// Import reusable components
import { SemiCircularProgress } from "@/components/charts/SemiCircularProgress";
import { WeeklyActivityChart } from "@/components/charts/WeeklyActivityChart";
import { InsightStatCard } from "@/components/cards/InsightStatCard";
import { PeriodDropdown } from "@/components/ui/PeriodDropdown";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Back icon component
const BackIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Plus icon component
const PlusIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface TaskInsightScreenProps {
  visible: boolean;
  onClose: () => void;
  onNewTask?: () => void;
}

export const TaskInsightScreen: React.FC<TaskInsightScreenProps> = ({
  visible,
  onClose,
  onNewTask,
}) => {
  const insets = useSafeAreaInsets();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [reportsData, setReportsData] = useState<TaskReportsOverview | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<TaskWeeklyStats | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Thursday
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from reports data
  const stats = {
    completed: reportsData?.overview?.completedTasks ?? 0,
    inProgress: reportsData?.overview?.inProgressTasks ?? 0,
    due: weeklyStats?.week?.reduce((acc, day) => acc + (day.total - day.completed), 0) ?? 0,
    created: reportsData?.overview?.totalTasks ?? 0,
    total: reportsData?.overview?.totalTasks ?? 0,
  };

  // Format weekly data for chart
  const chartData = weeklyStats?.week?.map((day) => ({
    day: day.dayName.slice(0, 3),
    value: day.completed,
    date: day.date,
  })) ?? [
    { day: "Mon", value: 2 },
    { day: "Tues", value: 5 },
    { day: "Wed", value: 8 },
    { day: "Thurs", value: 21 },
    { day: "Fri", value: 15 },
    { day: "Sat", value: 18 },
    { day: "Sun", value: 12 },
  ];

  // Fetch reports data
  const fetchReportsData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);

      const [reportsRes, weeklyRes] = await Promise.all([
        taskService.getReportsOverview({ days: selectedPeriod }),
        taskService.getWeeklyStats(),
      ]);

      if (reportsRes.data) {
        setReportsData(reportsRes.data);
      }
      if (weeklyRes.data) {
        setWeeklyStats(weeklyRes.data);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError("Failed to load reports data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedPeriod]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchReportsData(false);
  }, [fetchReportsData]);

  // Initial fetch
  useEffect(() => {
    if (visible) {
      fetchReportsData();
    }
  }, [visible, selectedPeriod]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with gradient */}
      <LinearGradient
        colors={["#9039FF", "#6C2BBF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <BackIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Insight</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Period Selector */}
          <View style={styles.periodRow}>
            <PeriodDropdown
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </View>

          {/* Semi-circular Progress Chart */}
          <View style={styles.progressCard}>
            <SemiCircularProgress
              completed={stats.completed}
              inProgress={stats.inProgress}
              due={stats.due}
              total={stats.total || 1}
              size={275}
              strokeWidth={24}
            />
          </View>

          {/* Stat Cards Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <View style={styles.statCardWrapper}>
                <InsightStatCard
                  type="completed"
                  value={stats.completed}
                  label="Completed"
                  sublabel={`in the last ${selectedPeriod} days`}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <InsightStatCard
                  type="inProgress"
                  value={stats.inProgress}
                  label="In Progress"
                  sublabel={`in the last ${selectedPeriod} days`}
                />
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={styles.statCardWrapper}>
                <InsightStatCard
                  type="created"
                  value={stats.created}
                  label="created"
                  sublabel={`in the last ${selectedPeriod} days`}
                />
              </View>
              <View style={styles.statCardWrapper}>
                <InsightStatCard
                  type="due"
                  value={stats.due}
                  label="due"
                  sublabel={`in the last ${selectedPeriod} days`}
                />
              </View>
            </View>
          </View>

          {/* Weekly Activity Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weekly Activity</Text>
            <WeeklyActivityChart
              data={chartData}
              selectedDayIndex={selectedDayIndex}
              onDaySelect={setSelectedDayIndex}
              height={250}
            />
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchReportsData()}
                activeOpacity={0.7}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* New Task FAB */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={onNewTask}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#9039FF", "#6594FF", "#2DFDFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <PlusIcon size={20} color="#FFFFFF" />
            <Text style={styles.fabText}>New Task</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  periodRow: {
    marginBottom: 8,
  },
  progressCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCardWrapper: {
    flex: 1,
  },
  chartCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    alignItems: "flex-end",
  },
  fabButton: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#9039FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  fabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default TaskInsightScreen;
