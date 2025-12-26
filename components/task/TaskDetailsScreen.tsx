/**
 * Task Details Screen Component
 * Displays task details with sub-tasks list
 * Matches Figma design exactly
 */

import {
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CircleIcon,
  ClockIcon,
  DescriptionIcon,
  MoreHorizontalIcon,
  PeopleIcon,
  TagIcon,
} from "@/components/icons/TaskIcons";
import { ChevronLeftIcon } from "@/components/icons/CommonIcons";
import { AvatarGroup } from "@/components/ui/Avatar";
import { CreateButton } from "@/components/buttons";
import { Colors } from "@/constants/colors";
import { Category, Person, SubTask, Task } from "@/types/task";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TaskEditModal } from ".";


interface TaskDetailsScreenProps {
  task: Task;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleSubTask?: (subTaskId: string) => void;
  onAddSubTask?: () => void;
  onSubTaskOptions?: (subTask: SubTask) => void;
}

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
  subTasks: SubTask[];
  onToggleComplete: (id: string) => void;
  onOptions: (subTask: SubTask) => void;
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
            <TouchableOpacity
              style={styles.subTaskCheckbox}
              onPress={() => onToggleComplete(subTask.id)}
              activeOpacity={0.7}
            >
              {subTask.completed ? (
                <CircleCheckIcon size={24} color={Colors.primary} />
              ) : (
                <CircleIcon size={24} color="#5A5A5E" />
              )}
            </TouchableOpacity>
            <Text
              style={[
                styles.subTaskTitle,
                subTask.completed && styles.subTaskTitleCompleted,
              ]}
            >
              {subTask.title}
            </Text>
            <TouchableOpacity
              style={styles.subTaskOptions}
              onPress={() => onOptions(subTask)}
              activeOpacity={0.7}
            >
              <MoreHorizontalIcon size={20} color="#6B7280" />
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
}) => {
  const insets = useSafeAreaInsets();
  const [showEditModal, setShowEditModal] = useState(false);
  const [incompleteExpanded, setIncompleteExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);

  const incompleteSubTasks = task.subTasks.filter((st) => !st.completed);
  const completedSubTasks = task.subTasks.filter((st) => st.completed);

  const handleToggleSubTask = useCallback((id: string) => {
    onToggleSubTask?.(id);
  }, [onToggleSubTask]);

  const handleSubTaskOptions = useCallback((subTask: SubTask) => {
    onSubTaskOptions?.(subTask);
  }, [onSubTaskOptions]);

  const formatDate = (date?: Date): string => {
    if (!date) return "No date";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatReminder = (reminder?: Date): string => {
    if (!reminder) return "No reminder";
    return "30 Minutes Before"; // You can calculate this based on task.dueDate and reminder
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary, "#6C2BBF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{task.title}</Text>
            <Text style={styles.headerSubtitle}>
              {completedSubTasks.length}/{task.subTasks.length} Sub Tasks
            </Text>
          </View>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setShowEditModal(true)}
            activeOpacity={0.7}
          >
            <MoreHorizontalIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Info Section */}
        <View style={styles.infoSection}>
          {/* Description */}
          <InfoRow icon={<DescriptionIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoText}>
              {task.description ||
                "Lorem ipsum dolor sit amet consectetur. Pellentesque condimentum nulla nisi faucibus mi quis penatibus. Ac duis sed morbi adipiscing sit."}
            </Text>
          </InfoRow>

          {/* Date */}
          <InfoRow icon={<CalendarIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>{formatDate(task.dueDate)}</Text>
          </InfoRow>

          {/* Time */}
          <InfoRow icon={<ClockIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>{task.dueTime || "12:00 AM"}</Text>
          </InfoRow>

          {/* Category */}
          <InfoRow icon={<TagIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>
              {task.category?.name || "Exercise"}
            </Text>
          </InfoRow>

          {/* People */}
          <InfoRow icon={<PeopleIcon size={22} color={Colors.primary} />}>
            {task.assignedPeople && task.assignedPeople.length > 0 ? (
              <AvatarGroup
                avatars={task.assignedPeople.map((p) => ({
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
          <InfoRow icon={<BellIcon size={22} color={Colors.primary} />}>
            <Text style={styles.infoValue}>{formatReminder(task.reminder)}</Text>
          </InfoRow>
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
        </View>
      </ScrollView>

      {/* Add Sub-task FAB */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 32 }]}>
        <CreateButton label="New Sub-Task" onPress={onAddSubTask || (() => {})} />
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
