/**
 * Create Task Bottom Sheet Component
 * Full-featured task creation form
 * Uses unified Task types
 */

import {
  AddLineIcon,
  AlarmLineIcon,
  AlignLeftIcon,
  CalendarLineIcon,
  DotIcon,
  PriceTagLineIcon,
  RepeatLineIcon,
  TimeLineIcon,
  UserAddLineIcon,
} from "@/components/icons/TaskIcons";
import { AvatarGroup } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import {
  TaskCategory,
  TaskFormState,
  DEFAULT_TASK_FORM,
  Person,
  ReminderValue,
} from "@/types/task";
import { RepeatConfig } from "@/types/habit";
import { formatDate, formatReminder } from "@/utils/dateTime";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreateTask: (task: TaskFormState) => void;
  onSelectDate?: () => void;
  onSelectTime?: () => void;
  onSelectRepeat?: () => void;
  onSelectCategory?: () => void;
  onSelectPeople?: () => void;
  onSetReminder?: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  selectedRepeat?: RepeatConfig | null;
  selectedCategory?: TaskCategory | null;
  selectedPeople?: Person[];
  selectedReminder?: ReminderValue | null;
}

interface FormRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onPress?: () => void;
}

const FormRow: React.FC<FormRowProps> = ({ icon, children, onPress }) => {
  const content = (
    <View style={styles.formRow}>
      <View style={styles.formRowIcon}>{icon}</View>
      <View style={styles.formRowContent}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const CreateTaskSheet: React.FC<CreateTaskSheetProps> = ({
  visible,
  onClose,
  onCreateTask,
  onSelectDate,
  onSelectTime,
  onSelectRepeat,
  onSelectCategory,
  onSelectPeople,
  onSetReminder,
  selectedDate,
  selectedTime,
  selectedRepeat,
  selectedCategory,
  selectedPeople = [],
  selectedReminder,
}) => {
  const insets = useSafeAreaInsets();
  const [formState, setFormState] = useState<TaskFormState>(DEFAULT_TASK_FORM);
  const [subTasks, setSubTasks] = useState<
    { title: string; description: string }[]
  >([]);

  const formatRepeatDisplay = (repeat?: RepeatConfig | null): string => {
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

  const formatReminderDisplay = (reminder: ReminderValue | null): string => {
    if (!reminder) return "Set Reminder";
    return formatReminder(reminder.value, reminder.type);
  };

  // Format HH:mm time to user-friendly display (e.g., "5:30 PM")
  const formatTimeDisplay = (time?: string | null): string => {
    if (!time) return "Add Time";

    // Parse HH:mm format
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return time; // Return as-is if not in expected format

    const hour24 = parseInt(match[1], 10);
    const minute = match[2];

    let hour12: number;
    let period: string;

    if (hour24 === 0) {
      hour12 = 12;
      period = "AM";
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = "AM";
    } else if (hour24 === 12) {
      hour12 = 12;
      period = "PM";
    } else {
      hour12 = hour24 - 12;
      period = "PM";
    }

    return `${hour12}:${minute} ${period}`;
  };

  const handleCreate = useCallback(() => {
    if (!formState.title.trim()) return;

    onCreateTask({
      ...formState,
      dueDate: selectedDate?.toISOString() ?? null,
      dueTime: selectedTime ?? null,
      category: selectedCategory ?? null,
      categoryId: selectedCategory?.id ?? null,
      subtasks: subTasks.map((st) => ({
        title: st.title,
        description: st.description,
      })),
    });

    // Reset form
    setFormState(DEFAULT_TASK_FORM);
    setSubTasks([]);
    onClose();
  }, [
    formState,
    selectedDate,
    selectedTime,
    selectedCategory,
    subTasks,
    onCreateTask,
    onClose,
  ]);

  const addSubTask = () => {
    setSubTasks([...subTasks, { title: "", description: "" }]);
  };

  const updateSubTask = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updated = [...subTasks];
    updated[index] = { ...updated[index], [field]: value };
    setSubTasks(updated);
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

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
          <Text style={styles.headerTitle}>Create Task</Text>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!formState.title.trim()}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.createButton,
                !formState.title.trim() && styles.createButtonDisabled,
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <FormRow icon={<DotIcon size={24} color={Colors.primary} />}>
            <TextInput
              style={styles.titleInput}
              placeholder="Add Title"
              placeholderTextColor="#8E8E93"
              value={formState.title}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, title: text }))
              }
              autoFocus
            />
          </FormRow>

          {/* Description */}
          <FormRow icon={<AlignLeftIcon size={24} color={Colors.primary} />}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              placeholderTextColor="#8E8E93"
              value={formState.description}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, description: text }))
              }
              multiline
            />
          </FormRow>

          {/* Date */}
          <FormRow
            icon={<CalendarLineIcon size={24} color={Colors.primary} />}
            onPress={onSelectDate}
          >
            <Text
              style={[styles.rowText, selectedDate && styles.rowTextActive]}
            >
              {formatDate(selectedDate)}
            </Text>
          </FormRow>

          {/* Time */}
          <FormRow
            icon={<TimeLineIcon size={24} color={Colors.primary} />}
            onPress={onSelectTime}
          >
            <Text
              style={[styles.rowText, selectedTime && styles.rowTextActive]}
            >
              {formatTimeDisplay(selectedTime)}
            </Text>
          </FormRow>

          {/* Repeat */}
          <FormRow
            icon={<RepeatLineIcon size={24} color={Colors.primary} />}
            onPress={onSelectRepeat}
          >
            <Text
              style={[styles.rowText, selectedRepeat && styles.rowTextActive]}
            >
              {formatRepeatDisplay(selectedRepeat)}
            </Text>
          </FormRow>

          {/* Category */}
          <FormRow
            icon={<PriceTagLineIcon size={24} color={Colors.primary} />}
            onPress={onSelectCategory}
          >
            <View style={styles.categoryDisplay}>
              {selectedCategory?.icon && (
                <Text style={styles.categoryIcon}>{selectedCategory.icon}</Text>
              )}
              <Text
                style={[styles.rowText, selectedCategory && styles.rowTextActive]}
              >
                {selectedCategory?.name || "Add category"}
              </Text>
            </View>
          </FormRow>

          {/* People */}
          <FormRow
            icon={<UserAddLineIcon size={24} color={Colors.primary} />}
            onPress={onSelectPeople}
          >
            {selectedPeople.length > 0 ? (
              <AvatarGroup
                avatars={selectedPeople.map((p) => ({
                  uri: p.avatar,
                  name: p.name,
                }))}
                max={4}
                size={32}
                overlap={8}
              />
            ) : (
              <Text style={styles.rowText}>Add People</Text>
            )}
          </FormRow>

          {/* Reminder */}
          <FormRow
            icon={<AlarmLineIcon size={24} color={Colors.primary} />}
            onPress={onSetReminder}
          >
            <Text
              style={[styles.rowText, selectedReminder && styles.rowTextActive]}
            >
              {formatReminderDisplay(selectedReminder ?? null)}
            </Text>
          </FormRow>

          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* Sub-tasks Section */}
          <View style={styles.subTasksSection}>
            {subTasks.length > 0 && (
              <>
                <View style={styles.subTasksHeader}>
                  <Text style={styles.subTasksTitle}>Sub-tasks</Text>
                  <Text style={styles.subTasksCount}>0/{subTasks.length}</Text>
                </View>

                {subTasks.map((subTask, index) => (
                  <View key={index} style={styles.subTaskItem}>
                    <TouchableOpacity
                      style={styles.subTaskCheckbox}
                      activeOpacity={0.7}
                    >
                      <DotIcon size={20} color="#5A5A5E" />
                    </TouchableOpacity>
                    <View style={styles.subTaskContent}>
                      <TextInput
                        style={styles.subTaskTitle}
                        placeholder={`Sub task-${index + 1}`}
                        placeholderTextColor="#8E8E93"
                        value={subTask.title}
                        onChangeText={(text) =>
                          updateSubTask(index, "title", text)
                        }
                      />
                      <TextInput
                        style={styles.subTaskDescription}
                        placeholder="sub Task description/ note"
                        placeholderTextColor="#6B7280"
                        value={subTask.description}
                        onChangeText={(text) =>
                          updateSubTask(index, "description", text)
                        }
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => removeSubTask(index)}
                      style={styles.removeSubTask}
                    >
                      <Text style={styles.removeSubTaskText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* Add Sub-task Button */}
            <TouchableOpacity
              onPress={addSubTask}
              style={styles.addSubTaskButton}
              activeOpacity={0.7}
            >
              <AddLineIcon size={20} color={Colors.primary} />
              <Text style={styles.addSubTaskText}>Add sub-task</Text>
            </TouchableOpacity>
          </View>
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
    opacity: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  formRowIcon: {
    width: 40,
    alignItems: "center",
  },
  formRowContent: {
    flex: 1,
    marginLeft: 8,
  },
  titleInput: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
  },
  descriptionInput: {
    fontSize: 15,
    color: "#FFFFFF",
    padding: 0,
    minHeight: 20,
  },
  rowText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  rowTextActive: {
    color: "#FFFFFF",
  },
  categoryDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    fontSize: 18,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: "#000000",
    marginVertical: 16,
  },
  subTasksSection: {
    paddingHorizontal: 20,
  },
  subTasksHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subTasksTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subTasksCount: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  subTaskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  subTaskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  subTaskContent: {
    flex: 1,
  },
  subTaskTitle: {
    fontSize: 15,
    color: "#FFFFFF",
    padding: 0,
    marginBottom: 4,
  },
  subTaskDescription: {
    fontSize: 13,
    color: "#9CA3AF",
    padding: 0,
  },
  removeSubTask: {
    padding: 4,
    marginLeft: 8,
  },
  removeSubTaskText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  addSubTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  addSubTaskText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.primary,
    marginLeft: 8,
  },
});

export default CreateTaskSheet;
