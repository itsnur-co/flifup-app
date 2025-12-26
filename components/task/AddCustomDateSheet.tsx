/**
 * Add Custom Date Bottom Sheet
 * Calendar picker for custom reminder date selection
 * Matches Figma design exactly
 */

import { ChevronDownIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddCustomDateSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const AddCustomDateSheet: React.FC<AddCustomDateSheetProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
  minDate,
}) => {
  const insets = useSafeAreaInsets();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(
    selectedDate?.getFullYear() || today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate?.getMonth() || today.getMonth()
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(
    selectedDate || null
  );
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Generate years (current year to +10 years)
  const years = useMemo(() => {
    const startYear = today.getFullYear();
    return Array.from({ length: 11 }, (_, i) => startYear + i);
  }, []);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, day),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i),
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const handleDone = () => {
    if (selectedDay) {
      onSelectDate(selectedDay);
    }
    onClose();
  };

  const handleDayPress = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      // Navigate to that month
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
    setSelectedDay(date);
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDay) return false;
    return (
      date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (date: Date): boolean => {
    if (!minDate) return false;
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return compareDate < min;
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.6]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Custom date</Text>
          <TouchableOpacity onPress={handleDone} activeOpacity={0.7}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Year and Month Selector */}
          <View style={styles.selectorContainer}>
            {/* Year Selector */}
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectorText}>{currentYear}</Text>
              <ChevronDownIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.selectorDivider} />

            {/* Month Selector */}
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectorText}>{MONTHS[currentMonth]}</Text>
              <ChevronDownIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Year Picker Dropdown */}
          {showYearPicker && (
            <View style={styles.pickerDropdown}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pickerContent}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      year === currentYear && styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      setCurrentYear(year);
                      setShowYearPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        year === currentYear && styles.pickerItemTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Month Picker Dropdown */}
          {showMonthPicker && (
            <View style={styles.pickerDropdown}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pickerContent}
              >
                {MONTHS.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      index === currentMonth && styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      setCurrentMonth(index);
                      setShowMonthPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        index === currentMonth && styles.pickerItemTextSelected,
                      ]}
                    >
                      {month.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Weekday Headers */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day) => (
              <View key={day} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => {
              const selected = isSelected(item.date);
              const todayDate = isToday(item.date);
              const past = isPastDate(item.date);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    selected && styles.dayCellSelected,
                  ]}
                  onPress={() => !past && handleDayPress(item.date, item.isCurrentMonth)}
                  disabled={past}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !item.isCurrentMonth && styles.dayTextOtherMonth,
                      todayDate && styles.dayTextToday,
                      selected && styles.dayTextSelected,
                      past && styles.dayTextDisabled,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  doneButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  selectorDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#3A3A3C",
    marginHorizontal: 24,
  },
  pickerDropdown: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pickerContent: {
    gap: 8,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2C2C2E",
  },
  pickerItemSelected: {
    backgroundColor: Colors.primary,
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  pickerItemTextSelected: {
    color: "#FFFFFF",
  },
  weekdayRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellSelected: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  dayTextOtherMonth: {
    color: "#4A4A4E",
  },
  dayTextToday: {
    color: Colors.primary,
    fontWeight: "600",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dayTextDisabled: {
    color: "#3A3A3C",
  },
});

export default AddCustomDateSheet;
