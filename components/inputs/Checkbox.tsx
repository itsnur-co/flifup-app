import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  labelComponent?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Checkbox Component
 * Reusable checkbox with optional label
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  labelComponent,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Ionicons name="checkmark" size={16} color={Colors.ui.white} />
        )}
      </View>
      {labelComponent ? (
        labelComponent
      ) : label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    flex: 1,
  },
});
