/**
 * Create Habit Bottom Sheet
 * Main form for creating new habits
 */

import {
  AddLineIcon,
  AlarmLineIcon,
  CalendarLineIcon,
  DotIcon,
  FlagIcon,
  PriceTagLineIcon,
  RepeatLineIcon,
} from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import { ReminderValue } from "@/components/shared";
import {
  DEFAULT_HABIT_FORM,
  HabitCategory,
  HabitFormState,
  RepeatConfig,
} from "@/types/habit";
import { Goal } from "@/types/goal";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateHabitSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreateHabit: (habit: HabitFormState) => void;
  onSelectRepeat: () => void;
  onSelectStartDate: () => void;
  onSelectGoal: () => void;
  onSelectCategory: () => void;
  onSetReminder: () => void;
  // Selected values from child sheets
  selectedRepeat?: RepeatConfig;
  selectedStartDate?: Date | null;
  selectedGoal?: Goal | null;
  selectedCategory?: HabitCategory | null;
  selectedReminder?: ReminderValue | null;
}

export const CreateHabitSheet: React.FC<CreateHabitSheetProps> = ({
  visible,
  onClose,
  onCreateHabit,
  onSelectRepeat,
  onSelectStartDate,
  onSelectGoal,
  onSelectCategory,
  onSetReminder,
  selectedRepeat,
  selectedStartDate,
  selectedGoal,
  selectedCategory,
  selectedReminder,
}) => {
  const insets = useSafeAreaInsets();
  const [formState, setFormState] =
    useState<HabitFormState>(DEFAULT_HABIT_FORM);
  const [comment, setComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleCreate = () => {
    // Validate habit name
    if (!formState.name.trim()) {
      Alert.alert("Validation Error", "Please enter a habit name");
      return;
    }

    // Get the repeat config
    const repeat = selectedRepeat || formState.repeat;

    // Validate repeat configuration
    if (repeat.type === "daily") {
      if (!repeat.days || repeat.days.length === 0) {
        Alert.alert(
          "Select Repeat Days",
          "Please select at least one day for daily habits"
        );
        return;
      }
    } else if (repeat.type === "monthly") {
      if (!repeat.dayOfMonth) {
        Alert.alert(
          "Select Day of Month",
          "Please select a day of the month for monthly habits"
        );
        return;
      }
    } else if (repeat.type === "interval") {
      if (!repeat.everyDays) {
        Alert.alert(
          "Select Interval",
          "Please select how many days between each habit"
        );
        return;
      }
    }

    // Validate start date
    const startDate = selectedStartDate || formState.startDate;
    if (!startDate) {
      Alert.alert("Select Start Date", "Please select a start date for the habit");
      return;
    }

    onCreateHabit({
      ...formState,
      repeat,
      startDate,
      goalId: selectedGoal?.id || formState.goalId,
      category: selectedCategory || formState.category,
      comment: comment || null,
    });

    // Reset form
    setFormState(DEFAULT_HABIT_FORM);
    setComment("");
    setShowCommentInput(false);
    onClose();
  };

  const formatRepeat = (repeat?: RepeatConfig): string => {
    if (!repeat) return "Repeat";
    if (repeat.type === "daily" && repeat.days.length > 0) {
      return `${repeat.days.length} days/week`;
    }
    if (repeat.type === "monthly") {
      return `Day ${repeat.dayOfMonth} monthly`;
    }
    if (repeat.type === "interval") {
      return `Every ${repeat.everyDays} days`;
    }
    return "Repeat";
  };

  const formatDate = (date?: Date | null): string => {
    if (!date) return "Start date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatGoal = (goal?: Goal | null): string => {
    if (!goal) return "Add Goal";
    return goal.title;
  };

  const formatReminderText = (reminder: ReminderValue | null | undefined): string => {
    if (!reminder) return "Set Reminder";
    const { type, value } = reminder;
    if (type === "MINUTES") {
      return `${value} minute${value > 1 ? "s" : ""} before`;
    } else if (type === "HOURS") {
      return `${value} hour${value > 1 ? "s" : ""} before`;
    } else if (type === "DAYS") {
      return `${value} day${value > 1 ? "s" : ""} before`;
    }
    return "Set Reminder";
  };

  const isValid = formState.name.trim().length > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.95, 1]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Habit</Text>
          <TouchableOpacity
            onPress={handleCreate}
            activeOpacity={0.7}
            disabled={!isValid}
          >
            <Text
              style={[
                styles.createButton,
                !isValid && styles.createButtonDisabled,
              ]}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Name Input */}
          <TouchableOpacity style={styles.formRow} activeOpacity={1}>
            <DotIcon size={22} color={Colors.primary} />
            <TextInput
              style={styles.nameInput}
              placeholder="Name your Habit"
              placeholderTextColor="#8E8E93"
              value={formState.name}
              onChangeText={(text) =>
                setFormState({ ...formState, name: text })
              }
            />
          </TouchableOpacity>

          {/* Repeat */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onSelectRepeat}
            activeOpacity={0.7}
          >
            <RepeatLineIcon size={22} color={Colors.primary} />
            <Text
              style={[
                styles.formLabel,
                selectedRepeat && styles.formLabelSelected,
              ]}
            >
              {formatRepeat(selectedRepeat)}
            </Text>
          </TouchableOpacity>

          {/* Start Date */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onSelectStartDate}
            activeOpacity={0.7}
          >
            <CalendarLineIcon size={22} color={Colors.primary} />
            <Text
              style={[
                styles.formLabel,
                selectedStartDate && styles.formLabelSelected,
              ]}
            >
              {formatDate(selectedStartDate)}
            </Text>
          </TouchableOpacity>

          {/* Add Goal */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onSelectGoal}
            activeOpacity={0.7}
          >
            <FlagIcon size={22} color={Colors.primary} />
            <Text
              style={[
                styles.formLabel,
                selectedGoal && styles.formLabelSelected,
              ]}
            >
              {formatGoal(selectedGoal)}
            </Text>
          </TouchableOpacity>

          {/* Add Category */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onSelectCategory}
            activeOpacity={0.7}
          >
            <PriceTagLineIcon size={22} color={Colors.primary} />
            <Text
              style={[
                styles.formLabel,
                selectedCategory && styles.formLabelSelected,
              ]}
            >
              {selectedCategory?.name || "Add category"}
            </Text>
          </TouchableOpacity>

          {/* Set Reminder */}
          <TouchableOpacity
            style={styles.formRow}
            onPress={onSetReminder}
            activeOpacity={0.7}
          >
            <AlarmLineIcon size={22} color={Colors.primary} />
            <Text
              style={[
                styles.formLabel,
                selectedReminder && styles.formLabelSelected,
              ]}
            >
              {formatReminderText(selectedReminder)}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Add Comment */}
          {!showCommentInput ? (
            <TouchableOpacity
              style={styles.addCommentRow}
              onPress={() => setShowCommentInput(true)}
              activeOpacity={0.7}
            >
              <AddLineIcon size={20} color={Colors.primary} />
              <Text style={styles.addCommentText}>Add Comment</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Enter your comment..."
                placeholderTextColor="#6B7280"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
  },
  formLabel: {
    fontSize: 15,
    color: "#8E8E93",
  },
  formLabelSelected: {
    color: "#FFFFFF",
  },
  addCommentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  addCommentText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.primary,
  },
  commentInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  commentInput: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#FFFFFF",
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default CreateHabitSheet;
