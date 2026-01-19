/**
 * Task Details Screen Component
 * Displays task details with sub-tasks list
 * Uses API Task type for data
 */

import {
  AlarmLineIcon,
  AlignLeftIcon,
  CalendarLineIcon,
  ChevronDownIcon,
  FlagIcon,
  UserAddLineIcon,
  PriceTagLineIcon,
  TimeLineIcon,
  DotIcon,
  ClockIcon,
} from "@/components/icons/TaskIcons";
import { ScreenHeader } from "@/components/navigation";
import { AvatarGroup } from "@/components/ui/Avatar";
import { CreateButton } from "@/components/buttons";
import { CompletionCheckbox } from "@/components/shared";
import { Colors } from "@/constants/colors";
import { Task, TaskDetail, TaskSubtask, collaboratorToPerson } from "@/types/task";
import { formatDetailDate, formatTime, formatReminder } from "@/utils/dateTime";
import React, { useState, useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TaskEditModal } from ".";

interface TaskDetailsScreenProps {
  task: Task | TaskDetail;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleSubTask?: (subTaskId: string) => void;
  onAddSubTask?: () => void;
  onSubTaskOptions?: (subTask: TaskSubtask) => void;
  isLoading?: boolean;
}

// Type guard to check if task is TaskDetail
const isTaskDetail = (task: Task | TaskDetail): task is TaskDetail => {
  return "subtasksGrouped" in task && "subtaskCounts" in task;
};

interface InfoRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, children }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoRowIcon}>{icon}</View>
    <View style={styles.infoRowContent}>{children}</View>
  </View>
);

interface SubTaskSectionProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  subTasks: TaskSubtask[];
  onToggleComplete: (id: string) => void;
  onOptions: (subTask: TaskSubtask) => void;
}

