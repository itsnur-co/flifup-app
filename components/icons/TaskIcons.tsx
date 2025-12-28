/**
 * Custom SVG Icons for Task Feature
 * Matching Figma design exactly
 * Using custom SVG files from assets/svg
 */

import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// Import custom SVG files
import AddLineSVG from '@/assets/svg/add-line.svg';
import AlarmLineSVG from '@/assets/svg/alarm-line.svg';
import AlignLeftSVG from '@/assets/svg/align-left.svg';
import CalendarLineSVG from '@/assets/svg/calendar-line.svg';
import TimeLineSVG from '@/assets/svg/time-line.svg';
import PriceTagSVG from '@/assets/svg/price-tag-3-line.svg';
import UserAddSVG from '@/assets/svg/user-add-line (1).svg';
import SunSVG from '@/assets/svg/sun.svg';
import SofaLineSVG from '@/assets/svg/sofa-line.svg';
import NextSVG from '@/assets/svg/next.svg';
import LaterWeekSVG from '@/assets/svg/later-week.svg';
import DeleteBinSVG from '@/assets/svg/delete-bin-line.svg';
import SearchIconSVG from '@/assets/svg/search-icon.svg';
import WhiteCheckmarkSVG from '@/assets/svg/white-checkmark.svg';
import EllipseSVG from '@/assets/svg/Ellipse 2855.svg';
import RepeatLineSVG from '@/assets/svg/creative-commons-nd-line.svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Circle checkbox (unchecked) - rounded square
export const CircleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <EllipseSVG width={size} height={size} stroke={color} fill="none" />
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
  <AlignLeftSVG width={size} height={size} stroke={color} fill={color} />
);

// Calendar icon
export const CalendarIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <CalendarLineSVG width={size} height={size} stroke={color} fill={color} />
);

// Clock/Time icon
export const ClockIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <TimeLineSVG width={size} height={size} stroke={color} fill={color} />
);

// Tag/Category icon
export const TagIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <PriceTagSVG width={size} height={size} stroke={color} fill={color} />
);

// People/Users icon
export const PeopleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <UserAddSVG width={size} height={size} stroke={color} fill={color} />
);

// Bell/Reminder icon
export const BellIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <AlarmLineSVG width={size} height={size} stroke={color} fill={color} />
);

// Plus icon
export const PlusIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <AddLineSVG width={size} height={size} stroke={color} fill={color} />
);

// Sun icon (for tomorrow)
export const SunIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#F59E0B",
}) => (
  <SunSVG width={size} height={size} stroke={color} fill={color} />
);

// Square icon (for later this week)
export const SquareIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <LaterWeekSVG width={size} height={size} stroke={color} fill={color} />
);

// Couch icon (for weekend)
export const CouchIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#3B82F6",
}) => (
  <SofaLineSVG width={size} height={size} stroke={color} fill={color} />
);

// Arrow right icon (for next week)
export const ArrowRightIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <NextSVG width={size} height={size} stroke={color} fill={color} />
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
  <DeleteBinSVG width={size} height={size} stroke={color} fill={color} />
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
  <SearchIconSVG width={size} height={size} stroke={color} fill={color} />
);

// Check icon
export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#9039FF",
}) => (
  <WhiteCheckmarkSVG width={size} height={size} stroke={color} fill={color} />
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
