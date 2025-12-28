/**
 * Journal Options Modal Component
 * Shows edit and delete options for a journal entry
 * Matches Habit and Task modal design
 */

import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { EditIcon, TrashIcon, PlusIcon } from "@/components/icons/TaskIcons";
import { InsightIcon } from "@/components/icons/JournalIcons";

interface JournalOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const JournalOptionsModal: React.FC<JournalOptionsModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit?.();
    onClose();
  };

  const handleDelete = () => {
    onDelete?.();
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
            <Text style={styles.optionText}>Edit Journal</Text>
          </TouchableOpacity>

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <TrashIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Delete Journal</Text>
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

interface HeaderOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddNew?: () => void;
  onInsights?: () => void;
}

export const JournalHeaderOptionsModal: React.FC<HeaderOptionsModalProps> = ({
  visible,
  onClose,
  onAddNew,
  onInsights,
}) => {
  const handleAddNew = () => {
    onAddNew?.();
    onClose();
  };

  const handleInsights = () => {
    onInsights?.();
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
          {/* Add New Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleAddNew}
            activeOpacity={0.7}
          >
            <PlusIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Add New Journal</Text>
          </TouchableOpacity>

          {/* Insights Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleInsights}
            activeOpacity={0.7}
          >
            <InsightIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Insights</Text>
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

export default JournalOptionsModal;
