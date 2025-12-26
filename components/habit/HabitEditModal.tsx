/**
 * Habit Edit Modal Component
 * Edit/Progress/Delete options modal for habit 3-dot menu
 * Matches Figma design exactly
 */

import { ChartIcon } from "@/components/icons/HabitIcons";
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

interface HabitEditModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onProgress: () => void;
  onDelete: () => void;
}

export const HabitEditModal: React.FC<HabitEditModalProps> = ({
  visible,
  onClose,
  onEdit,
  onProgress,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleProgress = () => {
    onProgress();
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
            <Text style={styles.optionText}>Edit Habit</Text>
          </TouchableOpacity>

          {/* Progress Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleProgress}
            activeOpacity={0.7}
          >
            <ChartIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Progress</Text>
          </TouchableOpacity>

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <TrashIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Delete Habit</Text>
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

export default HabitEditModal;
