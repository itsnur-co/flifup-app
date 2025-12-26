/**
 * Task Edit Modal Component
 * Edit/Delete options modal for task 3-dot menu
 * Matches Figma design exactly
 */

import { EditIcon, TrashIcon } from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/colors";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TaskEditModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
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
          {/* Edit Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <EditIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Edit Task</Text>
          </TouchableOpacity>

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <TrashIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Delete Task</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#1C1C1E",
  },
  cancelText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default TaskEditModal;
