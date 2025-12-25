import { Colors } from "@/constants/colors";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface CreateButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Create Button Component
 * Gradient button for creating tasks, habits, plans
 */
export const CreateButton: React.FC<CreateButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={styles.container}
    >
      <LinearGradient
        colors={Colors.gradient.createButton.colors}
        locations={[0.4611, 0.9904, 1.4965]}
        start={{ x: 0.6, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, disabled && styles.disabled, style]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Image
              source={require("@/assets/icons/add.png")}
              style={{ width: 28, height: 28 }}
            />
            <Text style={[styles.text, textStyle]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    gap: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: 185,
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    opacity: 1,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.5,
  },
});
