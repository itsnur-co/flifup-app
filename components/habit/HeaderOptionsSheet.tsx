/**
 * Header Options Bottom Sheet
 * Add New Habit, Overall Progress options from header menu
 */

import { ChartIcon } from "@/components/icons/HabitIcons";
import { PlusIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddNewHabit: () => void;
  onOverallProgress: () => void;
}

export const HeaderOptionsSheet: React.FC<HeaderOptionsSheetProps> = ({
  visible,
  onClose,
  onAddNewHabit,
  onOverallProgress,
}) => {
  const insets = useSafeAreaInsets();

  const handleAddNew = () => {
    onClose();
    onAddNewHabit();
  };

  const handleProgress = () => {
    onClose();
    onOverallProgress();
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
          {/* Add New Habit */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleAddNew}
            activeOpacity={0.7}
          >
            <PlusIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Add New Habit</Text>
          </TouchableOpacity>

          <View style={styles.dividerInner} />

          {/* Overall Progress */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleProgress}
            activeOpacity={0.7}
          >
            <ChartIcon size={22} color="#FFFFFF" />
            <Text style={styles.optionText}>Overall Progress</Text>
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

export default HeaderOptionsSheet;
