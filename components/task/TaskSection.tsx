/**
 * Task Section Component
 * Collapsible section for grouping tasks (Today, Completed, Upcoming)
 */

import React, { useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { ChevronDownIcon } from '@/components/icons/TaskIcons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TaskSectionProps {
  title: string;
  count: number;
  tasks: Task[];
  initialExpanded?: boolean;
  onTaskPress?: (task: Task) => void;
  onTaskToggle?: (task: Task) => void;
  onTaskMore?: (task: Task) => void;
  style?: ViewStyle;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  count,
  tasks,
  initialExpanded = true,
  onTaskPress,
  onTaskToggle,
  onTaskMore,
  style,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const rotateAnim = useState(new Animated.Value(initialExpanded ? 1 : 0))[0];

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      <TouchableOpacity
        onPress={toggleExpanded}
        activeOpacity={0.7}
        style={styles.header}
      >
        <Animated.View
          style={[
            styles.chevronContainer,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          <ChevronDownIcon size={20} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </TouchableOpacity>

      {/* Tasks List */}
      {isExpanded && (
        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskPress?.(task)}
              onToggleComplete={() => onTaskToggle?.(task)}
              onMorePress={() => onTaskMore?.(task)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  chevronContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
    marginLeft: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tasksList: {
    marginTop: 8,
  },
});

export default TaskSection;
