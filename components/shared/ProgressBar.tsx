/**
 * ProgressBar Component
 * Reusable progress bar for displaying completion, stats, and metrics
 * Supports label, percentage display, gradient fills, and animations
 */

import { Colors } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ProgressBarProps {
  // Required
  progress: number; // 0-100

  // Optional - Display
  label?: string;
  showPercentage?: boolean;
  showLabel?: boolean;

  // Optional - Styling
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  progressColor?: string;
  useGradient?: boolean;
  gradientColors?: string[];
  containerStyle?: ViewStyle;
  barStyle?: ViewStyle;
  labelStyle?: TextStyle;
  percentageStyle?: TextStyle;

  // Optional - Animation
  animated?: boolean;
  animationDuration?: number;

  // Optional - Custom render
  renderLabel?: (progress: number) => React.ReactNode;
  renderPercentage?: (progress: number) => React.ReactNode;
}

/**
 * Reusable progress bar component
 * @param progress - Progress value (0-100)
 * @param label - Optional label text to display above/beside the bar
 * @param showPercentage - Show percentage text (default: true)
 * @param showLabel - Show label text (default: true if label is provided)
 * @param height - Height of the progress bar (default: 8)
 * @param borderRadius - Border radius of the bar (default: 100)
 * @param backgroundColor - Background color of unfilled portion (default: gray)
 * @param progressColor - Color of filled portion (default: primary purple)
 * @param useGradient - Use gradient for filled portion (default: true)
 * @param gradientColors - Custom gradient colors (default: primary gradient)
 * @param containerStyle - Additional styles for the container
 * @param barStyle - Additional styles for the bar
 * @param labelStyle - Additional styles for the label text
 * @param percentageStyle - Additional styles for the percentage text
 * @param animated - Enable animation (default: true)
 * @param animationDuration - Animation duration in ms (default: 500)
 * @param renderLabel - Custom render function for label
 * @param renderPercentage - Custom render function for percentage
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  showLabel = true,
  height = 8,
  borderRadius = 100,
  backgroundColor = "#3A3A3C",
  progressColor = Colors.primary,
  useGradient = true,
  gradientColors = [Colors.primaryVariants.dark, Colors.primaryVariants.light],
  containerStyle,
  barStyle,
  labelStyle,
  percentageStyle,
  animated = true,
  animationDuration = 500,
  renderLabel,
  renderPercentage,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Animated value for smooth progress changes
  const animatedWidth = useRef(new Animated.Value(clampedProgress)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animationDuration]);

  // Calculate width percentage for the progress fill
  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // Render label and percentage header
  const renderHeader = () => {
    const shouldShowLabel = showLabel && (label || renderLabel);
    const shouldShowPercentage = showPercentage || renderPercentage;

    if (!shouldShowLabel && !shouldShowPercentage) {
      return null;
    }

    return (
      <View style={styles.header}>
        {/* Label */}
        {shouldShowLabel && (
          <View style={styles.labelContainer}>
            {renderLabel ? (
              renderLabel(clampedProgress)
            ) : (
              <Text style={[styles.label, labelStyle]}>{label}</Text>
            )}
          </View>
        )}

        {/* Percentage */}
        {shouldShowPercentage && (
          <View style={styles.percentageContainer}>
            {renderPercentage ? (
              renderPercentage(clampedProgress)
            ) : (
              <Text style={[styles.percentage, percentageStyle]}>
                {Math.round(clampedProgress)}%
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header with label and percentage */}
      {renderHeader()}

      {/* Progress bar */}
      <View
        style={[
          styles.barBackground,
          {
            height,
            borderRadius,
            backgroundColor,
          },
          barStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            {
              width: progressWidth,
              borderRadius,
            },
          ]}
        >
          {useGradient ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.gradient,
                {
                  borderRadius,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.solidFill,
                {
                  backgroundColor: progressColor,
                  borderRadius,
                },
              ]}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.ui.text.primary,
  },
  percentageContainer: {
    marginLeft: 12,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.ui.text.primary,
  },
  barBackground: {
    width: "100%",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
  gradient: {
    height: "100%",
    width: "100%",
  },
  solidFill: {
    height: "100%",
    width: "100%",
  },
});

export default ProgressBar;
