/**
 * Add Subtask Bottom Sheet Component
 * Allows users to add new subtasks to a task
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddSubtaskSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddSubtask: (title: string) => Promise<boolean>;
  isLoading?: boolean;
}

export const AddSubtaskSheet: React.FC<AddSubtaskSheetProps> = ({
  visible,
  onClose,
  onAddSubtask,
  isLoading = false,
}) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus input when sheet opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      setTitle("");
    }
  }, [visible]);

  const handleAdd = useCallback(async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddSubtask(title.trim());
    setIsSubmitting(false);

    if (success) {
      setTitle("");
      onClose();
    }
  }, [title, isSubmitting, onAddSubtask, onClose]);

  const handleAddAnother = useCallback(async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddSubtask(title.trim());
    setIsSubmitting(false);

    if (success) {
      setTitle("");
      inputRef.current?.focus();
    }
  }, [title, isSubmitting, onAddSubtask]);

  const isDisabled = !title.trim() || isSubmitting || isLoading;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.4]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Sub-task</Text>
          <TouchableOpacity
            onPress={handleAdd}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Enter sub-task title..."
            placeholderTextColor="#8E8E93"
            value={title}
            onChangeText={setTitle}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            editable={!isSubmitting}
          />
        </View>

        {/* Add Another Button */}
        <TouchableOpacity
          style={[
            styles.addAnotherButton,
            isDisabled && styles.addAnotherButtonDisabled,
          ]}
          onPress={handleAddAnother}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.addAnotherText,
              isDisabled && styles.addAnotherTextDisabled,
            ]}
          >
            + Add Another
          </Text>
        </TouchableOpacity>

        {/* Spacer for keyboard */}
        <View style={{ height: insets.bottom + 20 }} />
      </KeyboardAvoidingView>
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
  cancelButton: {
    fontSize: 16,
    color: "#8E8E93",
  },
  addButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
  },
  addAnotherButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  addAnotherButtonDisabled: {
    borderColor: "#3A3A3C",
  },
  addAnotherText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.primary,
  },
  addAnotherTextDisabled: {
    color: "#6B7280",
  },
});

export default AddSubtaskSheet;
