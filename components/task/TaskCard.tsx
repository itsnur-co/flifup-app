
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Task, isTaskCompleted, collaboratorToPerson } from "@/types/task";
import { AvatarGroup } from "@/components/ui/Avatar";
import {
  CalendarLineIcon,
  DotIcon,
  PriceTagLineIcon,
  TimeLineIcon,
} from "@/components/icons/TaskIcons";
import { CompletionCheckbox } from "@/components/shared";
import { formatTaskDate, formatTime, formatDuration } from "@/utils/dateTime";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: () => void;
  onMorePress?: () => void;
  style?: ViewStyle;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleComplete,
  onMorePress,
  style,
}) => {
  const isCompleted = isTaskCompleted(task);

  // Convert collaborators to display format
  const assignedPeople = task.collaborators?.map(collaboratorToPerson) || [];


  return (
    <View
      style={[styles.container, isCompleted && styles.containerCompleted, style]}
    >

      <View style={styles.topRow}>
        <CompletionCheckbox
          isCompleted={isCompleted}
          onToggle={onToggleComplete || (() => {})}
          size={24}
          uncompletedColor="#5A5A5E"
          style={styles.checkboxContainer}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.titleContainer}
        >
          <Text
            style={[styles.title, isCompleted && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
        </TouchableOpacity>

        {/* Priority indicator */}
        {/* <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} /> */}

        <TouchableOpacity
          onPress={onMorePress}
          style={styles.moreButton}
          activeOpacity={0.7}
        >
          <DotIcon size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Meta info row */}
      <View style={styles.metaRow}>
        {/* Estimated Time */}
        {task.estimatedTime && (
          <View style={styles.metaItem}>
            <TimeLineIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{formatDuration(task.estimatedTime)}</Text>
          </View>
        )}

        {/* Date & Time */}
        {task.dueDate && (
          <View style={styles.metaItem}>
            <CalendarLineIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>
              {formatTaskDate(task.dueDate)}
              {task.dueTime && `, ${formatTime(task.dueTime)}`}
            </Text>
          </View>
        )}

        {/* Category */}
        {task.category && (
          <View style={styles.metaItem}>
            <PriceTagLineIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{task.category.name}</Text>
          </View>
        )}

        {/* Subtask count */}
        {task.subtasks && task.subtasks.length > 0 && (
          <View style={styles.subtaskBadge}>
            <Text style={styles.subtaskText}>
              {task.subtasks.filter((st) => st.isCompleted).length}/{task.subtasks.length}
            </Text>
          </View>
        )}

        {/* Assigned people */}
        {assignedPeople.length > 0 && (
          <AvatarGroup
            avatars={assignedPeople.map((p) => ({
              uri: p.avatar,
              name: p.name,
            }))}
            max={3}
            size={22}
            overlap={6}
            style={styles.avatarGroup}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  containerCompleted: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingLeft: 36,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  subtaskBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  subtaskText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  avatarGroup: {
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
});

export default TaskCard;
