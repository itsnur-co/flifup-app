/**
 * Journal Insights Screen
 * Displays mood trends and statistics over time
 * Integrated with API services
 */

import React, { useEffect, useMemo, useState } from "react";
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
import Svg, { Line, Path, Circle as SvgCircle } from "react-native-svg";

import { ScreenHeader } from "@/components/navigation/screen-header";
import { CreateButton } from "@/components/buttons";
import { ChevronDownIcon } from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/colors";
import { useJournals } from "@/hooks/useJournals";
import {
  DailyMood,
  MoodType,
  MOOD_OPTIONS,
  getMoodEmoji,
} from "@/types/journal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_PADDING = 20;
const CHART_WIDTH = SCREEN_WIDTH - 40 - (CHART_PADDING * 2) - 40; // Extra 40 for emoji axis
const CHART_HEIGHT = 200;

// Period options
type PeriodType = "7days" | "30days" | "90days";
const PERIOD_OPTIONS: { value: PeriodType; label: string; days: number }[] = [
  { value: "7days", label: "Last 7 days", days: 7 },
  { value: "30days", label: "Last 30 days", days: 30 },
  { value: "90days", label: "Last 90 days", days: 90 },
];

const getMoodValue = (mood: MoodType): number => {
  const values: Record<MoodType, number> = {
    VERY_HAPPY: 5,
    HAPPY: 4,
    NEUTRAL: 3,
    SAD: 2,
    VERY_SAD: 1,
  };
  return values[mood];
};

interface JournalInsightsScreenProps {
  onBack?: () => void;
  onCreateJournal?: () => void;
}

