/**
 * Task Header Options Bottom Sheet Component
 * Options modal for task list header (3-dot menu)
 * Shows Reports option like Habits feature
 */

import { ChartIcon, FocusLineIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TaskHeaderOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onViewReports: () => void;
  onViewFocusHistory?: () => void;
}

export const TaskHeaderOptionsSheet: React.FC<TaskHeaderOptionsSheetProps> = ({
  visible,
  onClose,
  onViewReports,
  onViewFocusHistory,
}) => {
  const insets = useSafeAreaInsets();

  const handleViewReports = () => {
    onViewReports();
    onClose();
  };

  const handleViewFocusHistory = () => {
    if (onViewFocusHistory) {
      onViewFocusHistory();
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
          {/* View Reports Option */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleViewReports}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <ChartIcon size={22} color={Colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionText}>Task Progress</Text>
              <Text style={styles.optionSubtext}>
                View analytics & productivity reports
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Focus History Option */}
          {onViewFocusHistory && (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleViewFocusHistory}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <FocusLineIcon size={22} color="#3B82F6" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Focus History</Text>
                <Text style={styles.optionSubtext}>
                  View past focus sessions
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 13,
    color: "#8E8E93",
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3C",
    marginHorizontal: 16,
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

export default TaskHeaderOptionsSheet;
