/**
 * PeriodDropdown Component
 * A dropdown selector for time period filtering
 * Shows "Last 7 days", "Last 30 days", "Last 90 days" options
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";

type PeriodOption = {
  value: number;
  label: string;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

interface PeriodDropdownProps {
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
}

// Chevron down icon
const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PeriodDropdown: React.FC<PeriodDropdownProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0, width: 0 });
  const buttonRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const selectedOption = PERIOD_OPTIONS.find((opt) => opt.value === selectedPeriod);

  const handleOpen = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownPosition({
        x: pageX,
        y: pageY + height + 8,
        width: width,
      });
      setIsOpen(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const handleSelect = (option: PeriodOption) => {
    onPeriodChange(option.value);
    handleClose();
  };

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{selectedOption?.label}</Text>
        <ChevronDownIcon size={16} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              styles.dropdown,
              {
                position: "absolute",
                top: dropdownPosition.y,
                left: dropdownPosition.x,
                minWidth: Math.max(dropdownPosition.width, 140),
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {PERIOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  option.value === selectedPeriod && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.value === selectedPeriod && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === selectedPeriod && (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M5 12L10 17L19 8"
                      stroke="#9039FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdown: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: "#9039FF15",
  },
  optionText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  optionTextSelected: {
    color: "#9039FF",
    fontWeight: "600",
  },
});

export default PeriodDropdown;
