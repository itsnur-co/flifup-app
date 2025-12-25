/**
 * Reusable Week Calendar Component
 * Displays a week view with day selection
 * Pixel-perfect design implementation
 */

import { Colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DayData {
  date: number;
  dayName: string;
  fullDate: Date;
  isToday?: boolean;
}

interface WeekCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  monthYearText?: string;
  showMonthDropdown?: boolean;
  onMonthPress?: () => void;
  onTodayPress?: () => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDate,
  onDateSelect,
  monthYearText,
  showMonthDropdown = true,
  onMonthPress,
  onTodayPress,
}) => {
  const [selected, setSelected] = useState<Date>(selectedDate || new Date());

  // Generate week days
  const generateWeekDays = (): DayData[] => {
    const days: DayData[] = [];
    const today = new Date();
    const currentDate = new Date(selected);

    // Get the start of the week (Sunday)
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

      days.push({
        date: date.getDate(),
        dayName: dayNames[i],
        fullDate: date,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }

    return days;
  };

  const weekDays = generateWeekDays();

  // Format month and year
  const formatMonthYear = (): string => {
    if (monthYearText) return monthYearText;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${months[selected.getMonth()]} ${selected.getFullYear()}`;
  };

  const handleDayPress = (day: DayData) => {
    setSelected(day.fullDate);
    onDateSelect?.(day.fullDate);
  };

  const handleTodayPress = () => {
    const today = new Date();
    setSelected(today);
    onDateSelect?.(today);
    onTodayPress?.();
  };

  const isSelected = (day: DayData): boolean => {
    return (
      day.fullDate.getDate() === selected.getDate() &&
      day.fullDate.getMonth() === selected.getMonth() &&
      day.fullDate.getFullYear() === selected.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={onMonthPress}
          disabled={!showMonthDropdown}
        >
          <Text style={styles.monthText}>{formatMonthYear()}</Text>
          {showMonthDropdown && (
            <Feather
              name="chevron-down"
              size={20}
              color="#FFFFFF"
              style={styles.chevron}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.todayButton} onPress={handleTodayPress}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {weekDays.map((day, index) => {
          const selected = isSelected(day);
          return (
            <View key={index} style={{ alignItems: "center", gap: 6 }}>
              <TouchableOpacity
                key={`${day.fullDate.toISOString()}-${index}`}
                style={[styles.dayItem, selected && styles.dayItemSelected]}
                onPress={() => handleDayPress(day)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dayName, selected && styles.dayNameSelected]}
                >
                  {day.dayName}
                </Text>
              </TouchableOpacity>
              <Text
                style={[styles.dayDate, selected && styles.dayDateSelected]}
              >
                {String(day.date).padStart(2, "0")}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  chevron: {
    marginLeft: 2,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  todayText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  daysContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dayItem: {
    width: 64,
    height: 64,
    backgroundColor: "transparent",
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: "#8D95A8",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 10,
  },
  dayItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 500,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0,
    lineHeight: 20,
  },
  dayNameSelected: {
    color: "#FFFFFF",
    fontWeight: 500,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: 500,
    color: "#FFFFFF",
    letterSpacing: 0,
    lineHeight: 22,
  },
  dayDateSelected: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: 500,
  },
});
