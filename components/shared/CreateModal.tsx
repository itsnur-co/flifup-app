/**
 * Create Modal Component
 * Reusable disclosure modal for quick feature access
 * Grid layout with 6 options: Task, Goal, Note, Project, Milestone, Reminder
 * Matches Figma design with app color theme
 */

import { Colors } from "@/constants/colors";
import React, { ReactNode } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============================================
// CLOSE ICON
// ============================================

// Close Icon
const CloseIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = Colors.ui.text.secondary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============================================
// INTERFACES & TYPES
// ============================================

export interface CreateOption {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
}

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  options: CreateOption[];
}

// ============================================
// MAIN COMPONENT
// ============================================

export const CreateModal: React.FC<CreateModalProps> = ({
  visible,
  onClose,
  options,
}) => {
  const insets = useSafeAreaInsets();

  // Grid layout - 3 columns
  const gridItems = Array.from({ length: Math.ceil(options.length / 3) }).map(
    (_, rowIndex) => options.slice(rowIndex * 3, rowIndex * 3 + 3)
  );

  const handleOptionPress = (option: CreateOption) => {
    option.onPress();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
      />

      {/* Modal Container */}
      <View
        style={[
          styles.centeredView,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 20 },
        ]}
      >
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create New</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseIcon size={20} color={Colors.ui.text.secondary} />
            </TouchableOpacity>
          </View>


          {/* Grid Content */}
          <View style={styles.gridContainer}>
            {gridItems.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((option, colIndex) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.gridItem}
                    onPress={() => handleOptionPress(option)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconContainer}>{option.icon}</View>
                    <Text style={styles.label}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                {/* Fill empty spaces in last row */}
                {rowIndex === gridItems.length - 1 &&
                  row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, index) => (
                    <View
                      key={`empty-${index}`}
                      style={[styles.gridItem, { opacity: 0 }]}
                    />
                  ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  backdrop: {
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    width: "85%",
    maxWidth: 360,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.ui.text.primary,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    backgroundColor: "#000000",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 16,
    minHeight: 110,
  },
  iconContainer: {
    width: 48,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.ui.text.primary,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

export default CreateModal;
