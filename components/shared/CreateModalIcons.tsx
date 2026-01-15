/**
 * Create Modal Icons
 * Reusable SVG icons for create options
 * Exported separately for easy importing
 */

import { Colors } from "@/constants/colors";
import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// Task Icon
export const TaskIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = Colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="8"
      height="8"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M14 5H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M14 9H18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Rect
      x="3"
      y="14"
      width="8"
      height="8"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M14 16H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M14 20H18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Goal Icon - Target/Bullseye
export const GoalIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = Colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Note Icon - Document/Page
export const NoteIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = Colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M9 9H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 14H18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 19H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Project Icon - Briefcase/Folder
export const ProjectIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = Colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M3 8H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M7 5V8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M17 5V8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Milestone Icon - Flag/Banner
export const MilestoneIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = Colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15 8H21V16H3V8H9L12 2Z"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 12V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Reminder Icon - Bell/Clock
export const ReminderIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = Colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 2H16M5 6H19C20.1 6 21 6.9 21 8V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6Z"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 11V15" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 15L15 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
