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
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
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

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={1}
        >
          {habit.name}
        </Text>

        {/* Meta Row */}
        <View style={styles.metaRow}>
          {/* Duration */}
          <View style={styles.metaItem}>
            <DurationIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>2 H</Text>
          </View>

          {/* Category */}
          {habit.category && (
            <View style={styles.metaItem}>
              <TagIcon size={14} color="#8E8E93" />
              <Text style={styles.metaText}>{habit.category.name}</Text>
            </View>
          )}
        </View>
      </View>

      {/* More Button */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={onMore}
        activeOpacity={0.7}
      >
        <MoreHorizontalIcon size={20} color="#8E8E93" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  moreButton: {
    padding: 4,
  },
});

export default HabitCard;
