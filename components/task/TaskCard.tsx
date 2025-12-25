/**
 * Task Card Component
 * Displays individual task in the task list
 * Matches Figma design exactly
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Task } from '@/types/task';
import { AvatarGroup } from '@/components/ui/Avatar';
import {
  CircleIcon,
  CircleCheckIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  MoreHorizontalIcon,
} from '@/components/icons/TaskIcons';
import { Colors } from '@/constants/colors';

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
  const formatDate = (date?: Date): string => {
    if (!date) return '';
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View
      style={[styles.container, task.completed && styles.containerCompleted, style]}
    >
      {/* Top Row: Checkbox, Title, More Button */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onToggleComplete}
          style={styles.checkboxContainer}
          activeOpacity={0.7}
        >
          {task.completed ? (
            <CircleCheckIcon size={24} color={Colors.primary} />
          ) : (
            <CircleIcon size={24} color="#5A5A5E" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.titleContainer}
        >
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMorePress}
          style={styles.moreButton}
          activeOpacity={0.7}
        >
          <MoreHorizontalIcon size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Meta info row */}
      <View style={styles.metaRow}>
        {/* Duration */}
        {task.dueTime && (
          <View style={styles.metaItem}>
            <ClockIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>2 H</Text>
          </View>
        )}

        {/* Date */}
        {task.dueDate && (
          <View style={styles.metaItem}>
            <CalendarIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>
              {formatDate(task.dueDate)}, {task.dueTime}
            </Text>
          </View>
        )}

        {/* Category */}
        {task.category && (
          <View style={styles.metaItem}>
            <TagIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{task.category.name}</Text>
          </View>
        )}

        {/* Assigned people */}
        {task.assignedPeople.length > 0 && (
          <AvatarGroup
            avatars={task.assignedPeople.map((p) => ({
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
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  containerCompleted: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
    color: '#FFFFFF',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 36,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  avatarGroup: {
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
});

export default TaskCard;
