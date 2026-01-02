/**
 * Custom SVG Icons for Task Feature
 * Matching Figma design exactly
 * Includes both inline SVG and imported SVG file icons
 */

import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// Import SVG files from assets
import AddLineSVG from "@/assets/svg/add-line.svg";
import AlarmLineSVG from "@/assets/svg/alarm-line.svg";
import AlignLeftSVG from "@/assets/svg/align-left.svg";
import CalendarLineSVG from "@/assets/svg/calendar-line.svg";
import Calendar2LineSVG from "@/assets/svg/calendar-2-line.svg";
import DeleteBinSVG from "@/assets/svg/delete-bin-line.svg";
import DotSVG from "@/assets/svg/dot.svg";
import EditLineSVG from "@/assets/svg/edit-line.svg";
import FlagSVG from "@/assets/svg/flag.svg";
import FocusSVG from "@/assets/svg/focus-2-line.svg";
import FocusWhiteSVG from "@/assets/svg/focus-white-icon.svg";
import LaterWeekSVG from "@/assets/svg/later-week.svg";
import NextSVG from "@/assets/svg/next.svg";
import NotificationSVG from "@/assets/svg/notification.svg";
import PauseSVG from "@/assets/svg/pause.svg";
import PriceTagSVG from "@/assets/svg/price-tag-3-line.svg";
import RepeatSVG from "@/assets/svg/repeat.svg";
import RoadLineSVG from "@/assets/svg/road-line.svg";
import SofaLineSVG from "@/assets/svg/sofa-line.svg";
import StopSVG from "@/assets/svg/stop.svg";
import SunSVG from "@/assets/svg/sun.svg";
import ThreeDotSVG from "@/assets/svg/three-dot.svg";
import TimeLineSVG from "@/assets/svg/time-line.svg";
import TimerSVG from "@/assets/svg/timer.svg";
import UserAddLineSVG from "@/assets/svg/user-add-line (1).svg";

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

// Edit/Pencil icon (from SVG file)
export const EditIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => <EditLineSVG width={size} height={size} fill={color} />;

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

// Focus/Timer icon
export const FocusIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Focus White icon (from SVG file) - concentric circles target icon
export const FocusWhiteIcon: React.FC<IconProps> = ({
  size = 20,
  color = "#FFFFFF",
}) => <FocusWhiteSVG width={size} height={size} fill={color} />;

// Pause icon
export const PauseIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="4" width="4" height="16" rx="1" fill={color} />
    <Rect x="14" y="4" width="4" height="16" rx="1" fill={color} />
  </Svg>
);

// Play icon
export const PlayIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5.14v13.72c0 .93 1.02 1.52 1.83 1.06l11.1-6.86c.79-.49.79-1.63 0-2.12L9.83 4.08C9.02 3.62 8 4.21 8 5.14z"
      fill={color}
    />
  </Svg>
);

// Stop icon (inline)
export const StopIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="6" width="12" height="12" rx="2" fill={color} />
  </Svg>
);

// Pause icon (from SVG file)
export const PauseLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => <PauseSVG width={size} height={size} fill={color} />;

// Stop icon (from SVG file)
export const StopLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => <StopSVG width={size} height={size} fill={color} />;

// Timer icon (from SVG file)
export const TimerLineIcon: React.FC<IconProps> = ({
  size = 20,
  color = "#FFFFFF",
}) => <TimerSVG width={size} height={size} fill={color} />;

// Chart/Report icon
export const ChartIcon: React.FC<IconProps> = ({
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

// Trophy icon
export const TrophyIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#F59E0B",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4.5C3.67157 9 3 8.32843 3 7.5V6C3 5.17157 3.67157 4.5 4.5 4.5H6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 9H19.5C20.3284 9 21 8.32843 21 7.5V6C21 5.17157 20.3284 4.5 19.5 4.5H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 4.5H18V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 17V20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 20H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Target/Goal icon
export const TargetIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Flame icon
export const FlameIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#F59E0B",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C12 2 7 8 7 13C7 15.6522 8.05357 17 9.5 18.5C10.5 19.5 12 20 12 20C12 20 13.5 19.5 14.5 18.5C15.9464 17 17 15.6522 17 13C17 8 12 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20C12 20 10 18 10 16C10 14 12 12 12 12C12 12 14 14 14 16C14 18 12 20 12 20Z"
      fill={color}
    />
  </Svg>
);

// Close/X icon
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

// Back Arrow icon
export const BackIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// More Vertical icon
export const MoreVerticalIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="18" r="1.5" fill={color} />
  </Svg>
);

