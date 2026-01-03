/**
 * Goal Card Component
 * Displays individual goal in the goal list
 * Shows progress, task count, category, levels, and deadline
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Goal, formatGoalDeadline, isGoalOverdue } from "@/types/goal";
import {
  CalendarLineIcon,
  MoreHorizontalIcon,
  PriceTagLineIcon,
} from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
  onMorePress?: () => void;
  style?: ViewStyle;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPress,
  onMorePress,
  style,
}) => {
  const progress = goal.progress || 0;
  const taskCount = goal._count?.tasks || 0;
  const completedCount = goal.taskCounts?.completed || 0;
  const isOverdue = isGoalOverdue(goal);
  const deadlineText = formatGoalDeadline(goal);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, goal.isCompleted && styles.containerCompleted, style]}
    >
      {/* Header Row: Title and More Button */}
      <View style={styles.headerRow}>
        <Text
          style={[styles.title, goal.isCompleted && styles.titleCompleted]}
          numberOfLines={1}
        >
          {goal.title}
        </Text>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onMorePress?.();
          }}
          style={styles.moreButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreHorizontalIcon size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Overall Progress</Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress}%`,
                backgroundColor: goal.isCompleted
                  ? "#22C55E"
                  : Colors.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Meta Info Row */}
      <View style={styles.metaRow}>
        {/* Task Count */}
        {taskCount > 0 && (
          <View style={styles.metaItem}>
            <Feather name="check-square" size={14} color="#8E8E93" />
            <Text style={styles.metaText}>
              {completedCount}/{taskCount}
            </Text>
          </View>
        )}

        {/* Category */}
        {goal.category && (
          <View style={styles.metaItem}>
            <PriceTagLineIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{goal.category.name}</Text>
          </View>
        )}

        {/* Deadline */}
        {deadlineText && (
          <View style={styles.metaItem}>
            <CalendarLineIcon
              size={14}
              color={isOverdue ? "#EF4444" : "#8E8E93"}
            />
            <Text
              style={[
                styles.metaText,
                isOverdue && styles.overdueText,
              ]}
            >
              {deadlineText}
            </Text>
          </View>
        )}
      </View>

      {/* Levels Row */}
      {goal.levels && goal.levels.length > 0 && (
        <View style={styles.levelsRow}>
          <Feather name="flag" size={14} color="#8E8E93" />
          <View style={styles.levelBadges}>
            {goal.levels.map((level, index) => (
              <View key={index} style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{level}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  containerCompleted: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  titleCompleted: {
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  moreButton: {
    padding: 4,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#3A3A3C",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  overdueText: {
    color: "#EF4444",
  },
  levelsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  levelBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
  },
});
