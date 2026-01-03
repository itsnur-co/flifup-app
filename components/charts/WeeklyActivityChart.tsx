/**
 * WeeklyActivityChart Component
 * A gradient line chart showing weekly task activity
 * Features smooth curves with purple-to-cyan gradient fill
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
  Line,
  Rect,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface DayData {
  day: string;
  value: number;
  date?: string;
}

interface WeeklyActivityChartProps {
  data: DayData[];
  selectedDayIndex?: number;
  onDaySelect?: (index: number) => void;
  height?: number;
}

// Gradient colors from Figma
const GRADIENT_COLORS = {
  start: "#9039FF",
  middle: "#6594FF",
  end: "#2DFDFF",
};

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  data,
  selectedDayIndex = 3, // Default to Thursday
  onDaySelect,
  height = 220,
}) => {
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH - 80);
  
  const paddingHorizontal = 20;
  const paddingTop = 40;
  const paddingBottom = 40;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = 0;

  // Calculate points
  const stepX = (chartWidth - paddingHorizontal * 2) / (data.length - 1);

  const getY = (value: number): number => {
    const ratio = (value - minValue) / (maxValue - minValue);
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  const getX = (index: number): number => {
    return paddingHorizontal + index * stepX;
  };

  // Create smooth curve path using cubic bezier
  const createSmoothPath = (): string => {
    if (data.length === 0) return "";

    const points = data.map((d, i) => ({
      x: getX(i),
      y: getY(d.value),
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const tension = 0.3;
      
      // Calculate control points
      const cp1x = prev.x + (curr.x - prev.x) * tension;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * tension;
      const cp2y = curr.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Create filled area path
  const createFilledPath = (): string => {
    const linePath = createSmoothPath();
    if (!linePath) return "";

    const lastPoint = {
      x: getX(data.length - 1),
      y: paddingTop + chartHeight,
    };
    const firstPoint = {
      x: getX(0),
      y: paddingTop + chartHeight,
    };

    return `${linePath} L ${lastPoint.x} ${lastPoint.y} L ${firstPoint.x} ${firstPoint.y} Z`;
  };

  // Get selected point data
  const selectedData = data[selectedDayIndex];
  const selectedX = getX(selectedDayIndex);
  const selectedY = getY(selectedData?.value || 0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setChartWidth(width);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          {/* Gradient for line stroke */}
          <LinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={GRADIENT_COLORS.start} />
            <Stop offset="50%" stopColor={GRADIENT_COLORS.middle} />
            <Stop offset="100%" stopColor={GRADIENT_COLORS.end} />
          </LinearGradient>

          {/* Gradient for fill area */}
          <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={GRADIENT_COLORS.start} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={GRADIENT_COLORS.start} stopOpacity="0.02" />
          </LinearGradient>

          {/* Gradient for glow effect */}
          <LinearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={GRADIENT_COLORS.start} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={GRADIENT_COLORS.end} stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <Line
            key={index}
            x1={paddingHorizontal}
            y1={paddingTop + chartHeight * (1 - ratio)}
            x2={chartWidth - paddingHorizontal}
            y2={paddingTop + chartHeight * (1 - ratio)}
            stroke="#2C2C2E"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}

        {/* Filled area under the curve */}
        <Path d={createFilledPath()} fill="url(#fillGradient)" />

        {/* Main line with gradient */}
        <Path
          d={createSmoothPath()}
          stroke="url(#lineGradient)"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Selected point vertical line */}
        {selectedData && (
          <Line
            x1={selectedX}
            y1={selectedY}
            x2={selectedX}
            y2={paddingTop + chartHeight}
            stroke="#9039FF"
            strokeWidth={1}
            strokeDasharray="4,4"
            strokeOpacity={0.5}
          />
        )}

        {/* Selected point indicator with glow */}
        {selectedData && (
          <G>
            {/* Outer glow */}
            <Circle
              cx={selectedX}
              cy={selectedY}
              r={16}
              fill="#9039FF"
              fillOpacity={0.2}
            />
            {/* Inner white circle */}
            <Circle cx={selectedX} cy={selectedY} r={10} fill="#FFFFFF" />
            {/* Center purple dot */}
            <Circle cx={selectedX} cy={selectedY} r={6} fill="#9039FF" />
          </G>
        )}

        {/* Tooltip background */}
        {selectedData && (
          <G>
            <Rect
              x={selectedX - 35}
              y={selectedY - 45}
              width={70}
              height={28}
              rx={6}
              fill="url(#glowGradient)"
            />
          </G>
        )}
      </Svg>

      {/* Tooltip text (rendered as React Native Text for better control) */}
      {selectedData && (
        <View
          style={[
            styles.tooltip,
            {
              left: selectedX - 35,
              top: selectedY - 45 + paddingTop - 15,
            },
          ]}
        >
          <Text style={styles.tooltipText}>
            {selectedData.value.toFixed(2)}{" "}
            <Text style={styles.tooltipIcon}>📅</Text>{" "}
            {(selectedData.value + 0.29).toFixed(2)}
          </Text>
        </View>
      )}

      {/* Day labels */}
      <View style={styles.dayLabels}>
        {data.map((item, index) => (
          <Text
            key={index}
            style={[
              styles.dayLabel,
              index === selectedDayIndex && styles.dayLabelActive,
            ]}
            onPress={() => onDaySelect?.(index)}
          >
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    width: 70,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tooltipIcon: {
    fontSize: 8,
  },
  dayLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -20,
  },
  dayLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    width: 40,
  },
  dayLabelActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default WeeklyActivityChart;
