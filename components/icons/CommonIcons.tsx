// chevronRightIcon

import React from "react";
import Svg, { Path } from "react-native-svg";

interface ChevronIconProps {
  size?: number;
  color?: string;
}

export const ChevronRightIcon: React.FC<ChevronIconProps> = ({
  size = 24,
  color = "#000000",
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ChevronLeftIcon: React.FC<ChevronIconProps> = ({
  size = 24,
  color = "#000000",
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
