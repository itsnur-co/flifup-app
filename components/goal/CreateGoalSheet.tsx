/**
 * Create Goal Sheet Component
 * Bottom sheet for creating/editing goals
 * Includes: title, description, date, category, and level selection
 */

import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import { Goal, GoalFormState, GoalType, DEFAULT_GOAL_FORM } from "@/types/goal";
import { TaskCategory } from "@/types/task";
import { Feather } from "@expo/vector-icons";
import {
  CalendarLineIcon,
  PriceTagLineIcon,
} from "@/components/icons/TaskIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateGoalSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormState) => void;
  goal?: Goal | null; // For edit mode
  categories?: TaskCategory[];
  onOpenDateSheet?: () => void;
  onOpenCategorySheet?: () => void;
  onOpenLevelSheet?: () => void;
  selectedDate?: Date | null;
  selectedCategory?: TaskCategory | null;
  selectedLevels?: string[];
  isLoading?: boolean;
}

export function CreateGoalSheet({
  visible,
  onClose,
  onSubmit,
  goal,
  categories = [],
  onOpenDateSheet,
  onOpenCategorySheet,
  onOpenLevelSheet,
  selectedDate,
  selectedCategory,
  selectedLevels = [],
  isLoading = false,
}: CreateGoalSheetProps) {
  const insets = useSafeAreaInsets();
  const [formState, setFormState] = useState<GoalFormState>(DEFAULT_GOAL_FORM);

  // Initialize form when goal changes (edit mode)
  useEffect(() => {
    if (goal) {
      setFormState({
        title: goal.title,
        description: goal.description || "",
        type: goal.type, // Include type field
        deadline: goal.deadline ? new Date(goal.deadline) : null,
        levels: goal.levels || [],
        category: goal.category || null,
        icon: goal.icon,
        color: goal.color,
        targetValue: goal.targetValue,
        unit: goal.unit,
      });
    } else {
      setFormState(DEFAULT_GOAL_FORM);
    }
  }, [goal]);

  // Update formState when external selections change
  useEffect(() => {
    if (selectedDate !== undefined) {
      setFormState((prev) => ({ ...prev, deadline: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedCategory !== undefined) {
      setFormState((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedLevels !== undefined) {
      setFormState((prev) => ({ ...prev, levels: selectedLevels }));
    }
  }, [selectedLevels]);

  const handleSubmit = () => {
    if (!formState.title.trim()) {
      return;
    }
    onSubmit(formState);
  };

  const handleClose = () => {
    setFormState(DEFAULT_GOAL_FORM);
    onClose();
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "No date";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      snapPoints={[0.95]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {goal ? "Edit Goal" : "Create Goal"}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!formState.title.trim() || isLoading}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.createButton,
                (!formState.title.trim() || isLoading) && styles.createButtonDisabled,
              ]}
            >
              {goal ? "Save" : "Create"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.formRow}>
            <View style={styles.iconContainer}>
              <Feather name="circle" size={22} color={Colors.primary} />
            </View>
            <TextInput
              style={styles.titleInput}
              placeholder="Add Title"
              placeholderTextColor="#6B7280"
              value={formState.title}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, title: text }))
              }
              autoFocus={!goal}
            />
          </View>

          {/* Description Input */}
          <View style={styles.formRow}>
            <View style={styles.iconContainer}>
              <Feather name="align-left" size={22} color="#8E8E93" />
            </View>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              placeholderTextColor="#6B7280"
              value={formState.description}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, description: text }))
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Goal Type Selector - NEW */}
          <View style={styles.formRow}>
            <View style={styles.iconContainer}>
              <Feather name="target" size={22} color="#8E8E93" />
            </View>
            <View style={styles.goalTypeContainer}>
              <Text style={styles.goalTypeLabel}>Goal Type</Text>
              <View style={styles.goalTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.goalTypeButton,
                    formState.type === "TASK" && styles.goalTypeButtonActive,
                  ]}
                  onPress={() =>
                    setFormState((prev) => ({ ...prev, type: "TASK" }))
                  }
                  activeOpacity={0.7}
                >
                  <Feather
                    name="check-square"
                    size={16}
                    color={formState.type === "TASK" ? Colors.primary : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.goalTypeButtonText,
                      formState.type === "TASK" && styles.goalTypeButtonTextActive,
                    ]}
                  >
                    Task
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.goalTypeButton,
                    formState.type === "HABIT" && styles.goalTypeButtonActive,
                  ]}
                  onPress={() =>
                    setFormState((prev) => ({ ...prev, type: "HABIT" }))
                  }
                  activeOpacity={0.7}
                >
                  <Feather
                    name="repeat"
                    size={16}
                    color={formState.type === "HABIT" ? Colors.primary : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.goalTypeButtonText,
                      formState.type === "HABIT" && styles.goalTypeButtonTextActive,
                    ]}
                  >
                    Habit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Achieving Date */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onOpenDateSheet}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <CalendarLineIcon size={22} color="#8E8E93" />
            </View>
            <View style={styles.formRowContent}>
              <Text
                style={[
                  styles.formRowLabel,
                  formState.deadline && styles.formRowLabelSelected,
                ]}
              >
                {formState.deadline ? formatDate(formState.deadline) : "Achieving Date"}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Add Category */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onOpenCategorySheet}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <PriceTagLineIcon size={22} color="#8E8E93" />
            </View>
            <View style={styles.formRowContent}>
              <Text
                style={[
                  styles.formRowLabel,
                  formState.category && styles.formRowLabelSelected,
                ]}
              >
                {formState.category?.name || "Add Category"}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Add Label/Levels */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onOpenLevelSheet}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Feather name="flag" size={22} color="#8E8E93" />
            </View>
            <View style={styles.formRowContent}>
              {formState.levels.length > 0 ? (
                <View style={styles.levelBadges}>
                  {formState.levels.map((level, index) => (
                    <View key={index} style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>{level}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.formRowLabel}>Add Label</Text>
              )}
            </View>
            <Feather name="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  createButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3C",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  descriptionInput: {
    minHeight: 80,
  },
  formRowContent: {
    flex: 1,
  },
  formRowLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  formRowLabelSelected: {
    color: "#FFFFFF",
  },
  levelBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  levelBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  goalTypeContainer: {
    flex: 1,
    gap: 12,
  },
  goalTypeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
  },
  goalTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  goalTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  goalTypeButtonActive: {
    backgroundColor: Colors.primary + "20",
    borderColor: Colors.primary,
  },
  goalTypeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  goalTypeButtonTextActive: {
    color: Colors.primary,
  },
});
