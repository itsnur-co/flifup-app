/**
 * Task Options Bottom Sheet Component
 * Edit, Delete, Set Focus, and Reports options modal
 * Matches Figma design exactly
 */

import { ChartIcon, DeleteBinIcon, EditIcon, FocusLineIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Task } from "@/types/task";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

interface TaskOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onSetFocus?: (task: Task) => void;
  onViewReports?: () => void;
}

export const TaskOptionsSheet: React.FC<TaskOptionsSheetProps> = ({
  visible,
  onClose,
  task,
  onEdit,
  onDelete,
  onSetFocus,
  onViewReports,
}) => {
  const insets = useSafeAreaInsets();

  if (!task) return null;

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  const handleDelete = () => {
    onDelete(task);
    onClose();
  };

  const handleSetFocus = () => {
    if (onSetFocus) {
      onSetFocus(task);
      onClose();
    }
  };

  const handleViewReports = () => {
    if (onViewReports) {
      onViewReports();
      onClose();
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.95, 1]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* Set Focus Option */}
          {onSetFocus && task.status !== "COMPLETED" && (
            <>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleSetFocus}
                activeOpacity={0.7}
              >
                <FocusLineIcon size={22} color={Colors.primary} />
                <Text style={styles.optionText}>Set Focus</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}

          {/* Edit Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <EditIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Edit Task</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <DeleteBinIcon size={22} color="#EF4444" />
            <Text style={[styles.optionText, { color: "#EF4444" }]}>Delete Task</Text>
          </TouchableOpacity>
        </View>

        {/* Reports Option - Separate Section */}
        {onViewReports && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleViewReports}
              activeOpacity={0.7}
            >
              <ChartIcon size={22} color={Colors.primary} />
              <Text style={styles.optionText}>View Reports</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionsContainer: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 14,
  },
  optionText: {
    fontSize: 17,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3C",
    marginHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default TaskOptionsSheet;
