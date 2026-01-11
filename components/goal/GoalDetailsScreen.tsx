/**
 * Goal Details Screen
 * Displays goal information with tasks grouped by completion
 * Allows creating new levels (tasks) linked to the goal
 */

import { CreateButton } from "@/components/buttons/CreateButton";
import { ThreeDotIcon } from "@/components/icons/TaskIcons";
import { TaskCard } from "@/components/task/TaskCard";
import { HabitCard } from "@/components/habit/HabitCard";
import { Colors } from "@/constants/colors";
import { GoalDetail } from "@/types/goal";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../navigation";
import { GoalOptionsModal } from "./GoalOptionsModal";
import { ProgressBar } from "@/components/shared";

interface GoalDetailsScreenProps {
  goal: GoalDetail | null;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCreateLevel?: () => void;
  onRefresh?: () => void;
  onToggleTask?: (taskId: string) => void;
  onTaskPress?: (taskId: string) => void;
  onTaskMore?: (taskId: string) => void;
}

export function GoalDetailsScreen({
  goal,
  isLoading = false,
  isRefreshing = false,
  onBack,
  onEdit,
  onDelete,
  onCreateLevel,
  onRefresh,
  onToggleTask,
  onTaskPress,
  onTaskMore,
}: GoalDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  if (isLoading || !goal) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const progress = goal.progress || 0;

  // For TASK goals, show tasks. For HABIT goals, show habits
  const incompleteItems = goal.type === "HABIT"
    ? (goal.habitsGrouped?.incomplete || [])
    : (goal.tasksGrouped?.incomplete || []);
  const completedItems = goal.type === "HABIT"
    ? (goal.habitsGrouped?.completed || [])
    : (goal.tasksGrouped?.completed || []);

  // Dynamic labels based on goal type
  const itemLabel = goal.type === "HABIT" ? "Habit" : "Task";
  const itemsLabel = goal.type === "HABIT" ? "Habits" : "Tasks";
  const createButtonLabel = goal.type === "HABIT" ? "Create Habit" : "Create Task";

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={goal.title}
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowOptionsModal(true)}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <ThreeDotIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Goal Info Card */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>{goal.title}</Text>

          {goal.description && (
            <Text style={styles.goalDescription}>{goal.description}</Text>
          )}

          {/* Progress Section */}
          <ProgressBar
            progress={progress}
            label="Overall Progress"
            height={6}
            borderRadius={3}
            useGradient={false}
            progressColor={goal.isCompleted ? "#22C55E" : Colors.primary}
            labelStyle={styles.progressLabel}
            percentageStyle={styles.progressPercentage}
            containerStyle={styles.progressSection}
          />

          {/* Meta Info */}
          <View style={styles.metaRow}>
            {goal.category && (
              <View style={styles.metaItem}>
                <Feather name="tag" size={14} color="#8E8E93" />
                <Text style={styles.metaText}>{goal.category.name}</Text>
              </View>
            )}
            {goal.deadline && (
              <View style={styles.metaItem}>
                <Feather name="calendar" size={14} color="#8E8E93" />
                <Text style={styles.metaText}>
                  {new Date(goal.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>

          {/* Levels */}
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
        </View>

        {/* Incomplete Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Incomplete {itemsLabel}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{incompleteItems.length}</Text>
            </View>
          </View>

          {incompleteItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No incomplete {itemsLabel.toLowerCase()}. Create a {itemLabel.toLowerCase()} to get started!
              </Text>
            </View>
          ) : (
            goal.type === "HABIT" ? (
              incompleteItems.map((habit: any) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={habit.completed || false}
                  onPress={() => onTaskPress?.(habit.id)}
                  onToggle={() => onToggleTask?.(habit.id)}
                  onMore={() => onTaskMore?.(habit.id)}
                />
              ))
            ) : (
              incompleteItems.map((task: any) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => onTaskPress?.(task.id)}
                  onToggleComplete={() => onToggleTask?.(task.id)}
                  onMorePress={() => onTaskMore?.(task.id)}
                />
              ))
            )
          )}
        </View>

        {/* Completed Items Section */}
        {completedItems.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowCompleted(!showCompleted)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Completed {itemsLabel}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{completedItems.length}</Text>
              </View>
              <Feather
                name={showCompleted ? "chevron-up" : "chevron-down"}
                size={20}
                color="#8E8E93"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>

            {showCompleted && (
              goal.type === "HABIT" ? (
                completedItems.map((habit: any) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={habit.completed || false}
                    onPress={() => onTaskPress?.(habit.id)}
                    onToggle={() => onToggleTask?.(habit.id)}
                    onMore={() => onTaskMore?.(habit.id)}
                  />
                ))
              ) : (
                completedItems.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={() => onTaskPress?.(task.id)}
                    onToggleComplete={() => onToggleTask?.(task.id)}
                    onMorePress={() => onTaskMore?.(task.id)}
                  />
                ))
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Create Item FAB */}
      <View style={styles.fabContainer}>
        <CreateButton
          label={createButtonLabel}
          onPress={onCreateLevel || (() => {})}
          compact={false}
        />
      </View>

      {/* Goal Options Modal */}
      <GoalOptionsModal
        visible={showOptionsModal}
        goal={goal}
        onClose={() => setShowOptionsModal(false)}
        onEdit={() => {
          setShowOptionsModal(false);
          onEdit?.();
        }}
        onDuplicate={() => {
          setShowOptionsModal(false);
          // Handle duplicate
        }}
        onFocus={() => {
          setShowOptionsModal(false);
          // Handle focus
        }}
        onDelete={() => {
          setShowOptionsModal(false);
          onDelete?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    overflow: "visible",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  goalCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
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
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
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
  levelsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  countBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  emptyState: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
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
