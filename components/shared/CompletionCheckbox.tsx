/**
 * Completion Checkbox Component
 * Reusable checkbox for tasks, habits, and other completable items
 * Uses white-checkmark.svg for the completed state
 */

import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

interface CompletionCheckboxProps {
  isCompleted: boolean;
  onToggle: () => void;
  size?: number;
  completedColor?: string;
  uncompletedColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * Reusable completion checkbox
 * @param isCompleted - Whether the item is completed
 * @param onToggle - Callback when checkbox is pressed
 * @param size - Size of the checkbox (default: 24)
 * @param completedColor - Color when completed (default: primary purple)
 * @param uncompletedColor - Color when uncompleted (default: gray)
 * @param style - Additional styles for the container
 * @param disabled - Whether the checkbox is disabled
 */
export const CompletionCheckbox: React.FC<CompletionCheckboxProps> = ({
  isCompleted,
  onToggle,
  size = 24,
  completedColor = Colors.primary,
  uncompletedColor = "#3A3A3C",
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      {isCompleted ? (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="6"
            fill={completedColor}
          />
          <Path
            d="M8 12L11 15L16 9"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="6"
            stroke={uncompletedColor}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CompletionCheckbox;
