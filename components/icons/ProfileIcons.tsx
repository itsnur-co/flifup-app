/**
 * Profile Icons
 * Icons specific to Profile screen
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Notification Bell (Filled)
export const NotificationFilledIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z"
      fill={color}
    />
    <Path
      d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z"
      fill={color}
    />
  </Svg>
);

// Notification Bell (Outline)
export const NotificationOutlineIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.02 2.91016C8.70997 2.91016 6.01997 5.60016 6.01997 8.91016V11.8002C6.01997 12.4102 5.75997 13.3402 5.44997 13.8602L4.29997 15.7702C3.58997 16.9502 4.07997 18.2602 5.37997 18.7002C9.68997 20.1402 14.34 20.1402 18.65 18.7002C19.86 18.3002 20.39 16.8702 19.73 15.7702L18.58 13.8602C18.28 13.3402 18.02 12.4102 18.02 11.8002V8.91016C18.02 5.61016 15.32 2.91016 12.02 2.91016Z"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
    />
    <Path
      d="M13.87 3.20043C13.56 3.11043 13.24 3.04043 12.91 3.00043C11.95 2.88043 11.03 2.95043 10.17 3.20043C10.46 2.46043 11.18 1.94043 12.02 1.94043C12.86 1.94043 13.58 2.46043 13.87 3.20043Z"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.02 19.0596C15.02 20.7096 13.67 22.0596 12.02 22.0596C11.2 22.0596 10.44 21.7196 9.90002 21.1796C9.36002 20.6396 9.02002 19.8796 9.02002 19.0596"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
    />
  </Svg>
);

// Three Dots (Horizontal)
export const ThreeDotsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="5" cy="12" r="2" fill={color} />
    <Circle cx="12" cy="12" r="2" fill={color} />
    <Circle cx="19" cy="12" r="2" fill={color} />
  </Svg>
);

// Lock / Change Password
export const LockIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.9965 16H16.0054"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9955 16H12.0045"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.99451 16H8.00349"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Globe / Language
export const GlobeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.0001 3H9.0001C7.0501 8.84 7.0501 15.16 9.0001 21H8.0001"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 3C16.95 8.84 16.95 15.16 15 21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 8.99961C8.84 7.04961 15.16 7.04961 21 8.99961"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Refer Friends
export const ReferIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 21" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.75 0C9.12665 0 7 2.12665 7 4.75C7 7.37335 9.12665 9.5 11.75 9.5C14.3734 9.5 16.5 7.37335 16.5 4.75C16.5 2.12665 14.3734 0 11.75 0ZM8.5 4.75C8.5 2.95507 9.95507 1.5 11.75 1.5C13.5449 1.5 15 2.95507 15 4.75C15 6.54493 13.5449 8 11.75 8C9.95507 8 8.5 6.54493 8.5 4.75Z"
      fill={color}
    />
    <Path
      d="M17.75 2C17.3358 2 17 2.33579 17 2.75C17 3.16421 17.3358 3.5 17.75 3.5C19.1265 3.5 20 4.40573 20 5.25C20 6.09427 19.1265 7 17.75 7C17.3358 7 17 7.33579 17 7.75C17 8.16421 17.3358 8.5 17.75 8.5C19.6872 8.5 21.5 7.16715 21.5 5.25C21.5 3.33285 19.6872 2 17.75 2Z"
      fill={color}
    />
    <Path
      d="M6.5 2.75C6.5 2.33579 6.16421 2 5.75 2C3.81278 2 2 3.33285 2 5.25C2 7.16715 3.81278 8.5 5.75 8.5C6.16421 8.5 6.5 8.16421 6.5 7.75C6.5 7.33579 6.16421 7 5.75 7C4.37351 7 3.5 6.09427 3.5 5.25C3.5 4.40573 4.37351 3.5 5.75 3.5C6.16421 3.5 6.5 3.16421 6.5 2.75Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.75 11C9.96573 11 8.31645 11.4808 7.09133 12.2975C5.87146 13.1108 5 14.3166 5 15.75C5 17.1834 5.87146 18.3892 7.09133 19.2025C8.31645 20.0192 9.96573 20.5 11.75 20.5C13.5343 20.5 15.1835 20.0192 16.4087 19.2025C17.6285 18.3892 18.5 17.1834 18.5 15.75C18.5 14.3166 17.6285 13.1108 16.4087 12.2975C15.1835 11.4808 13.5343 11 11.75 11ZM6.5 15.75C6.5 14.9742 6.97169 14.1801 7.92338 13.5456C8.86984 12.9146 10.2206 12.5 11.75 12.5C13.2794 12.5 14.6302 12.9146 15.5766 13.5456C16.5283 14.1801 17 14.9742 17 15.75C17 16.5258 16.5283 17.3199 15.5766 17.9544C14.6302 18.5854 13.2794 19 11.75 19C10.2206 19 8.86984 18.5854 7.92338 17.9544C6.97169 17.3199 6.5 16.5258 6.5 15.75Z"
      fill={color}
    />
    <Path
      d="M19.0174 12.5893C19.1061 12.1847 19.5061 11.9287 19.9107 12.0174C20.8725 12.2283 21.7393 12.6093 22.3828 13.1359C23.0258 13.662 23.5 14.3852 23.5 15.25C23.5 16.1148 23.0258 16.838 22.3828 17.3641C21.7393 17.8907 20.8725 18.2717 19.9107 18.4826C19.5061 18.5713 19.1061 18.3153 19.0174 17.9107C18.9287 17.5061 19.1847 17.1061 19.5893 17.0174C20.3817 16.8436 21.0149 16.5452 21.4329 16.2032C21.8514 15.8608 22 15.5263 22 15.25C22 14.9737 21.8514 14.6392 21.4329 14.2968C21.0149 13.9548 20.3817 13.6564 19.5893 13.4826C19.1847 13.3939 18.9287 12.9939 19.0174 12.5893Z"
      fill={color}
    />
    <Path
      d="M3.58935 12.0174C3.99395 11.9287 4.39387 12.1847 4.48259 12.5893C4.57132 12.9939 4.31525 13.3939 3.91065 13.4826C3.11829 13.6564 2.48505 13.9548 2.06712 14.2968C1.64863 14.6392 1.5 14.9737 1.5 15.25C1.5 15.5263 1.64863 15.8608 2.06712 16.2032C2.48505 16.5452 3.11829 16.8436 3.91065 17.0174C4.31525 17.1061 4.57132 17.5061 4.48259 17.9107C4.39387 18.3153 3.99395 18.5713 3.58935 18.4826C2.62746 18.2717 1.7607 17.8907 1.11719 17.3641C0.474248 16.838 0 16.1148 0 15.25C0 14.3852 0.474248 13.662 1.11719 13.1359C1.7607 12.6093 2.62746 12.2283 3.58935 12.0174Z"
      fill={color}
    />
  </Svg>
);

// Upgrade Plan
export const UpgradeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12C4 16.4183 7.58172 20 12 20C14.7485 20 17.1746 18.6137 18.6152 16.5H16V14.5H22V20.5H20V18.001C18.1762 20.4286 15.2723 22 12 22C6.47715 22 2 17.5228 2 12H4ZM11.5293 8.31934C11.7059 7.8935 12.2943 7.89349 12.4707 8.31934L12.7236 8.93066C13.1556 9.97346 13.9615 10.8062 14.9746 11.2568L15.6924 11.5762C16.1026 11.759 16.1026 12.3562 15.6924 12.5391L14.9326 12.877C13.9449 13.3162 13.1534 14.1194 12.7139 15.1279L12.4668 15.6934C12.2864 16.1075 11.7137 16.1075 11.5332 15.6934L11.2871 15.1279C10.8476 14.1193 10.0552 13.3163 9.06738 12.877L8.30762 12.5391C7.89744 12.3562 7.89741 11.759 8.30762 11.5762L9.02539 11.2568C10.0385 10.8062 10.8445 9.97348 11.2764 8.93066L11.5293 8.31934ZM12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4C9.25151 4 6.82543 5.38634 5.38477 7.5H8V9.5H2V3.5H4V5.99902C5.82382 3.57144 8.72774 2 12 2Z"
      fill={color}
    />
  </Svg>
);

// Shield / Security / Legal
export const ShieldIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.9101 11.1203C20.9101 16.0103 17.3601 20.5903 12.5101 21.9303C12.1801 22.0203 11.8201 22.0203 11.4901 21.9303C6.64008 20.5903 3.09009 16.0103 3.09009 11.1203V6.73028C3.09009 5.91028 3.7101 4.98028 4.4801 4.67028L10.0501 2.39031C11.3001 1.88031 12.7101 1.88031 13.9601 2.39031L19.5301 4.67028C20.2901 4.98028 20.9201 5.91028 20.9201 6.73028L20.9101 11.1203Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Message Question / Help & Support
export const HelpIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 18.4297H13L8.54999 21.3897C7.88999 21.8297 7 21.3598 7 20.5598V18.4297C4 18.4297 2 16.4297 2 13.4297V7.42969C2 4.42969 4 2.42969 7 2.42969H17C20 2.42969 22 4.42969 22 7.42969V13.4297C22 16.4297 20 18.4297 17 18.4297Z"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.0001 11.3604V11.1504C12.0001 10.4704 12.4201 10.1104 12.8401 9.82037C13.2501 9.54037 13.66 9.18039 13.66 8.52039C13.66 7.60039 12.9201 6.86035 12.0001 6.86035C11.0801 6.86035 10.3401 7.60039 10.3401 8.52039"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9955 13.75H12.0045"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Logout
export const LogoutIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = '#E50000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.1001 7.56023C14.7901 3.96023 12.9401 2.49023 8.8901 2.49023H8.7601C4.2901 2.49023 2.5001 4.28023 2.5001 8.75023V15.2702C2.5001 19.7402 4.2901 21.5302 8.7601 21.5302H8.8901C12.9101 21.5302 14.7601 20.0802 15.0901 16.5402"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.99988 12H20.3799"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.15 8.65039L21.5 12.0004L18.15 15.3504"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
