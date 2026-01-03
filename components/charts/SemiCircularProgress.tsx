/**
 * SemiCircularProgress Component
 * A semi-circular arc progress chart showing task completion status
 * Displays Completed, In Progress, and Due segments
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, G } from "react-native-svg";

interface SemiCircularProgressProps {
  completed: number;
  inProgress: number;
  due: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

// Colors from Figma
const COLORS = {
  completed: "#9039FF", // Purple
  inProgress: "#22BCDE", // Cyan
  due: "#FF2C39", // Red
  background: "#2C2C2E",
};

export const SemiCircularProgress: React.FC<SemiCircularProgressProps> = ({
  completed,
  inProgress,
  due,
  total,
  size = 275,
  strokeWidth = 24,
}) => {
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate percentages
  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
  const duePercent = total > 0 ? (due / total) * 100 : 0;

  // Calculate arc angles (180 degrees = π radians for semi-circle)
  // Start from left (-180°) to right (0°)
  const totalAngle = 180;
  const completedAngle = (completedPercent / 100) * totalAngle;
  const inProgressAngle = (inProgressPercent / 100) * totalAngle;
  const dueAngle = (duePercent / 100) * totalAngle;

  // Convert angle to radians (starting from -180 degrees / left side)
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // Create arc path
  const createArc = (startAngle: number, endAngle: number): string => {
    // Adjust angles: -180 is left, 0 is right
    const startRad = degToRad(startAngle - 180);
    const endRad = degToRad(endAngle - 180);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Calculate arc positions
  let currentAngle = 0;
  const arcs = [];

  // Completed arc (purple)
  if (completedAngle > 0) {
    arcs.push({
      path: createArc(currentAngle, currentAngle + completedAngle),
      color: COLORS.completed,
    });
    currentAngle += completedAngle;
  }

  // In Progress arc (cyan)
  if (inProgressAngle > 0) {
    arcs.push({
      path: createArc(currentAngle, currentAngle + inProgressAngle),
      color: COLORS.inProgress,
    });
    currentAngle += inProgressAngle;
  }

  // Due arc (red)
  if (dueAngle > 0) {
    arcs.push({
      path: createArc(currentAngle, currentAngle + dueAngle),
      color: COLORS.due,
    });
  }

  // Calculate completion percentage for center display
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2 + 40}>
        <G>
          {/* Background arc */}
          <Path
            d={createArc(0, 180)}
            stroke={COLORS.background}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Progress arcs */}
          {arcs.map((arc, index) => (
            <Path
              key={index}
              d={arc.path}
              stroke={arc.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </G>
      </Svg>

      {/* Center content */}
      <View style={[styles.centerContent, { top: size / 2 - 50 }]}>
        <Text style={styles.percentageText}>{completionRate}%</Text>
        <Text style={styles.labelText}>Task Completed</Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.completed }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.inProgress }]} />
          <Text style={styles.legendText}>In Progress</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.due }]} />
          <Text style={styles.legendText}>Due</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  labelText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});

export default SemiCircularProgress;