const SubTaskSection: React.FC<SubTaskSectionProps> = ({
  title,
  count,
  isExpanded,
  onToggle,
  subTasks,
  onToggleComplete,
  onOptions,
}) => (
  <View style={styles.subTaskSection}>
    <TouchableOpacity
      style={styles.subTaskSectionHeader}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.chevronContainer,
          isExpanded && styles.chevronContainerExpanded,
        ]}
      >
        <ChevronDownIcon size={18} color="#FFFFFF" />
      </View>
      <Text style={styles.subTaskSectionTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countBadgeText}>{count}</Text>
      </View>
    </TouchableOpacity>

    {isExpanded && (
      <View style={styles.subTaskList}>
        {subTasks.map((subTask) => (
          <View key={subTask.id} style={styles.subTaskItem}>
            <CompletionCheckbox
              isCompleted={subTask.isCompleted}
              onToggle={() => onToggleComplete(subTask.id)}
              size={24}
              uncompletedColor="#5A5A5E"
              style={styles.subTaskCheckbox}
            />
            <Text
              style={[
                styles.subTaskTitle,
                subTask.isCompleted && styles.subTaskTitleCompleted,
              ]}
            >
              {subTask.title}
            </Text>
            <TouchableOpacity
              style={styles.subTaskOptions}
              onPress={() => onOptions(subTask)}
              activeOpacity={0.7}
            >
              <DotIcon size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}
  </View>
);

export const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({
  task,
  onBack,
  onEdit,
  onDelete,
  onToggleSubTask,
  onAddSubTask,
  onSubTaskOptions,
  isLoading = false,
}) => {
  const insets = useSafeAreaInsets();
  const [showEditModal, setShowEditModal] = useState(false);
  const [incompleteExpanded, setIncompleteExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);

  // Compute subtask groups - use pre-computed if available (TaskDetail)
  const { incompleteSubTasks, completedSubTasks, completedCount } = useMemo(() => {
    if (isTaskDetail(task)) {
      // Use pre-computed groups from TaskDetail
      return {
        incompleteSubTasks: task.subtasksGrouped.incomplete,
        completedSubTasks: task.subtasksGrouped.completed,
        completedCount: task.subtaskCounts.completed,
      };
    }
    // Fallback: compute locally from subtasks
    const subtasks = task.subtasks || [];
    const incomplete = subtasks.filter((st) => !st.isCompleted);
    const completed = subtasks.filter((st) => st.isCompleted);
    return {
      incompleteSubTasks: incomplete,
      completedSubTasks: completed,
      completedCount: completed.length,
    };
  }, [task]);

  // Convert collaborators to persons for avatar display
  const assignedPeople = useMemo(() => {
    if (!task.collaborators) return [];
    return task.collaborators.map(collaboratorToPerson);
  }, [task.collaborators]);

  const handleToggleSubTask = useCallback(
    (id: string) => {
      onToggleSubTask?.(id);
    },
    [onToggleSubTask]
  );

  const handleSubTaskOptions = useCallback(
    (subTask: TaskSubtask) => {
      onSubTaskOptions?.(subTask);
    },
    [onSubTaskOptions]
  );

  // Format reminder display
  const formatReminderDisplay = useCallback((): string => {
    if (!task.reminders || task.reminders.length === 0) {
      return "No reminder";
    }
    const reminder = task.reminders[0];
    return formatReminder(reminder.value, reminder.unit);
  }, [task.reminders]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <ScreenHeader
        title={task.title}
        subtitle={`${completedCount}/${task.subtasks?.length || 0} Sub Tasks`}
        onBack={onBack}
        rightIcon="more-horizontal"
        onRightPress={() => setShowEditModal(true)}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Info Section */}
        <View style={styles.infoSection}>

          {/* Date */}
          <InfoRow icon={<CalendarLineIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>
              {formatDetailDate(task.dueDate)}
            </Text>
          </InfoRow>

          {/* Time */}
          <InfoRow icon={<ClockIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>
              {formatTime(task.dueTime) || "No time set"}
            </Text>
          </InfoRow>

          {/* Category */}
          <InfoRow icon={<PriceTagLineIcon size={22} color={Colors.primary} />}>
            <View style={styles.categoryRow}>
              {task.category?.icon && (
                <Text style={styles.categoryIcon}>{task.category.icon}</Text>
              )}
              <Text style={styles.infoValue}>
                {task.category?.name || "No category"}
              </Text>
            </View>
          </InfoRow>

          {/* People */}
          <InfoRow icon={<UserAddLineIcon size={22} color={Colors.primary} />}>
            {assignedPeople.length > 0 ? (
              <AvatarGroup
                avatars={assignedPeople.map((p) => ({
                  uri: p.avatar,
                  name: p.name,
                }))}
                max={4}
                size={32}
                overlap={8}
              />
            ) : (
              <Text style={styles.infoPlaceholder}>No people assigned</Text>
            )}
          </InfoRow>

          {/* Reminder */}
          <InfoRow icon={<AlarmLineIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>{formatReminderDisplay()}</Text>
          </InfoRow>

          {/* Priority Badge */}
          <InfoRow icon={<FlagIcon size={22} color={Colors.primary} />}>
            <Text style={[styles.infoValue, styles.priorityText]}>
              Priority: {task.priority}
            </Text>
          </InfoRow>

          {/* Status */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                task.status === "COMPLETED" && styles.statusBadgeCompleted,
                task.status === "IN_PROGRESS" && styles.statusBadgeInProgress,
              ]}
            >
              <Text style={styles.statusBadgeText}>{task.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Sub-tasks Section */}
        <View style={styles.subTasksContainer}>
          {/* Incomplete Sub-tasks */}
          {incompleteSubTasks.length > 0 && (
            <SubTaskSection
              title="Incomplete"
              count={incompleteSubTasks.length}
              isExpanded={incompleteExpanded}
              onToggle={() => setIncompleteExpanded(!incompleteExpanded)}
              subTasks={incompleteSubTasks}
              onToggleComplete={handleToggleSubTask}
              onOptions={handleSubTaskOptions}
            />
          )}

          {/* Completed Sub-tasks */}
          {completedSubTasks.length > 0 && (
            <SubTaskSection
              title="Completed"
              count={completedSubTasks.length}
              isExpanded={completedExpanded}
              onToggle={() => setCompletedExpanded(!completedExpanded)}
              subTasks={completedSubTasks}
              onToggleComplete={handleToggleSubTask}
              onOptions={handleSubTaskOptions}
            />
          )}

          {/* Empty State */}
          {task.subtasks?.length === 0 && (
            <View style={styles.emptySubtasks}>
              <Text style={styles.emptySubtasksText}>No subtasks yet</Text>
              <Text style={styles.emptySubtasksSubtext}>
                Add subtasks to break down this task
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Sub-task FAB */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 32 }]}>
        <CreateButton
          label="New Sub-Task"
          onPress={onAddSubTask || (() => {})}
        />
      </View>

      {/* Edit Modal */}
      <TaskEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={() => {
          setShowEditModal(false);
          onEdit?.();
        }}
        onDelete={() => {
          setShowEditModal(false);
          onDelete?.();
        }}
        canDelete={task.isOwner !== false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  loadingBar: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(138, 77, 255, 0.1)",
  },
  content: {
    flex: 1,
  },
  infoSection: {
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  infoRowIcon: {
    width: 40,
    alignItems: "center",
    marginTop: 2,
  },
  infoRowContent: {
    flex: 1,
    marginLeft: 4,
  },
  infoText: {
    fontSize: 15,
    color: "#9CA3AF",
    lineHeight: 22,
  },
  infoValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  infoPlaceholder: {
    fontSize: 15,
    color: "#6B7280",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    fontSize: 18,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  priorityText: {
    textTransform: "capitalize",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  statusLabel: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  statusBadge: {
    backgroundColor: "#3A3A3C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeCompleted: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  statusBadgeInProgress: {
    backgroundColor: "rgba(138, 77, 255, 0.2)",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  subTasksContainer: {
    paddingTop: 8,
  },
  subTaskSection: {
    marginBottom: 16,
  },
  subTaskSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chevronContainer: {
    marginRight: 8,
    transform: [{ rotate: "-90deg" }],
  },
  chevronContainerExpanded: {
    transform: [{ rotate: "0deg" }],
  },
  subTaskSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subTaskList: {
    paddingHorizontal: 20,
  },
  subTaskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  subTaskCheckbox: {
    marginRight: 12,
  },
  subTaskTitle: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  subTaskTitleCompleted: {
    color: "#6B7280",
    textDecorationLine: "line-through",
  },
  subTaskOptions: {
    padding: 4,
  },
  emptySubtasks: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySubtasksText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  emptySubtasksSubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    zIndex: 9999,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});

export default TaskDetailsScreen;
