/**
 * Add Time Bottom Sheet Component
 * iOS-style wheel picker for time selection
 * Matches Figma design exactly
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useCallback, useRef, useState } from "react";
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface AddTimeSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectTime: (time: string) => void;
  initialTime?: string;
}

// Generate hours (1-12)
const hours = Array.from({ length: 12 }, (_, i) => i + 1);
// Generate minutes (0-59)
const minutes = Array.from({ length: 60 }, (_, i) => i);
// AM/PM options
const periods = ["AM", "PM"];

interface WheelPickerProps {
  data: (string | number)[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  width: number;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
  data,
  selectedIndex,
  onIndexChange,
  width,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

      if (clampedIndex !== selectedIndex) {
        onIndexChange(clampedIndex);
      }

      // Snap to the selected item
      scrollViewRef.current?.scrollTo({
        y: clampedIndex * ITEM_HEIGHT,
        animated: true,
      });

      setIsScrolling(false);
    },
    [data.length, onIndexChange, selectedIndex]
  );

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  // Initial scroll to selected item
  React.useEffect(() => {
    if (!isScrolling) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, [selectedIndex, isScrolling]);

  return (
    <View style={[styles.pickerContainer, { width }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={(e) => {
          // Handle case where momentum doesn't trigger
          if (e.nativeEvent.velocity?.y === 0) {
            handleScrollEnd(e);
          }
        }}
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={index}
              style={styles.pickerItem}
              onPress={() => {
                onIndexChange(index);
                scrollViewRef.current?.scrollTo({
                  y: index * ITEM_HEIGHT,
                  animated: true,
                });
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pickerText,
                  isSelected && styles.pickerTextSelected,
                ]}
              >
                {typeof item === "number" && item < 10 ? `${item}` : item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Selection indicator lines */}
      <View style={styles.selectionIndicator} pointerEvents="none">
        <View style={styles.selectionLine} />
        <View style={[styles.selectionLine, styles.selectionLineBottom]} />
      </View>
    </View>
  );
};

export const AddTimeSheet: React.FC<AddTimeSheetProps> = ({
  visible,
  onClose,
  onSelectTime,
  initialTime,
}) => {
  // Parse initial time or default to 5:30 PM
  // Supports both HH:mm (24h) and h:mm AM/PM (12h) formats
  const parseInitialTime = () => {
    if (initialTime) {
      // Try 12-hour format first (e.g., "5:30 PM")
      const match12h = initialTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match12h) {
        return {
          hour: parseInt(match12h[1], 10),
          minute: parseInt(match12h[2], 10),
          period: match12h[3].toUpperCase() as "AM" | "PM",
        };
      }

      // Try 24-hour format (e.g., "17:30")
      const match24h = initialTime.match(/^(\d{1,2}):(\d{2})$/);
      if (match24h) {
        const hour24 = parseInt(match24h[1], 10);
        const minute = parseInt(match24h[2], 10);

        // Convert 24h to 12h format
        let hour12: number;
        let period: "AM" | "PM";

        if (hour24 === 0) {
          hour12 = 12;
          period = "AM";
        } else if (hour24 < 12) {
          hour12 = hour24;
          period = "AM";
        } else if (hour24 === 12) {
          hour12 = 12;
          period = "PM";
        } else {
          hour12 = hour24 - 12;
          period = "PM";
        }

        return { hour: hour12, minute, period };
      }
    }
    return { hour: 5, minute: 30, period: "PM" as const };
  };

  const initial = parseInitialTime();
  const [selectedHour, setSelectedHour] = useState(initial.hour - 1);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(
    periods.indexOf(initial.period)
  );

  const handleAdd = useCallback(() => {
    const hour12 = hours[selectedHour]; // 1-12
    const minute = minutes[selectedMinute];
    const period = periods[selectedPeriod];

    // Convert to 24-hour format for API (HH:mm)
    let hour24 = hour12;
    if (period === "AM") {
      hour24 = hour12 === 12 ? 0 : hour12;
    } else {
      // PM
      hour24 = hour12 === 12 ? 12 : hour12 + 12;
    }

    const formattedHour = hour24 < 10 ? `0${hour24}` : `${hour24}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
    const timeString = `${formattedHour}:${formattedMinute}`;

    onSelectTime(timeString);
    onClose();
  }, [selectedHour, selectedMinute, selectedPeriod, onSelectTime, onClose]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.95]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Time</Text>
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Time Picker */}
        <View style={styles.pickerWrapper}>
          <WheelPicker
            data={hours}
            selectedIndex={selectedHour}
            onIndexChange={setSelectedHour}
            width={100}
          />
          <WheelPicker
            data={minutes}
            selectedIndex={selectedMinute}
            onIndexChange={setSelectedMinute}
            width={100}
          />
          <WheelPicker
            data={periods}
            selectedIndex={selectedPeriod}
            onIndexChange={setSelectedPeriod}
            width={100}
          />
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
  pickerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    height: PICKER_HEIGHT + 40,
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    overflow: "hidden",
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 22,
    color: "#6B7280",
    fontWeight: "400",
  },
  pickerTextSelected: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  selectionIndicator: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    justifyContent: "space-between",
  },
  selectionLine: {
    height: 1,
    backgroundColor: "#3A3A3C",
  },
  selectionLineBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default AddTimeSheet;