export const JournalInsightsScreen: React.FC<JournalInsightsScreenProps> = ({
  onBack,
  onCreateJournal,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("7days");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API Hook
  const {
    insights,
    statistics,
    isFetchingInsights,
    error,
    fetchInsights,
    fetchStatistics,
  } = useJournals({ autoFetch: false });

  // Fetch data on mount and when period changes
  useEffect(() => {
    const days = PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.days || 7;
    fetchInsights(days);
    fetchStatistics();
  }, [selectedPeriod]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const days = PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.days || 7;
    await Promise.all([fetchInsights(days), fetchStatistics()]);
    setIsRefreshing(false);
  };

  // Process daily moods data
  const dataPoints = useMemo(() => {
    if (!insights?.dailyMoods) return [];
    return insights.dailyMoods.filter((d) => d.moodValue !== null);
  }, [insights]);

  // Generate SVG path for the line chart
  const generatePath = () => {
    if (dataPoints.length < 2) return "";

    const xStep = CHART_WIDTH / Math.max(dataPoints.length - 1, 1);
    const yStep = CHART_HEIGHT / 4; // 5 mood levels = 4 steps

    let path = "";
    dataPoints.forEach((point, index) => {
      const x = index * xStep;
      const y = CHART_HEIGHT - ((point.moodValue! - 1) * yStep);

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  // Get circle positions for data points
  const getCirclePositions = () => {
    if (dataPoints.length < 1) return [];

    const xStep = CHART_WIDTH / Math.max(dataPoints.length - 1, 1);
    const yStep = CHART_HEIGHT / 4;

    return dataPoints.map((point, index) => ({
      x: index * xStep,
      y: CHART_HEIGHT - ((point.moodValue! - 1) * yStep),
    }));
  };

  // Get most frequent mood
  const getMostFrequentMood = (): MoodType | null => {
    if (!insights?.moodDistribution) return null;

    let maxCount = 0;
    let mostFrequent: MoodType | null = null;

    (Object.keys(insights.moodDistribution) as MoodType[]).forEach((mood) => {
      const count = insights.moodDistribution[mood];
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = mood;
      }
    });

    return mostFrequent;
  };

  const selectedPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label || "";

  // Mood emojis for Y-axis (top to bottom: happy to sad)
  const moodEmojis = [
    getMoodEmoji("VERY_HAPPY"),
    getMoodEmoji("HAPPY"),
    getMoodEmoji("NEUTRAL"),
    getMoodEmoji("SAD"),
    getMoodEmoji("VERY_SAD"),
  ];

  // Loading state
  if (isFetchingInsights && !insights) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Journal Insight" onBack={onBack} hideBackButton={!onBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Journal Insight"
        onBack={onBack}
        hideBackButton={!onBack}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <TouchableOpacity
            style={styles.periodSelector}
            onPress={() => setShowPeriodDropdown(!showPeriodDropdown)}
            activeOpacity={0.7}
          >
            <Text style={styles.periodText}>{selectedPeriodLabel}</Text>
            <ChevronDownIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Period Dropdown */}
          {showPeriodDropdown && (
            <View style={styles.periodDropdown}>
              {PERIOD_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.periodOption,
                    selectedPeriod === option.value &&
                      styles.periodOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedPeriod(option.value);
                    setShowPeriodDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodOptionText,
                      selectedPeriod === option.value &&
                        styles.periodOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Mood Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Mood over time</Text>

          {dataPoints.length > 0 ? (
            <View style={styles.chartContainer}>
              {/* Y-Axis Emojis */}
              <View style={styles.yAxis}>
                {moodEmojis.map((emoji, index) => (
                  <View key={index} style={styles.emojiRow}>
                    <Text style={styles.emoji}>{emoji}</Text>
                  </View>
                ))}
              </View>

              {/* Chart Area */}
              <View style={styles.chartArea}>
                <Svg
                  width={CHART_WIDTH}
                  height={CHART_HEIGHT}
                  style={styles.svg}
                >
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Line
                      key={index}
                      x1={0}
                      y1={(index * CHART_HEIGHT) / 4}
                      x2={CHART_WIDTH}
                      y2={(index * CHART_HEIGHT) / 4}
                      stroke="#3A3A3C"
                      strokeWidth={1}
                      strokeDasharray="4,4"
                    />
                  ))}

                  {/* Line Path */}
                  {dataPoints.length >= 2 && (
                    <Path
                      d={generatePath()}
                      stroke={Colors.primary}
                      strokeWidth={2}
                      fill="none"
                    />
                  )}

                  {/* Data Points */}
                  {getCirclePositions().map((pos, index) => (
                    <SvgCircle
                      key={index}
                      cx={pos.x}
                      cy={pos.y}
                      r={4}
                      fill={Colors.primary}
                      stroke="#1C1C1E"
                      strokeWidth={2}
                    />
                  ))}
                </Svg>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No mood data available</Text>
              <Text style={styles.noDataSubtext}>
                Start adding journals with mood to see your trends
              </Text>
            </View>
          )}
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {insights?.overall.totalJournals || statistics?.total || 0}
            </Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {insights?.overall.avgMoodValue
                ? insights.overall.avgMoodValue.toFixed(1)
                : "0"}
            </Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>
              {getMostFrequentMood()
                ? getMoodEmoji(getMostFrequentMood()!)
                : "😐"}
            </Text>
            <Text style={styles.statLabel}>Most Common</Text>
          </View>
        </View>

        {/* Quick Stats */}
        {statistics && (
          <View style={styles.quickStatsCard}>
            <Text style={styles.quickStatsTitle}>Quick Stats</Text>
            <View style={styles.quickStatsRow}>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{statistics.thisWeek}</Text>
                <Text style={styles.quickStatLabel}>This Week</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{statistics.thisMonth}</Text>
                <Text style={styles.quickStatLabel}>This Month</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{statistics.total}</Text>
                <Text style={styles.quickStatLabel}>Total</Text>
              </View>
            </View>
          </View>
        )}

        {/* Mood Distribution */}
        {insights?.moodDistribution && (
          <View style={styles.distributionCard}>
            <Text style={styles.distributionTitle}>Mood Distribution</Text>
            {MOOD_OPTIONS.map((option) => {
              const count = insights.moodDistribution[option.value] || 0;
              const total = insights.overall.journalsWithMood || 1;
              const percentage = (count / total) * 100;

              return (
                <View key={option.value} style={styles.distributionRow}>
                  <Text style={styles.distributionEmoji}>{option.emoji}</Text>
                  <View style={styles.distributionBarContainer}>
                    <View
                      style={[
                        styles.distributionBar,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.distributionCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.fabContainer}>
        <CreateButton label="New Journal" onPress={onCreateJournal} />
      </View>
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
    paddingTop: 16,
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
  periodContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  periodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  periodDropdown: {
    position: "absolute",
    top: 36,
    left: 0,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  periodOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  periodOptionSelected: {
    backgroundColor: "#3A3A3C",
  },
  periodOptionText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  periodOptionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  errorContainer: {
    marginBottom: 16,
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
  chartCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: CHART_PADDING,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  yAxis: {
    width: 40,
    height: CHART_HEIGHT,
    justifyContent: "space-between",
    paddingRight: 8,
  },
  emojiRow: {
    height: CHART_HEIGHT / 5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  emoji: {
    fontSize: 20,
  },
  chartArea: {
    flex: 1,
    height: CHART_HEIGHT,
  },
  svg: {
    backgroundColor: "transparent",
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  quickStatsCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  quickStatsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  quickStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#3A3A3C",
  },
  distributionCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  distributionEmoji: {
    fontSize: 20,
    width: 28,
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#3A3A3C",
    borderRadius: 4,
    overflow: "hidden",
  },
  distributionBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    width: 24,
    textAlign: "right",
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

export default JournalInsightsScreen;