// Undo/Revert icon
export const UndoIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7V13H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 17C21 15.1435 20.2625 13.363 18.9497 12.0503C17.637 10.7375 15.8565 10 14 10H3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============================================
// SVG File-Based Icons
// Icons imported from assets/svg folder
// ============================================

// Alarm/Bell icon (from SVG file)
export const AlarmLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <AlarmLineSVG width={size} height={size} fill={color} />;

// Calendar icon (from SVG file)
export const CalendarLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <CalendarLineSVG width={size} height={size} fill={color} />;

// Time/Clock icon (from SVG file)
export const TimeLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <TimeLineSVG width={size} height={size} fill={color} />;

// Price Tag icon (from SVG file)
export const PriceTagLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <PriceTagSVG width={size} height={size} fill={color} />;

// Align Left / Description icon (from SVG file)
export const AlignLeftIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <AlignLeftSVG width={size} height={size} fill={color} />;

// Delete/Trash icon (from SVG file)
export const DeleteBinIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => <DeleteBinSVG width={size} height={size} fill={color} />;

// Add/Plus icon (from SVG file)
export const AddLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <AddLineSVG width={size} height={size} fill={color} />;

// Sun icon (from SVG file)
export const SunLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#F59E0B",
}) => <SunSVG width={size} height={size} fill={color} />;

// Sofa/Couch icon (from SVG file)
export const SofaLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#3B82F6",
}) => <SofaLineSVG width={size} height={size} fill={color} />;

// Next/Arrow Right icon (from SVG file)
export const NextIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <NextSVG width={size} height={size} fill={color} />;

// Focus/Timer icon (from SVG file)
export const FocusLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <FocusSVG width={size} height={size} fill={color} />;

// Three Dots / More icon (from SVG file)
export const ThreeDotIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => <ThreeDotSVG width={size} height={size} fill={color} />;

// Flag/Priority icon (from SVG file)
export const FlagIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <FlagSVG width={size} height={size} fill={color} />;

// Later This Week icon (from SVG file)
export const LaterWeekIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <LaterWeekSVG width={size} height={size} fill={color} />;

// Notification icon (from SVG file)
export const NotificationLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#FFFFFF",
}) => <NotificationSVG width={size} height={size} stroke={color} />;

// User Add / People icon (from SVG file)
export const UserAddLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <UserAddLineSVG width={size} height={size} fill={color} />;

// Dot / Circle icon (from SVG file)
export const DotIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <DotSVG width={size} height={size} fill={color} />;

// Road icon (from SVG file)
export const RoadLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <RoadLineSVG width={size} height={size} fill={color} />;

// Repeat icon (from SVG file)
export const RepeatLineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <RepeatSVG width={size} height={size} fill={color} />;

// Calendar 2 icon (from SVG file)
export const Calendar2LineIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => <Calendar2LineSVG width={size} height={size} fill={color} />;

export default {
  // Inline SVG Icons
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
  FocusIcon,
  FocusWhiteIcon,
  PauseIcon,
  PauseLineIcon,
  PlayIcon,
  StopIcon,
  StopLineIcon,
  TimerLineIcon,
  ChartIcon,
  TrophyIcon,
  TargetIcon,
  FlameIcon,
  CloseIcon,
  BackIcon,
  MoreVerticalIcon,
  UndoIcon,
  // SVG File Icons
  AlarmLineIcon,
  CalendarLineIcon,
  Calendar2LineIcon,
  TimeLineIcon,
  PriceTagLineIcon,
  AlignLeftIcon,
  DeleteBinIcon,
  AddLineIcon,
  SunLineIcon,
  SofaLineIcon,
  NextIcon,
  FocusLineIcon,
  ThreeDotIcon,
  FlagIcon,
  LaterWeekIcon,
  NotificationLineIcon,
  UserAddLineIcon,
  DotIcon,
  RoadLineIcon,
  RepeatLineIcon,
};
