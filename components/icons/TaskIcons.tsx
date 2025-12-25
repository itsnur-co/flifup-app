/**
 * Custom SVG Icons for Task Feature
 * Matching Figma design exactly
 */

import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

// Circle checkbox (unchecked) - rounded square
export const CircleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

// Circle checkbox (checked) - rounded square filled
export const CircleCheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="6" fill={color} />
    <Path
      d="M8 12L11 15L16 9"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Description lines icon
export const DescriptionIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 18H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Calendar icon
export const CalendarIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M3 10H21" stroke={color} strokeWidth="2" />
  </Svg>
);

// Clock/Time icon
export const ClockIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M12 7V12L15 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tag/Category icon
export const TagIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="7" cy="7" r="1.5" fill={color} />
  </Svg>
);

// People/Users icon
export const PeopleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="9"
      cy="7"
      r="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Bell/Reminder icon
export const BellIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Plus icon
export const PlusIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sun icon (for tomorrow)
export const SunIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#F59E0B",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Path d="M12 1V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 21V23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M4.22 4.22L5.64 5.64"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.36 18.36L19.78 19.78"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M1 12H3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M21 12H23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M4.22 19.78L5.64 18.36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.36 5.64L19.78 4.22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Square icon (for later this week)
export const SquareIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

// Couch icon (for weekend)
export const CouchIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#3B82F6",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 11V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 11H21V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M5 18V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M19 18V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Arrow right icon (for next week)
export const ArrowRightIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 5L19 12L12 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Minus circle icon (for no date)
export const MinusCircleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#6B7280",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Calendar plus icon (for custom date)
export const CalendarPlusIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#F97316",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M3 10H21" stroke={color} strokeWidth="2" />
    <Path d="M12 14V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 16H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Edit/Pencil icon
export const EditIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Trash icon
export const TrashIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H5H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 11V17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 11V17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// More horizontal (three dots) icon
export const MoreHorizontalIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="6" cy="12" r="1.5" fill={color} />
    <Circle cx="18" cy="12" r="1.5" fill={color} />
  </Svg>
);

// Chevron down icon
export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
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

// Search icon
export const SearchIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#6B7280",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Check icon
export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default {
  CircleIcon,
  CircleCheckIcon,
  DescriptionIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  PeopleIcon,
  BellIcon,
  PlusIcon,
  SunIcon,
  SquareIcon,
  CouchIcon,
  ArrowRightIcon,
  MinusCircleIcon,
  CalendarPlusIcon,
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
  ChevronDownIcon,
  SearchIcon,
  CheckIcon,
};
