/**
 * Goal Selection Sheet
 * Reusable component for selecting or creating a goal
 * Used in Habit and Task creation flows
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import type { Goal, GoalType } from "@/types/goal";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface GoalSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectGoal: (goal: Goal) => void;
  onCreateGoal: () => void;
  goals: Goal[];
  type: GoalType; // Filter by TASK or HABIT
  isLoading?: boolean;
  title?: string;
}

export const GoalSelectionSheet: React.FC<GoalSelectionSheetProps> = ({
  visible,
  onClose,
  onSelectGoal,
  onCreateGoal,
  goals,
  type,
  isLoading = false,
  title,
}) => {
  // Filter goals by type
  const filteredGoals = goals.filter((goal) => goal.type === type);

  const displayTitle = title || `Select ${type === "HABIT" ? "Habit" : "Task"} Goal`;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.7, 0.9]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{displayTitle}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading goals...</Text>
            </View>
          ) : filteredGoals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="target" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Goals Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create a {type === "HABIT" ? "habit" : "task"} goal to track your progress
              </Text>
            </View>
          ) : (
            <View style={styles.goalsContainer}>
              {filteredGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => onSelectGoal(goal)}
                  activeOpacity={0.7}
                >
                  <View style={styles.goalCardHeader}>
                    <View style={styles.goalIcon}>
                      <Text style={styles.goalIconText}>{goal.icon || "🎯"}</Text>
                    </View>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      {goal.description && (
                        <Text style={styles.goalDescription} numberOfLines={2}>
                          {goal.description}
                        </Text>
                      )}
                    </View>
                    <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
                  </View>

                  {/* Progress indicator */}
                  {goal._count && (
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>
                        {type === "HABIT"
                          ? `${goal._count.habits || 0} habits`
                          : `${goal._count.tasks || 0} tasks`}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Create New Goal Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateGoal}
            activeOpacity={0.7}
          >
            <Feather name="plus-circle" size={24} color={Colors.primary} />
            <Text style={styles.createButtonText}>Create New Goal</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  goalCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  goalIconText: {
    fontSize: 20,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
});
