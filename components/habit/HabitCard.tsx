/**
 * Habit Card Component
 * Individual habit item display - matches Figma design
 */

import { DurationIcon } from "@/components/icons/HabitIcons";
import {
  CircleCheckIcon,
  CircleIcon,
  MoreHorizontalIcon,
  TagIcon,
} from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/colors";
import { Habit } from "@/types/habit";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardProps {
  habit: Habit;
  isCompleted?: boolean;
  onPress?: () => void;
  onToggle?: () => void;
  onMore?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted = false,
  onPress,
  onToggle,
  onMore,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Row: Checkbox, Title, More Button */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          {isCompleted ? (
            <CircleCheckIcon size={24} color={Colors.primary} />
          ) : (
            <CircleIcon size={24} color="#3A3A3C" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleContainer}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.title, isCompleted && styles.titleCompleted]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={onMore}
          activeOpacity={0.7}
        >
          <MoreHorizontalIcon size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Meta Row */}
      <View style={styles.metaRow}>
        {/* Goal/Duration */}
        {habit.goal && (
          <View style={styles.metaItem}>
            <DurationIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>
              {habit.goal.value} {habit.goal.unit}
            </Text>
          </View>
        )}

        {/* Reminder */}
        {habit.reminder && (
          <View style={styles.metaItem}>
            <DurationIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{habit.reminder}</Text>
          </View>
        )}

        {/* Category */}
        {habit.category && (
          <View style={styles.metaItem}>
            <TagIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{habit.category.name}</Text>
          </View>
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkbox: {
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
    gap: 6,
    flexShrink: 0,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  moreButton: {
    padding: 4,
  },
});

export default HabitCard;
