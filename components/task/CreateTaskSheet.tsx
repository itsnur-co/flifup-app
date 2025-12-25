/**
 * Create Task Bottom Sheet Component
 * Full-featured task creation form
 * Matches Figma design exactly
 */

import {
  BellIcon,
  CalendarIcon,
  CircleIcon,
  ClockIcon,
  DescriptionIcon,
  PeopleIcon,
  PlusIcon,
  TagIcon,
} from "@/components/icons/TaskIcons";
import { AvatarGroup } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import {
  Category,
  DEFAULT_TASK_FORM,
  Person,
  TaskFormState,
} from "@/types/task";
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
  onSelectCategory?: () => void;
  onSelectPeople?: () => void;
  onSetReminder?: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  selectedCategory?: Category | null;
  selectedPeople?: Person[];
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
  onSelectCategory,
  onSelectPeople,
  onSetReminder,
  selectedDate,
  selectedTime,
  selectedCategory,
  selectedPeople = [],
}) => {
  const insets = useSafeAreaInsets();
  const [formState, setFormState] = useState<TaskFormState>(DEFAULT_TASK_FORM);
  const [subTasks, setSubTasks] = useState<
    { title: string; description: string }[]
  >([]);

  const handleCreate = useCallback(() => {
    if (!formState.title.trim()) return;

    onCreateTask({
      ...formState,
      dueDate: selectedDate ?? null,
      dueTime: selectedTime ?? null,
      category: selectedCategory ?? null,
      assignedPeople: selectedPeople,
      subTasks: subTasks.map((st) => ({
        title: st.title,
        description: st.description,
        completed: false,
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
    selectedPeople,
    subTasks,
    onCreateTask,
    onClose,
  ]);

  const formatDate = (date: Date | null): string => {
    if (!date) return "No date";
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

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
          <FormRow icon={<CircleIcon size={24} color={Colors.primary} />}>
            <TextInput
              style={styles.titleInput}
              placeholder="Add Title"
              placeholderTextColor="#fff"
              value={formState.title}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, title: text }))
              }
              autoFocus
            />
          </FormRow>

          {/* Description */}
          <FormRow icon={<DescriptionIcon size={24} color={Colors.primary} />}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              placeholderTextColor="#fff"
              value={formState.description}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, description: text }))
              }
              multiline
            />
          </FormRow>

          {/* Date */}
          <FormRow
            icon={<CalendarIcon size={24} color={Colors.primary} />}
            onPress={onSelectDate}
          >
            <Text
              style={[styles.rowText, selectedDate && styles.rowTextActive]}
            >
              {formatDate(selectedDate ?? null)}
            </Text>
          </FormRow>

          {/* Time */}
          <FormRow
            icon={<ClockIcon size={24} color={Colors.primary} />}
            onPress={onSelectTime}
          >
            <Text
              style={[styles.rowText, selectedTime && styles.rowTextActive]}
            >
              {selectedTime || "Add Time"}
            </Text>
          </FormRow>

          {/* Category */}
          <FormRow
            icon={<TagIcon size={24} color={Colors.primary} />}
            onPress={onSelectCategory}
          >
            <Text
              style={[styles.rowText, selectedCategory && styles.rowTextActive]}
            >
              {selectedCategory?.name || "Add category"}
            </Text>
          </FormRow>

          {/* People */}
          <FormRow
            icon={<PeopleIcon size={24} color={Colors.primary} />}
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
            icon={<BellIcon size={24} color={Colors.primary} />}
            onPress={onSetReminder}
          >
            <Text style={styles.rowText}>Set Reminder</Text>
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
                      <CircleIcon size={20} color="#5A5A5E" />
                    </TouchableOpacity>
                    <View style={styles.subTaskContent}>
                      <TextInput
                        style={styles.subTaskTitle}
                        placeholder={`Sub task-${index + 1}`}
                        placeholderTextColor="#fff"
                        value={subTask.title}
                        onChangeText={(text) =>
                          updateSubTask(index, "title", text)
                        }
                      />
                      <TextInput
                        style={styles.subTaskDescription}
                        placeholder="sub Task description/ note"
                        placeholderTextColor="#fff"
                        value={subTask.description}
                        onChangeText={(text) =>
                          updateSubTask(index, "description", text)
                        }
                      />
                    </View>
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
              <PlusIcon size={20} color={Colors.primary} />
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
    color: Colors.ui.text.secondary,
  },
  rowTextActive: {
    color: "#FFFFFF",
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
    color: Colors.ui.white,
    padding: 0,
  },
  addSubTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  addSubTaskText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.ui.white,
    marginLeft: 8,
  },
});

export default CreateTaskSheet;
