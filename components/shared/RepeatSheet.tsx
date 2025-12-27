/**
 * Repeat Selection Bottom Sheet
 * Daily/Monthly/Interval tabs with respective options
 */

import {
  CheckboxSelectedIcon,
  CheckboxUnselectedIcon,
  RadioSelectedIcon,
  RadioUnselectedIcon,
} from "@/components/icons/HabitIcons";
import { ChevronDownIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import {
  DayOfWeek,
  DAYS_OF_WEEK,
  INTERVAL_OPTIONS,
  IntervalOption,
  RepeatConfig,
  RepeatType,
} from "@/types/habit";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RepeatSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (repeat: RepeatConfig) => void;
  initialValue?: RepeatConfig;
}

export const RepeatSheet: React.FC<RepeatSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  initialValue,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RepeatType>(
    initialValue?.type || "daily"
  );

  // Daily state
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    initialValue?.type === "daily" ? initialValue.days : []
  );

  // Monthly state
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number>(
    initialValue?.type === "monthly" ? initialValue.dayOfMonth : 1
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Interval state
  const [selectedInterval, setSelectedInterval] = useState<IntervalOption>(
    initialValue?.type === "interval" ? initialValue.everyDays : 2
  );

  const handleDone = () => {
    let config: RepeatConfig;

    switch (activeTab) {
      case "daily":
        config = { type: "daily", days: selectedDays };
        break;
      case "monthly":
        config = { type: "monthly", dayOfMonth: selectedDayOfMonth };
        break;
      case "interval":
        config = { type: "interval", everyDays: selectedInterval };
        break;
    }

    onConfirm(config);
    onClose();
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Calendar helpers for monthly view
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (): (number | null)[] => {
    const days: (number | null)[] = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={activeTab === "monthly" ? [0.95, 1] : [0.95, 1]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Repeat</Text>
          <TouchableOpacity onPress={handleDone} activeOpacity={0.7}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(["daily", "monthly", "interval"] as RepeatType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Daily Tab Content */}
          {activeTab === "daily" && (
            <View style={styles.daysList}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    style={styles.dayItem}
                    onPress={() => toggleDay(day.id)}
                    activeOpacity={0.7}
                  >
                    {isSelected ? (
                      <CheckboxSelectedIcon size={24} color={Colors.primary} />
                    ) : (
                      <CheckboxUnselectedIcon size={24} color="#3A3A3C" />
                    )}
                    <Text style={styles.dayLabel}>{day.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Monthly Tab Content */}
          {activeTab === "monthly" && (
            <View style={styles.monthlyContent}>
              {/* Month/Year Selector */}
              <View style={styles.monthSelector}>
                <TouchableOpacity
                  style={styles.yearSelector}
                  activeOpacity={0.7}
                >
                  <Text style={styles.yearText}>{year}</Text>
                  <ChevronDownIcon size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.monthDivider} />

                <TouchableOpacity
                  style={styles.monthDropdown}
                  activeOpacity={0.7}
                >
                  <Text style={styles.monthText}>{monthName}</Text>
                  <ChevronDownIcon size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Week Days Header */}
              <View style={styles.weekDaysRow}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <Text key={day} style={styles.weekDayText}>
                      {day}
                    </Text>
                  )
                )}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {generateCalendarDays().map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      day === selectedDayOfMonth && styles.dayCellSelected,
                    ]}
                    onPress={() => day && setSelectedDayOfMonth(day)}
                    disabled={!day}
                    activeOpacity={0.7}
                  >
                    {day && (
                      <Text
                        style={[
                          styles.dayText,
                          day === selectedDayOfMonth && styles.dayTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Interval Tab Content */}
          {activeTab === "interval" && (
            <View style={styles.intervalList}>
              {INTERVAL_OPTIONS.map((interval) => {
                const isSelected = selectedInterval === interval;
                return (
                  <TouchableOpacity
                    key={interval}
                    style={styles.intervalItem}
                    onPress={() => setSelectedInterval(interval)}
                    activeOpacity={0.7}
                  >
                    {isSelected ? (
                      <RadioSelectedIcon size={24} color={Colors.primary} />
                    ) : (
                      <RadioUnselectedIcon size={24} color="#3A3A3C" />
                    )}
                    <Text style={styles.intervalLabel}>
                      Every {interval} days
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "#3A3A3C",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  // Daily Styles
  daysList: {
    paddingHorizontal: 20,
  },
  dayItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 14,
  },
  dayLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  // Monthly Styles
  monthlyContent: {
    paddingHorizontal: 20,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  yearText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  monthDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#3A3A3C",
    marginHorizontal: 16,
  },
  monthDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    width: 40,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Interval Styles
  intervalList: {
    paddingHorizontal: 20,
  },
  intervalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 14,
  },
  intervalLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default RepeatSheet;
