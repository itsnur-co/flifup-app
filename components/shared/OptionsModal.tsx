/**
 * Reusable Options Modal Component (Shared)
 * Generic modal for displaying action options
 * Works with icon + text options and cancel button
 * Can be used for tasks, habits, and other features
 */

import React, { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ModalOption {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
  color?: string;
  isDanger?: boolean;
}

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  options: ModalOption[];
  cancelLabel?: string;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  onClose,
  options,
  cancelLabel = "Cancel",
}) => {
  const handleOptionPress = (option: ModalOption) => {
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
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalContainer}>
          {/* Options */}
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                index < options.length - 1 && styles.optionWithBorder,
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {option.icon}
              </View>
              <Text
                style={[
                  styles.optionText,
                  option.isDanger && styles.dangerText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
  },
  optionWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dangerText: {
    color: "#EF4444",
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
