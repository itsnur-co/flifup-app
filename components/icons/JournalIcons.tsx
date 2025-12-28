/**
 * Custom SVG Icons for Journal Feature
 * Matching Figma design exactly
 */

import React from "react";
import Svg, { Circle, Path, Rect, Line } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

// Journal/Book icon
export const JournalIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Insight/Chart icon
export const InsightIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 20V10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20V4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 20V14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Lock icon for privacy
export const LockIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Globe icon for shared
export const GlobeIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M2 12H22" stroke={color} strokeWidth="2" />
    <Path
      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

// Text/Lines icon for description
export const TextIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 18H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Mood/Smile icon
export const MoodIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path
      d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="9" y1="9" x2="9.01" y2="9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="15" y1="9" x2="15.01" y2="9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// Filter icon
export const FilterIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Dropdown arrow icon
export const DropdownIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Circle checkbox icon (outline)
export const CircleOutlineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
  </Svg>
);

// X/Close icon
export const CloseIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default {
  JournalIcon,
  InsightIcon,
  LockIcon,
  GlobeIcon,
  TextIcon,
  MoodIcon,
  FilterIcon,
  DropdownIcon,
  CircleOutlineIcon,
  CloseIcon,
};
