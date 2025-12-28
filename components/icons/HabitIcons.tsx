/**
 * Habit-specific Icons
 * SVG icons for Habit feature matching Figma design
 * Using custom SVG files from assets/svg
 */

import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// Import custom SVG file
import RepeatLineSVG from '@/assets/svg/creative-commons-nd-line.svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Repeat Icon (circular arrows)
export const RepeatIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <RepeatLineSVG width={size} height={size} stroke={color} fill={color} />
);

// Goal/Target Icon
export const GoalIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Chart/Progress Icon
export const ChartIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="12"
      width="4"
      height="9"
      rx="1"
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x="10"
      y="8"
      width="4"
      height="13"
      rx="1"
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x="17"
      y="3"
      width="4"
      height="18"
      rx="1"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

// Alarm/Reminder Icon
export const AlarmIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth={2} />
    <Path
      d="M12 9V13L15 15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 3L2 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 3L22 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Duration/Time Icon (half circle with clock)
export const DurationIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#8E8E93",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Radio Button (unselected)
export const RadioUnselectedIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#3A3A3C",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
  </Svg>
);

// Radio Button (selected)
export const RadioSelectedIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Circle cx="12" cy="12" r="5" fill={color} />
  </Svg>
);

// Checkbox (rounded square - unselected)
export const CheckboxUnselectedIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#3A3A3C",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="4"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

// Checkbox (rounded square - selected)
export const CheckboxSelectedIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="4"
      fill={color}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M9 12L11 14L15 10"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
