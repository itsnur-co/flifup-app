/**
 * Reusable Options Modal Component (Shared)
 * Generic modal for displaying action options
 * Works with icon + text options and cancel button
 * Pixel-perfect design matching Figma with blur effect
 */

import { Colors } from "@/constants/colors";
import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      {/* Backdrop with Blur */}
      <View  style={styles.backdrop} >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </View>

      {/* Centered Container */}
      <View style={styles.centeredContainer} pointerEvents="box-none">
        {/* Options Container with Blur */}
        <BlurView intensity={100} tint="dark" style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                index < options.length - 1 && styles.optionWithBorder,
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.6}
            >
              <View style={styles.iconContainer}>{option.icon}</View>
              <Text
                style={[
                  styles.optionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </BlurView>

        {/* Cancel Button with Blur */}
        <BlurView intensity={100} tint="dark" style={styles.cancelButton}>
          <TouchableOpacity
            style={styles.cancelButtonInner}
            onPress={onClose}
            activeOpacity={0.6}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  optionsContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    width: "100%",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  optionWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
  },
  dangerText: {
    color: "#EF4444",
  },
  cancelButton: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  cancelButtonInner: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
