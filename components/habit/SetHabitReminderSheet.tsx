/**
 * Set Habit Reminder Bottom Sheet Component
 * Supports both Time-based (e.g., 9:00 AM daily) and Offset-based (e.g., 30 min before) reminders
 */

import {
  RadioSelectedIcon,
  RadioUnselectedIcon,
} from "@/components/icons/HabitIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import type { HabitReminderType, HabitReminderUnit, HabitReminderValue } from "@/types/habit";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReminderTab = "time" | "offset";

interface OffsetOption {
  value: number;
  unit: HabitReminderUnit;
  label: string;
}

const OFFSET_OPTIONS: OffsetOption[] = [
  { value: 5, unit: "MINUTES", label: "5 minutes before" },
  { value: 10, unit: "MINUTES", label: "10 minutes before" },
  { value: 15, unit: "MINUTES", label: "15 minutes before" },
  { value: 30, unit: "MINUTES", label: "30 minutes before" },
  { value: 45, unit: "MINUTES", label: "45 minutes before" },
  { value: 1, unit: "HOURS", label: "1 hour before" },
  { value: 2, unit: "HOURS", label: "2 hours before" },
];

interface SetHabitReminderSheetProps {
  visible: boolean;
  onClose: () => void;
  onSetReminder: (reminder: HabitReminderValue) => void;
  selectedReminder?: HabitReminderValue | null;
}

export const SetHabitReminderSheet: React.FC<SetHabitReminderSheetProps> = ({
  visible,
  onClose,
  onSetReminder,
  selectedReminder,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ReminderTab>(
    selectedReminder?.type === "OFFSET_BASED" ? "offset" : "time"
  );

  // Time-based state
  const [selectedTime, setSelectedTime] = useState<Date>(() => {
    if (selectedReminder?.type === "TIME_BASED" && selectedReminder.time) {
      const [hours, minutes] = selectedReminder.time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    // Default to 9:00 AM
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });

  // Offset-based state
  const [selectedOffset, setSelectedOffset] = useState<{
    value: number;
    unit: HabitReminderUnit;
  } | null>(() => {
    if (
      selectedReminder?.type === "OFFSET_BASED" &&
      selectedReminder.value &&
      selectedReminder.unit
    ) {
      return { value: selectedReminder.value, unit: selectedReminder.unit };
    }
    return null;
  });

  const handleDone = () => {
    if (activeTab === "time") {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      onSetReminder({
        type: "TIME_BASED",
        time: `${hours}:${minutes}`,
      });
    } else if (selectedOffset) {
      onSetReminder({
        type: "OFFSET_BASED",
        value: selectedOffset.value,
        unit: selectedOffset.unit,
      });
    }
    onClose();
  };

  const handleTimeChange = (_event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  const handleSelectOffset = (option: OffsetOption) => {
    setSelectedOffset({ value: option.value, unit: option.unit });
  };

  const isOffsetSelected = (option: OffsetOption): boolean => {
    return (
      selectedOffset?.value === option.value &&
      selectedOffset?.unit === option.unit
    );
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.95, 1]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Set Reminder</Text>
          <TouchableOpacity onPress={handleDone} activeOpacity={0.7}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "time" && styles.tabActive]}
            onPress={() => setActiveTab("time")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "time" && styles.tabTextActive,
              ]}
            >
              TIME-BASED
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "offset" && styles.tabActive]}
            onPress={() => setActiveTab("offset")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "offset" && styles.tabTextActive,
              ]}
            >
              OFFSET-BASED
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "time" ? (
          <View style={styles.timeContent}>
            <Text style={styles.timeDescription}>
              Get reminded at the same time every day
            </Text>
            <View style={styles.timePickerContainer}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor="#FFFFFF"
                themeVariant="dark"
                style={styles.timePicker}
              />
            </View>
            <View style={styles.selectedTimeContainer}>
              <Text style={styles.selectedTimeLabel}>Selected Time</Text>
              <Text style={styles.selectedTimeValue}>
                {formatTime(selectedTime)}
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.offsetContent}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.offsetDescription}>
              Get reminded before your habit start time
            </Text>
            {OFFSET_OPTIONS.map((option, index) => {
              const isSelected = isOffsetSelected(option);
              return (
                <TouchableOpacity
                  key={`${option.value}-${option.unit}`}
                  style={styles.optionItem}
                  onPress={() => handleSelectOffset(option)}
                  activeOpacity={0.7}
                >
                  {isSelected ? (
                    <RadioSelectedIcon size={24} color={Colors.primary} />
                  ) : (
                    <RadioUnselectedIcon size={24} color="#3A3A3C" />
                  )}
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "#3A3A3C",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  timeContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  timePickerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  timePicker: {
    width: 200,
    height: 180,
  },
  selectedTimeContainer: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedTimeLabel: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedTimeValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  offsetContent: {
    flex: 1,
    paddingTop: 8,
  },
  offsetDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 8,
    gap: 14,
  },
  optionLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default SetHabitReminderSheet;
