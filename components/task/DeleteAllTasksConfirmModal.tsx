/**
 * Delete All Tasks Confirmation Modal
 * Confirmation dialog for deleting all tasks on a specific date
 */

import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DeleteAllTasksConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dateText: string;
  taskCount?: number;
}

export const DeleteAllTasksConfirmModal: React.FC<
  DeleteAllTasksConfirmModalProps
> = ({ visible, onClose, onConfirm, dateText, taskCount = 0 }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalContainer}>
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Delete All Tasks?</Text>
          </View>

          {/* Message */}
          <View style={styles.content}>
            <Text style={styles.message}>
              Are you sure you want to delete all{" "}
              {taskCount > 0 ? taskCount : ""}{" "}
              {taskCount === 1 ? "task" : "tasks"} for {dateText}?
            </Text>
            <Text style={styles.warning}>This action cannot be undone.</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  message: {
    fontSize: 15,
    color: "#D1D1D6",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  warning: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: "#3A3A3C",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  confirmButton: {
    backgroundColor: "transparent",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
