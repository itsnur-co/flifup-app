/**
 * Set Reminder Bottom Sheet Component
 * Reminder selection with Minutes/Hours/Days tabs
 * Includes custom picker options
 * Matches Figma design exactly
 */

import {
  RadioSelectedIcon,
  RadioUnselectedIcon,
} from "@/components/icons/HabitIcons";
import { PlusIcon } from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReminderTab = "minutes" | "hours" | "days";

interface ReminderOption {
  value: number;
  label: string;
}

const MINUTES_OPTIONS: ReminderOption[] = [
  { value: 1, label: "1 minutes before" },
  { value: 5, label: "5 minutes before" },
  { value: 10, label: "10 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 20, label: "20 minutes before" },
  { value: 25, label: "25 minutes before" },
  { value: 30, label: "30 minutes before" },
];

const HOURS_OPTIONS: ReminderOption[] = [
  { value: 1, label: "1 hour before" },
  { value: 2, label: "2 hour before" },
  { value: 4, label: "4 hour before" },
  { value: 8, label: "8 hour before" },
  { value: 16, label: "16 hour before" },
];

const DAYS_OPTIONS: ReminderOption[] = [
  { value: 1, label: "1 day before" },
  { value: 2, label: "2 day before" },
  { value: 3, label: "3 day before" },
  { value: 5, label: "5 day before" },
  { value: 7, label: "7 day before" },
];

export interface ReminderValue {
  type: ReminderTab;
  value: number;
  isCustom?: boolean;
  customDate?: Date;
}

interface SetReminderSheetProps {
  visible: boolean;
  onClose: () => void;
  onSetReminder: (reminder: ReminderValue) => void;
  onOpenCustomMinutes?: () => void;
  onOpenCustomHours?: () => void;
  onOpenCustomDate?: () => void;
  selectedReminder?: ReminderValue | null;
  customMinutes?: number[];
  customHours?: number[];
}

export const SetReminderSheet: React.FC<SetReminderSheetProps> = ({
  visible,
  onClose,
  onSetReminder,
  onOpenCustomMinutes,
  onOpenCustomHours,
  onOpenCustomDate,
  selectedReminder,
  customMinutes = [],
  customHours = [],
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ReminderTab>(
    selectedReminder?.type || "minutes"
  );
  const [selected, setSelected] = useState<ReminderValue | null>(
    selectedReminder || null
  );

  const handleDone = () => {
    if (selected) {
      onSetReminder(selected);
    }
    onClose();
  };

  const handleSelectOption = (type: ReminderTab, value: number) => {
    setSelected({ type, value });
  };

  const getOptions = (): ReminderOption[] => {
    let baseOptions: ReminderOption[];

    switch (activeTab) {
      case "minutes":
        baseOptions = [...MINUTES_OPTIONS];
        // Add custom minutes
        customMinutes.forEach((min) => {
          if (!baseOptions.find((o) => o.value === min)) {
            baseOptions.push({ value: min, label: `${min} minutes before` });
          }
        });
        return baseOptions.sort((a, b) => a.value - b.value);

      case "hours":
        baseOptions = [...HOURS_OPTIONS];
        // Add custom hours
        customHours.forEach((hr) => {
          if (!baseOptions.find((o) => o.value === hr)) {
            baseOptions.push({ value: hr, label: `${hr} hour before` });
          }
        });
        return baseOptions.sort((a, b) => a.value - b.value);

      case "days":
        return DAYS_OPTIONS;

      default:
        return MINUTES_OPTIONS;
    }
  };

  const getCustomButtonText = (): string => {
    switch (activeTab) {
      case "minutes":
        return "Add Custom Minutes";
      case "hours":
        return "Add Custom Hours";
      case "days":
        return "Add Custom date";
      default:
        return "Add Custom";
    }
  };

  const handleCustomPress = () => {
    switch (activeTab) {
      case "minutes":
        onOpenCustomMinutes?.();
        break;
      case "hours":
        onOpenCustomHours?.();
        break;
      case "days":
        onOpenCustomDate?.();
        break;
    }
  };

  const isOptionSelected = (type: ReminderTab, value: number): boolean => {
    return selected?.type === type && selected?.value === value;
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
            style={[styles.tab, activeTab === "minutes" && styles.tabActive]}
            onPress={() => setActiveTab("minutes")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "minutes" && styles.tabTextActive,
              ]}
            >
              MINUTES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "hours" && styles.tabActive]}
            onPress={() => setActiveTab("hours")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "hours" && styles.tabTextActive,
              ]}
            >
              HOURS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "days" && styles.tabActive]}
            onPress={() => setActiveTab("days")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "days" && styles.tabTextActive,
              ]}
            >
              Days
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Custom Button */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={handleCustomPress}
          activeOpacity={0.7}
        >
          <PlusIcon size={20} color={Colors.primary} />
          <Text style={styles.customButtonText}>{getCustomButtonText()}</Text>
        </TouchableOpacity>

        <View style={styles.optionDivider} />

        {/* Options List */}
        <ScrollView
          style={styles.optionsList}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {getOptions().map((option) => {
            const isSelected = isOptionSelected(activeTab, option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => handleSelectOption(activeTab, option.value)}
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
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  customButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.primary,
  },
  optionDivider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginHorizontal: 20,
  },
  optionsList: {
    flex: 1,
    paddingTop: 8,
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

export default SetReminderSheet;
