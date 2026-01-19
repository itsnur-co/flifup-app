/**
 * Subtask Options Bottom Sheet Component
 * Shows options for a selected subtask (edit, delete, etc.)
 */

import {
  BackIcon,
  CheckIcon,
  DeleteBinIcon,
  EditIcon,
  UndoIcon,
} from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import { TaskSubtask } from "@/types/task";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SubtaskOptionsSheetProps {
  visible: boolean;
  subtask: TaskSubtask | null;
  onClose: () => void;
  onToggleComplete: (subtaskId: string) => Promise<boolean>;
  onUpdateTitle: (subtaskId: string, newTitle: string) => Promise<boolean>;
  onDelete: (subtaskId: string) => Promise<boolean>;
  isLoading?: boolean;
}

type Mode = "options" | "edit";

export const SubtaskOptionsSheet: React.FC<SubtaskOptionsSheetProps> = ({
  visible,
  subtask,
  onClose,
  onToggleComplete,
  onUpdateTitle,
  onDelete,
  isLoading = false,
}) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<Mode>("options");
  const [editTitle, setEditTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when sheet opens/closes or subtask changes
  useEffect(() => {
    if (visible && subtask) {
      setMode("options");
      setEditTitle(subtask.title);
    }
  }, [visible, subtask]);

  // Focus input when switching to edit mode
  useEffect(() => {
    if (mode === "edit") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [mode]);

  const handleToggleComplete = useCallback(async () => {
    if (!subtask || isSubmitting) return;

    setIsSubmitting(true);
    await onToggleComplete(subtask.id);
    setIsSubmitting(false);
    onClose();
  }, [subtask, isSubmitting, onToggleComplete, onClose]);

  const handleEdit = useCallback(() => {
    setMode("edit");
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!subtask || !editTitle.trim() || isSubmitting) return;

    if (editTitle.trim() === subtask.title) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    const success = await onUpdateTitle(subtask.id, editTitle.trim());
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  }, [subtask, editTitle, isSubmitting, onUpdateTitle, onClose]);

  const handleDelete = useCallback(() => {
    if (!subtask) return;

    Alert.alert(
      "Delete Sub-task",
      `Are you sure you want to delete "${subtask.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsSubmitting(true);
            await onDelete(subtask.id);
            setIsSubmitting(false);
            onClose();
          },
        },
      ]
    );
  }, [subtask, onDelete, onClose]);

  const handleClose = useCallback(() => {
    setMode("options");
    onClose();
  }, [onClose]);

  if (!subtask) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      snapPoints={[0.55, 0.75]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {mode === "options" ? (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {subtask.title}
              </Text>
              <Text style={styles.headerSubtitle}>
                {subtask.isCompleted ? "Completed" : "Incomplete"}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Toggle Complete */}
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleToggleComplete}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  {subtask.isCompleted ? (
                    <UndoIcon size={22} color={Colors.primary} />
                  ) : (
                    <CheckIcon size={22} color={Colors.primary} />
                  )}
                </View>
                <Text style={styles.optionText}>
                  {subtask.isCompleted
                    ? "Mark as Incomplete"
                    : "Mark as Complete"}
                </Text>
              </TouchableOpacity>

              {/* Edit */}
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleEdit}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <EditIcon size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.optionText}>Edit Title</Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDelete}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <DeleteBinIcon size={22} color="#EF4444" />
                </View>
                <Text style={[styles.optionText, styles.deleteText]}>
                  Delete Sub-task
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Edit Header */}
            <View style={styles.editHeader}>
              <TouchableOpacity
                onPress={() => setMode("options")}
                activeOpacity={0.7}
                style={styles.backButtonContainer}
              >
                <BackIcon size={20} color={Colors.primary} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.editHeaderTitle}>Edit Title</Text>

              <TouchableOpacity
                onPress={handleSaveEdit}
                disabled={!editTitle.trim() || isSubmitting}
                activeOpacity={0.7}
                style={styles.saveButtonContainer}
              >
                <Text
                  style={[
                    styles.saveButton,
                    (!editTitle.trim() || isSubmitting) &&
                      styles.saveButtonDisabled,
                  ]}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Edit Input */}
            <View style={styles.editContainer}>
              <TextInput
                ref={inputRef}
                style={styles.editInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Sub-task title"
                placeholderTextColor="#8E8E93"
                returnKeyType="done"
                onSubmitEditing={handleSaveEdit}
                editable={!isSubmitting}
              />
            </View>
          </>
        )}

        {/* Spacer */}
        <View style={{ height: insets.bottom + 20 }} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  editHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  editHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  saveButtonContainer: {
    minWidth: 60,
    alignItems: "flex-end",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  optionsContainer: {
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  optionIconContainer: {
    width: 28,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  deleteText: {
    color: "#EF4444",
  },
  editContainer: {
    padding: 20,
  },
  editInput: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default SubtaskOptionsSheet;
