/**
 * Screen Header Component
 * Reusable header with gradient background and glassmorphism back button
 * Matches Figma design exactly
 */

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { DotIcon } from "../icons";

// Custom Chevron Left Icon (thinner stroke for elegance)
const ChevronLeftIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Custom More Horizontal Icon
const MoreHorizontalIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hideBackButton?: boolean;
  rightIcon?: React.ReactNode | "more-horizontal" | "none";
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  hideBackButton = false,
  rightIcon = "more-horizontal",
  onRightPress,
}) => {
  const insets = useSafeAreaInsets();

  const renderBackButton = () => {
    if (Platform.OS === "ios") {
      return (
        <BlurView intensity={25} tint="light" style={styles.blurContainer}>
          <View style={styles.blurOverlay}>
            <ChevronLeftIcon size={22} color="#FFFFFF" />
          </View>
        </BlurView>
      );
    }

    // Android fallback - semi-transparent background
    return (
      <View style={styles.androidBackButton}>
        <ChevronLeftIcon size={22} color="#FFFFFF" />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#9039FF", "#6C2BBF", "#1C1C1E"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top - 16 }]}
    >
      <View style={styles.content}>
        {/* Back Button */}
        {!hideBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            {renderBackButton()}
          </TouchableOpacity>
        )}

        {/* Title */}
        <View
          style={[
            styles.titleContainer,
            hideBackButton && styles.titleContainerLeft,
          ]}
        >
          <Text
            style={[styles.title, hideBackButton && styles.titleLeftAlign]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Button */}
        {rightIcon !== "none" && rightIcon !== undefined ? (
          typeof rightIcon === "string" && rightIcon === "more-horizontal" ? (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}
              activeOpacity={0.7}
            >
               <DotIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightButton}>{rightIcon}</View>
          )
        ) : !hideBackButton ? (
          <View style={styles.placeholder} />
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // Gradient handles the background
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  blurContainer: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
  },
  blurOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  androidBackButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 22,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainerLeft: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  titleLeftAlign: {
    textAlign: "left",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  rightButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 44,
    height: 44,
  },
});

export default ScreenHeader;
