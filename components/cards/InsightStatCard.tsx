/**
 * InsightStatCard Component
 * A reusable card for displaying task statistics
 * Used in Task Insight screen for Completed, In Progress, Created, Due stats
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";

type StatType = "completed" | "inProgress" | "created" | "due";

interface InsightStatCardProps {
  type: StatType;
  value: number;
  label: string;
  sublabel?: string;
  onPress?: () => void;
}

// Icons for each stat type
const StatIcon: React.FC<{ type: StatType; size?: number }> = ({ type, size = 24 }) => {
  switch (type) {
    case "completed":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            fill="#10B981"
            fillOpacity="0.2"
          />
          <Path
            d="M8 12L11 15L16 9"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "inProgress":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="12"
            cy="12"
            r="9"
            fill="#3B82F6"
            fillOpacity="0.2"
          />
          <Path
            d="M9 12L11 14L15 10"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 7V9"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );
    case "created":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="12"
            cy="12"
            r="9"
            fill="#9039FF"
            fillOpacity="0.2"
          />
          <Path
            d="M12 8V16M8 12H16"
            stroke="#9039FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );
    case "due":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="3"
            fill="#FF2C39"
            fillOpacity="0.2"
          />
          <Path
            d="M3 9H21"
            stroke="#FF2C39"
            strokeWidth="2"
          />
          <Path
            d="M8 3V6M16 3V6"
            stroke="#FF2C39"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Circle cx="12" cy="14" r="2" fill="#FF2C39" />
        </Svg>
      );
  }
};

// Colors for each stat type
const STAT_COLORS: Record<StatType, string> = {
  completed: "#10B981",
  inProgress: "#3B82F6",
  created: "#9039FF",
  due: "#FF2C39",
};

export const InsightStatCard: React.FC<InsightStatCardProps> = ({
  type,
  value,
  label,
  sublabel = "in the last 7 days",
  onPress,
}) => {
  const color = STAT_COLORS[type];

  const content = (
    <View style={styles.container}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <StatIcon type={type} />
      </View>

      {/* Value */}
      <Text style={[styles.value, { color }]}>{value} {label}</Text>

      {/* Sublabel */}
      <Text style={styles.sublabel}>{sublabel}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  sublabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
});

export default InsightStatCard;
