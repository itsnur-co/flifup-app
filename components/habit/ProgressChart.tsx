/**
 * Progress Chart Component
 * Line chart for habit completion rate over time
 */

import { Colors } from "@/constants/colors";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

interface ProgressChartProps {
  data: number[]; // Array of completion percentages (0-100)
  completionRate: number;
  title?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 180;
const PADDING = 20;

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  completionRate,
  title = "AVG Completion Rate",
}) => {
  // Normalize data to chart coordinates
  const maxValue = 100;
  const graphWidth = CHART_WIDTH - PADDING * 2;
  const graphHeight = CHART_HEIGHT - PADDING * 2;

  const points = data.map((value, index) => {
    const x = PADDING + (index / (data.length - 1)) * graphWidth;
    const y = CHART_HEIGHT - PADDING - (value / maxValue) * graphHeight;
    return { x, y };
  });

  // Create SVG path
  const pathData = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, "");

  // Grid lines
  const gridLines = [0, 25, 50, 75, 100].map((value) => {
    const y = CHART_HEIGHT - PADDING - (value / maxValue) * graphHeight;
    return y;
  });

  return (
    <View style={styles.container}>
      {/* Title and Rate */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.rate}>{completionRate}%</Text>

      {/* Chart */}
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Grid Lines */}
        {gridLines.map((y, index) => (
          <Line
            key={index}
            x1={PADDING}
            y1={y}
            x2={CHART_WIDTH - PADDING}
            y2={y}
            stroke="#3A3A3C"
            strokeWidth={1}
          />
        ))}

        {/* Line Path */}
        <Path
          d={pathData}
          fill="none"
          stroke={Colors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={0}
            fill={Colors.primary}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  rate: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
});

export default ProgressChart;
