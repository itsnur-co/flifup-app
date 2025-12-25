/**
 * Habit Section Component
 * Collapsible section for grouping habits (Today, Completed)
 */

import { ChevronDownIcon } from "@/components/icons/TaskIcons";
import { Habit } from "@/types/habit";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { HabitCard } from "./HabitCard";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface HabitSectionProps {
  title: string;
  count: number;
  habits: Habit[];
  initialExpanded?: boolean;
  onHabitPress?: (habit: Habit) => void;
  onHabitToggle?: (habit: Habit) => void;
  onHabitMore?: (habit: Habit) => void;
}

export const HabitSection: React.FC<HabitSectionProps> = ({
  title,
  count,
  habits,
  initialExpanded = true,
  onHabitPress,
  onHabitToggle,
  onHabitMore,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const isCompleted = title.toLowerCase() === "completed";

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.chevronContainer,
            isExpanded && styles.chevronExpanded,
          ]}
        >
          <ChevronDownIcon size={20} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      {isExpanded && (
        <View style={styles.content}>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={isCompleted}
              onPress={() => onHabitPress?.(habit)}
              onToggle={() => onHabitToggle?.(habit)}
              onMore={() => onHabitMore?.(habit)}
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  chevronContainer: {
    transform: [{ rotate: "-90deg" }],
    marginRight: 8,
  },
  chevronExpanded: {
    transform: [{ rotate: "0deg" }],
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  countBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  content: {
    marginTop: 8,
  },
});

export default HabitSection;
