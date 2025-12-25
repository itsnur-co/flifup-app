/**
 * Habit Options Bottom Sheet
 * Edit, Progress, Delete options for individual habit
 */

import { ChartIcon } from "@/components/icons/HabitIcons";
import { EditIcon, TrashIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Habit } from "@/types/habit";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HabitOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit | null;
  onEdit: (habit: Habit) => void;
  onProgress: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export const HabitOptionsSheet: React.FC<HabitOptionsSheetProps> = ({
  visible,
  onClose,
  habit,
  onEdit,
  onProgress,
  onDelete,
}) => {
  const insets = useSafeAreaInsets();

  if (!habit) return null;

  const handleEdit = () => {
    onEdit(habit);
    onClose();
  };

  const handleProgress = () => {
    onProgress(habit);
    onClose();
  };

  const handleDelete = () => {
    onDelete(habit);
    onClose();
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
          {/* Edit Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <EditIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Edit Habit</Text>
          </TouchableOpacity>

          <View style={styles.dividerInner} />

          {/* Progress Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleProgress}
            activeOpacity={0.7}
          >
            <ChartIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Progress</Text>
          </TouchableOpacity>

          <View style={styles.dividerInner} />

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <TrashIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Delete Habit</Text>
          </TouchableOpacity>
        </View>

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
  dividerInner: {
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

export default HabitOptionsSheet;
