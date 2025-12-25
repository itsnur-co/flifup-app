/**
 * Add Goal Bottom Sheet
 * Wheel picker for goal value, unit, and frequency
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import {
  GOAL_FREQUENCIES,
  GOAL_UNITS,
  GoalFrequency,
  GoalUnit,
  HabitGoal,
} from "@/types/habit";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddGoalSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (goal: HabitGoal) => void;
  initialValue?: HabitGoal | null;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PICKER_WIDTH = (SCREEN_WIDTH - 60) / 3;

// Generate numbers 1-99
const NUMBERS = Array.from({ length: 99 }, (_, i) => i + 1);

export const AddGoalSheet: React.FC<AddGoalSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  initialValue,
}) => {
  const insets = useSafeAreaInsets();

  const [selectedValue, setSelectedValue] = useState(initialValue?.value || 5);
  const [selectedUnit, setSelectedUnit] = useState<GoalUnit>(
    initialValue?.unit || "mins"
  );
  const [selectedFrequency, setSelectedFrequency] = useState<GoalFrequency>(
    initialValue?.frequency || "per week"
  );

  const valueScrollRef = useRef<ScrollView>(null);
  const unitScrollRef = useRef<ScrollView>(null);
  const frequencyScrollRef = useRef<ScrollView>(null);

  const handleAdd = () => {
    onConfirm({
      value: selectedValue,
      unit: selectedUnit,
      frequency: selectedFrequency,
    });
    onClose();
  };

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    items: any[],
    setSelected: (item: any) => void
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < items.length) {
      setSelected(items[index]);
    }
  };

  const getItemStyle = (index: number, selectedIndex: number) => {
    const distance = Math.abs(index - selectedIndex);
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.3;
    const scale = distance === 0 ? 1 : 0.9;

    return {
      opacity,
      transform: [{ scale }],
    };
  };

  const renderPickerItem = (
    item: string | number,
    index: number,
    selectedIndex: number,
    isNumber: boolean = false
  ) => (
    <View
      key={index}
      style={[styles.pickerItem, getItemStyle(index, selectedIndex)]}
    >
      <Text
        style={[
          styles.pickerItemText,
          index === selectedIndex && styles.pickerItemTextSelected,
        ]}
      >
        {item}
      </Text>
    </View>
  );

  const selectedValueIndex = NUMBERS.indexOf(selectedValue);
  const selectedUnitIndex = GOAL_UNITS.indexOf(selectedUnit);
  const selectedFrequencyIndex = GOAL_FREQUENCIES.indexOf(selectedFrequency);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.55]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Goal</Text>
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Wheel Picker Container */}
        <View
          style={[
            styles.pickerContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Selection Highlight */}
          <View style={styles.selectionHighlight} />

          <View style={styles.pickersRow}>
            {/* Value Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={valueScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
                onMomentumScrollEnd={(e) =>
                  handleScroll(e, NUMBERS, setSelectedValue)
                }
              >
                {/* Padding items */}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
                {NUMBERS.map((num, index) =>
                  renderPickerItem(num, index, selectedValueIndex, true)
                )}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
              </ScrollView>
            </View>

            {/* Unit Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={unitScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
                onMomentumScrollEnd={(e) =>
                  handleScroll(e, GOAL_UNITS, setSelectedUnit)
                }
              >
                <View style={{ height: ITEM_HEIGHT * 2 }} />
                {GOAL_UNITS.map((unit, index) =>
                  renderPickerItem(unit, index, selectedUnitIndex)
                )}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
              </ScrollView>
            </View>

            {/* Frequency Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={frequencyScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
                onMomentumScrollEnd={(e) =>
                  handleScroll(e, GOAL_FREQUENCIES, setSelectedFrequency)
                }
              >
                <View style={{ height: ITEM_HEIGHT * 2 }} />
                {GOAL_FREQUENCIES.map((freq, index) =>
                  renderPickerItem(freq, index, selectedFrequencyIndex)
                )}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
              </ScrollView>
            </View>
          </View>
        </View>
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
  addButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  pickerContainer: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  selectionHighlight: {
    position: "absolute",
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    top: "50%",
    marginTop: -ITEM_HEIGHT / 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#3A3A3C",
  },
  pickersRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  pickerColumn: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  pickerContent: {
    alignItems: "center",
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 18,
    color: "#6B7280",
  },
  pickerItemTextSelected: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default AddGoalSheet;
