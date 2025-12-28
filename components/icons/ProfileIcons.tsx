/**
 * Profile Icons
 * Icons specific to Profile screen
 * Using custom SVG files from assets/svg
 */

import React from 'react';

// Import SVG files
import LockSVG from '@/assets/svg/lock.svg';
import NotificationSVG from '@/assets/svg/notification.svg';
import FilledNotificationSVG from '@/assets/svg/filled-notification.svg';
import GlobalSVG from '@/assets/svg/global.svg';
import ReferSVG from '@/assets/svg/refer.svg';
import UpgradeSVG from '@/assets/svg/upgrade.svg';
import SecuritySVG from '@/assets/svg/security.svg';
import HelpSVG from '@/assets/svg/message-question.svg';
import LogoutSVG from '@/assets/svg/logout.svg';
import ThreeDotSVG from '@/assets/svg/three-dot.svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Notification Bell (Filled)
export const NotificationFilledIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <FilledNotificationSVG width={size} height={size} color={color} fill={color} />
);

// Notification Bell (Outline)
export const NotificationOutlineIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <NotificationSVG width={size} height={size} color={color} stroke={color} />
);

// Three Dots (Horizontal)
export const ThreeDotsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <ThreeDotSVG width={size} height={size} color={color} fill={color} />
);

// Lock / Change Password
export const LockIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <LockSVG width={size} height={size} color={color} stroke={color} />
);

// Globe / Language
export const GlobeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <GlobalSVG width={size} height={size} color={color} stroke={color} />
);

// Refer Friends
export const ReferIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <ReferSVG width={size} height={size} color={color} fill={color} />
);

// Upgrade Plan
export const UpgradeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <UpgradeSVG width={size} height={size} color={color} fill={color} />
);

// Shield / Security / Legal
export const ShieldIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <SecuritySVG width={size} height={size} color={color} stroke={color} />
);

// Message Question / Help & Support
export const HelpIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => (
  <HelpSVG width={size} height={size} color={color} stroke={color} />
);

// Logout
export const LogoutIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#E50000'
}) => (
  <LogoutSVG width={size} height={size} color={color} stroke={color} />
);
