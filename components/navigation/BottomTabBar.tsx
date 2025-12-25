/**
 * Bottom Tab Bar Component
 * Custom bottom navigation with centered add button
 * Matches Figma design exactly
 */

import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// ============================================
// ICONS
// ============================================

// Home Icon
const HomeIcon: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
}> = ({ size = 24, color = "#6B7280", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z"
        fill={color}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);

// Tasks Icon (Checkbox with lines)
const TasksIcon: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
}> = ({ size = 24, color = "#6B7280", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="8"
      height="8"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill={filled ? color : "none"}
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
      fill={filled ? color : "none"}
    />
    <Path d="M14 16H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M14 20H18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Habits Icon (Stacked layers)
const HabitsIcon: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
}> = ({ size = 24, color = "#6B7280", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Profile Icon
const ProfileIcon: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
}> = ({ size = 24, color = "#6B7280", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth={2}
      fill={filled ? color : "none"}
    />
    <Path
      d="M4 20C4 17 7.5 14 12 14C16.5 14 20 17 20 20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

// Plus Icon
const PlusIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 12H19"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============================================
// TYPES
// ============================================

export type TabName = "home" | "tasks" | "habits" | "profile";

interface TabItem {
  name: TabName;
  label: string;
  icon: React.FC<{ size?: number; color?: string; filled?: boolean }>;
}

interface BottomTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onAddPress?: () => void;
}

// ============================================
// TAB DATA
// ============================================

const TABS: TabItem[] = [
  { name: "home", label: "Home", icon: HomeIcon },
  { name: "tasks", label: "Tasks", icon: TasksIcon },
  { name: "habits", label: "Habits", icon: HabitsIcon },
  { name: "profile", label: "Profile", icon: ProfileIcon },
];

// ============================================
// COMPONENT
// ============================================

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
  onAddPress,
}) => {
  const insets = useSafeAreaInsets();

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.name;
    const Icon = tab.icon;

    // Insert Add Button after second tab (between tasks and habits)
    const showAddButtonAfter = index === 1;

    return (
      <React.Fragment key={tab.name}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress(tab.name)}
          activeOpacity={0.7}
        >
          {isActive ? (
            <View style={styles.activeIconContainer}>
              <Icon size={22} color="#FFFFFF" filled />
            </View>
          ) : (
            <View style={styles.inactiveIconContainer}>
              <Icon size={22} color="#6B7280" />
            </View>
          )}
        </TouchableOpacity>

        {/* Center Add Button */}
        {showAddButtonAfter && (
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, "#6C2BBF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <PlusIcon size={28} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
      ]}
    >
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => renderTab(tab, index))}
      </View>

      {/* Home Indicator Line */}
      {Platform.OS === "ios" && insets.bottom > 0 && (
        <View style={styles.homeIndicator} />
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1C1C1E",
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inactiveIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonContainer: {
    marginTop: 0,
    marginHorizontal: 8,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 8,
  },
});

export default BottomTabBar;
