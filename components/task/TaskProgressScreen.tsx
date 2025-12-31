/**
 * Task Progress/Reports Screen Component
 * Shows comprehensive task analytics and productivity reports
 * API integrated with real-time data
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
import Svg, { Circle, Line, Path, Rect, G, Text as SvgText } from "react-native-svg";
import {
  BackIcon,
  ChartIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  FocusIcon,
  TargetIcon,
  TrophyIcon,
} from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/colors";
import {
  taskService,
  TaskReportsOverview,
  ProductivityScore,
  TaskWeeklyStats,
} from "@/services/api/task.service";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 40;
const CHART_HEIGHT = 180;

interface TaskProgressScreenProps {
  visible: boolean;
  onClose: () => void;
}

type PeriodType = "7" | "30" | "90";

export const TaskProgressScreen: React.FC<TaskProgressScreenProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("30");
  const [reportsData, setReportsData] = useState<TaskReportsOverview | null>(null);
  const [productivityScore, setProductivityScore] = useState<ProductivityScore | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<TaskWeeklyStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports data
  const fetchReportsData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);

      const [reportsRes, productivityRes, weeklyRes] = await Promise.all([
        taskService.getReportsOverview({ days: parseInt(selectedPeriod) }),
        taskService.getProductivityScore(),
        taskService.getWeeklyStats(),
      ]);

      if (reportsRes.data) {
        setReportsData(reportsRes.data);
      }
      if (productivityRes.data) {
        setProductivityScore(productivityRes.data);
      }
      if (weeklyRes.data) {
        setWeeklyStats(weeklyRes.data);
      }
    } catch (err) {
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

  // Period change handler
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  // Initial fetch
  useEffect(() => {
    if (visible) {
      fetchReportsData();
    }
  }, [visible, selectedPeriod]);

  // Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "#10B981"; // Green
    if (score >= 60) return "#F59E0B"; // Yellow
    if (score >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  // Render weekly chart
  const renderWeeklyChart = () => {
    if (!weeklyStats?.week || weeklyStats.week.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      );
    }

    const maxValue = Math.max(...weeklyStats.week.map(d => d.total), 1);
    const barWidth = (CHART_WIDTH - 60) / 7;
    const barSpacing = 8;

    return (
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <Line
            key={index}
            x1={40}
            y1={20 + (CHART_HEIGHT - 60) * ratio}
            x2={CHART_WIDTH - 10}
            y2={20 + (CHART_HEIGHT - 60) * ratio}
            stroke="#2C2C2E"
            strokeWidth={1}
          />
        ))}

        {/* Bars */}
        {weeklyStats.week.map((day, index) => {
          const barHeight = (day.total / maxValue) * (CHART_HEIGHT - 60);
          const completedHeight = (day.completed / maxValue) * (CHART_HEIGHT - 60);
          const x = 50 + index * (barWidth + barSpacing);
          const y = CHART_HEIGHT - 40 - barHeight;

          return (
            <G key={index}>
              {/* Total bar (background) */}
              <Rect
                x={x}
                y={y}
                width={barWidth - barSpacing}
                height={barHeight}
                fill="#3A3A3C"
                rx={4}
              />
              {/* Completed bar (foreground) */}
              <Rect
                x={x}
                y={CHART_HEIGHT - 40 - completedHeight}
                width={barWidth - barSpacing}
                height={completedHeight}
                fill={Colors.primary}
                rx={4}
              />
              {/* Day label */}
              <SvgText
                x={x + (barWidth - barSpacing) / 2}
                y={CHART_HEIGHT - 15}
                fontSize={11}
                fill="#8E8E93"
                textAnchor="middle"
              >
                {day.dayName.slice(0, 3)}
              </SvgText>
            </G>
          );
        })}

        {/* Y-axis labels */}
        <SvgText x={10} y={25} fontSize={10} fill="#6B7280">{maxValue}</SvgText>
        <SvgText x={10} y={CHART_HEIGHT - 45} fontSize={10} fill="#6B7280">0</SvgText>
      </Svg>
    );
  };

  // Render productivity score circle
  const renderScoreCircle = () => {
    if (!productivityScore) return null;

    const score = productivityScore.score;
    const scoreColor = getScoreColor(score);
    const circumference = 2 * Math.PI * 45;
    const progress = (score / 100) * circumference;

    return (
      <Svg width={120} height={120}>
        {/* Background circle */}
        <Circle
          cx={60}
          cy={60}
          r={45}
          stroke="#2C2C2E"
          strokeWidth={10}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={60}
          cy={60}
          r={45}
          stroke={scoreColor}
          strokeWidth={10}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        {/* Score text */}
        <SvgText
          x={60}
          y={55}
          fontSize={28}
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          {score}
        </SvgText>
        <SvgText
          x={60}
          y={75}
          fontSize={12}
          fill="#8E8E93"
          textAnchor="middle"
        >
          Score
        </SvgText>
      </Svg>
    );
  };

  if (!visible) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <BackIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Progress</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: insets.bottom + 20 },
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
          <View style={styles.periodSelector}>
            {(["7", "30", "90"] as PeriodType[]).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => handlePeriodChange(period)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextActive,
                  ]}
                >
                  {period}D
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Productivity Score Card */}
          {productivityScore && (
            <View style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <TrophyIcon size={20} color="#F59E0B" />
                <Text style={styles.scoreTitle}>Productivity Score</Text>
              </View>
              <View style={styles.scoreContent}>
                {renderScoreCircle()}
                <View style={styles.scoreBreakdown}>
                  <View style={styles.breakdownItem}>
                    <CheckIcon size={16} color="#10B981" />
                    <Text style={styles.breakdownLabel}>Tasks</Text>
                    <Text style={styles.breakdownValue}>
                      {productivityScore.breakdown.tasksCompleted}
                    </Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <FocusIcon size={16} color={Colors.primary} />
                    <Text style={styles.breakdownLabel}>Focus</Text>
                    <Text style={styles.breakdownValue}>
                      {productivityScore.breakdown.focusSessions}
                    </Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <ClockIcon size={16} color="#3B82F6" />
                    <Text style={styles.breakdownLabel}>Time</Text>
                    <Text style={styles.breakdownValue}>
                      {productivityScore.breakdown.totalFocusTimeFormatted}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Insights */}
              {productivityScore.insights.length > 0 && (
                <View style={styles.insightsContainer}>
                  {productivityScore.insights.map((insight, index) => (
                    <Text key={index} style={styles.insightText}>
                      {insight}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Overview Stats */}
          {reportsData && (
            <View style={styles.overviewCard}>
              <Text style={styles.cardTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#9039FF20" }]}>
                    <TargetIcon size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.statValue}>{reportsData.overview.totalTasks}</Text>
                  <Text style={styles.statLabel}>Total Tasks</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#10B98120" }]}>
                    <CheckIcon size={20} color="#10B981" />
                  </View>
                  <Text style={styles.statValue}>{reportsData.overview.completedTasks}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#F59E0B20" }]}>
                    <FlameIcon size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.statValue}>{reportsData.overview.completionRate}%</Text>
                  <Text style={styles.statLabel}>Rate</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#3B82F620" }]}>
                    <FocusIcon size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.statValue}>{reportsData.focus.totalSessions}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
              </View>
            </View>
          )}

          {/* Weekly Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <ChartIcon size={20} color={Colors.primary} />
              <Text style={styles.cardTitle}>Weekly Activity</Text>
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#3A3A3C" }]} />
                <Text style={styles.legendText}>Total</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.legendText}>Completed</Text>
              </View>
            </View>
            {renderWeeklyChart()}
          </View>

          {/* Focus Time Stats */}
          {reportsData && (
            <View style={styles.focusCard}>
              <Text style={styles.cardTitle}>Focus Time</Text>
              <View style={styles.focusStats}>
                <View style={styles.focusStatItem}>
                  <Text style={styles.focusStatValue}>
                    {reportsData.focus.totalFocusTimeFormatted}
                  </Text>
                  <Text style={styles.focusStatLabel}>Total Focus</Text>
                </View>
                <View style={styles.focusDivider} />
                <View style={styles.focusStatItem}>
                  <Text style={styles.focusStatValue}>
                    {reportsData.focus.avgFocusPerSessionFormatted}
                  </Text>
                  <Text style={styles.focusStatLabel}>Avg/Session</Text>
                </View>
              </View>
            </View>
          )}

          {/* By Priority */}
          {reportsData && reportsData.byPriority.length > 0 && (
            <View style={styles.priorityCard}>
              <Text style={styles.cardTitle}>By Priority</Text>
              <View style={styles.priorityList}>
                {reportsData.byPriority.map((item, index) => (
                  <View key={index} style={styles.priorityItem}>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            item.priority === "HIGH"
                              ? "#EF444420"
                              : item.priority === "MEDIUM"
                              ? "#F59E0B20"
                              : "#10B98120",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityBadgeText,
                          {
                            color:
                              item.priority === "HIGH"
                                ? "#EF4444"
                                : item.priority === "MEDIUM"
                                ? "#F59E0B"
                                : "#10B981",
                          },
                        ]}
                      >
                        {item.priority}
                      </Text>
                    </View>
                    <View style={styles.priorityBar}>
                      <View
                        style={[
                          styles.priorityBarFill,
                          {
                            width: `${(item.count / (reportsData.overview.totalTasks || 1)) * 100}%`,
                            backgroundColor:
                              item.priority === "HIGH"
                                ? "#EF4444"
                                : item.priority === "MEDIUM"
                                ? "#F59E0B"
                                : "#10B981",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.priorityCount}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
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
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  periodTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scoreCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scoreContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  scoreBreakdown: {
    flex: 1,
    gap: 12,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 14,
    color: "#8E8E93",
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  insightsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
    gap: 8,
  },
  insightText: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  overviewCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "47%",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  chartCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  chartLegend: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  emptyChart: {
    height: CHART_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  focusCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  focusStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  focusStatItem: {
    flex: 1,
    alignItems: "center",
  },
  focusStatValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  focusStatLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  focusDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#3A3A3C",
  },
  priorityCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priorityList: {
    gap: 12,
  },
  priorityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  priorityBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#1C1C1E",
    borderRadius: 4,
    overflow: "hidden",
  },
  priorityBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  priorityCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    minWidth: 30,
    textAlign: "right",
  },
  errorContainer: {
    backgroundColor: "#EF444420",
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
});

export default TaskProgressScreen;
