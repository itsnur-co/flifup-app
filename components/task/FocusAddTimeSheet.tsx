/**
 * Focus Add Time Bottom Sheet Component
 * iOS-style wheel picker for minutes & seconds selection
 * For adding time to focus sessions
 * Matches Figma design exactly
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface FocusAddTimeSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
}

// Generate hours (1-12) for left column
const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
// Generate minutes (0-59) for right column
const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

interface WheelPickerProps {
  data: number[];
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

  useEffect(() => {
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
          if (e.nativeEvent.velocity?.y === 0) {
            handleScrollEnd(e);
          }
        }}
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          const distance = Math.abs(index - selectedIndex);
          const opacity =
            distance === 0
              ? 1
              : distance === 1
              ? 0.6
              : distance === 2
              ? 0.4
              : 0.3;

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
                  !isSelected && { opacity },
                ]}
              >
                {item}
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

export const FocusAddTimeSheet: React.FC<FocusAddTimeSheetProps> = ({
  visible,
  onClose,
  onAdd,
  initialHours = 5,
  initialMinutes = 30,
}) => {
  // Find initial indices (default to 5 hours and 30 minutes)
  const initialHourIndex = Math.max(
    0,
    hourOptions.findIndex((h) => h === initialHours)
  );
  const initialMinuteIndex = Math.max(
    0,
    minuteOptions.findIndex((m) => m === initialMinutes)
  );

  const [selectedHourIndex, setSelectedHourIndex] = useState(
    initialHourIndex >= 0 ? initialHourIndex : 4
  );
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(
    initialMinuteIndex >= 0 ? initialMinuteIndex : 30
  );

  // Reset when sheet opens
  useEffect(() => {
    if (visible) {
      setSelectedHourIndex(initialHourIndex >= 0 ? initialHourIndex : 4);
      setSelectedMinuteIndex(initialMinuteIndex >= 0 ? initialMinuteIndex : 30);
    }
  }, [visible]);

  const handleAdd = useCallback(() => {
    const hours = hourOptions[selectedHourIndex];
    const minutes = minuteOptions[selectedMinuteIndex];
    onAdd(hours, minutes);
  }, [selectedHourIndex, selectedMinuteIndex, onAdd]);

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
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Add Time</Text>
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Time Picker */}
        <View style={styles.pickerWrapper}>
          <WheelPicker
            data={hourOptions}
            selectedIndex={selectedHourIndex}
            onIndexChange={setSelectedHourIndex}
            width={120}
          />
          <WheelPicker
            data={minuteOptions}
            selectedIndex={selectedMinuteIndex}
            onIndexChange={setSelectedMinuteIndex}
            width={120}
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
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
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
    gap: 20,
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
    fontSize: 32,
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
  previewContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  previewText: {
    fontSize: 14,
    color: "#8E8E93",
  },
});

export default FocusAddTimeSheet;
