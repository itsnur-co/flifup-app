/**
 * Set Focus Duration Bottom Sheet Component
 * Select initial duration before starting focus session
 * Quick preset options + custom duration picker
 */

import { ClockIcon, FocusIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SetFocusDurationSheetProps {
  visible: boolean;
  onClose: () => void;
  onStart: (durationMinutes: number) => void;
  taskTitle: string;
}

// Preset durations in minutes
const PRESET_DURATIONS = [
  { minutes: 5, label: "5 min" },
  { minutes: 10, label: "10 min" },
  { minutes: 15, label: "15 min" },
  { minutes: 25, label: "25 min" },
  { minutes: 30, label: "30 min" },
  { minutes: 45, label: "45 min" },
  { minutes: 60, label: "1 hour" },
  { minutes: 90, label: "1.5 hours" },
  { minutes: 120, label: "2 hours" },
];

export const SetFocusDurationSheet: React.FC<SetFocusDurationSheetProps> = ({
  visible,
  onClose,
  onStart,
  taskTitle,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedDuration, setSelectedDuration] = useState(10); // Default 10 minutes

  const handleStart = () => {
    onStart(selectedDuration);
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
        {/* Header */}
        <View style={styles.header}>
          <FocusIcon size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>Set Focus</Text>
        </View>

        <View style={styles.divider} />

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskLabel}>Focus on:</Text>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {taskTitle}
          </Text>
        </View>

        {/* Duration Selection */}
        <View style={styles.durationSection}>
          <Text style={styles.sectionTitle}>Select Duration</Text>

          <View style={styles.presetsGrid}>
            {PRESET_DURATIONS.map((preset) => (
              <TouchableOpacity
                key={preset.minutes}
                style={[
                  styles.presetButton,
                  selectedDuration === preset.minutes &&
                    styles.presetButtonSelected,
                ]}
                onPress={() => setSelectedDuration(preset.minutes)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.presetText,
                    selectedDuration === preset.minutes &&
                      styles.presetTextSelected,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Duration Display */}
        <View style={styles.selectedDisplay}>
          <ClockIcon size={20} color={Colors.primary} />
          <Text style={styles.selectedText}>
            Focus for{" "}
            <Text style={styles.selectedDuration}>
              {selectedDuration} minutes
            </Text>
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Focus Session</Text>
        </TouchableOpacity>

        {/* Cancel */}
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
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginBottom: 16,
  },
  taskInfo: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  taskLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  durationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  presetButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 70,
    alignItems: "center",
  },
  presetButtonSelected: {
    backgroundColor: Colors.primary,
  },
  presetText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  presetTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  selectedDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
  selectedDuration: {
    fontWeight: "700",
    color: Colors.primary,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default SetFocusDurationSheet;
