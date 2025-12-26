/**
 * Add Custom Hours Bottom Sheet
 * Wheel picker for custom hour selection (1-24)
 * Matches Figma design exactly
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useCallback, useRef, useState } from "react";
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

// Generate hours (1-24)
const hours = Array.from({ length: 24 }, (_, i) => i + 1);

interface AddCustomHoursSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddHours: (hours: number) => void;
  initialValue?: number;
}

export const AddCustomHoursSheet: React.FC<AddCustomHoursSheetProps> = ({
  visible,
  onClose,
  onAddHours,
  initialValue = 5,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.max(0, initialValue - 1)
  );
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, hours.length - 1));

      if (clampedIndex !== selectedIndex) {
        setSelectedIndex(clampedIndex);
      }

      scrollViewRef.current?.scrollTo({
        y: clampedIndex * ITEM_HEIGHT,
        animated: true,
      });

      setIsScrolling(false);
    },
    [selectedIndex]
  );

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  // Initial scroll to selected item
  React.useEffect(() => {
    if (visible && !isScrolling) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [visible, selectedIndex, isScrolling]);

  const handleAdd = () => {
    const selectedHours = hours[selectedIndex];
    onAddHours(selectedHours);
    onClose();
  };

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
          <Text style={styles.headerTitle}>Add Custom Hours</Text>
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Wheel Picker */}
        <View style={styles.pickerWrapper}>
          <View style={styles.pickerContainer}>
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
              {hours.map((hour, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <TouchableOpacity
                    key={hour}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedIndex(index);
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
                      {hour}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  pickerContainer: {
    width: 200,
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
});

export default AddCustomHoursSheet;
