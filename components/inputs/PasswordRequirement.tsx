import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface PasswordRequirementProps {
  text: string;
  met: boolean;
}

/**
 * Password Requirement Component
 * Displays a single password requirement with check/uncheck icon
 */
export const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ text, met }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, met && styles.iconContainerMet]}>
        <Ionicons
          name={met ? 'checkmark-circle' : 'ellipse-outline'}
          size={20}
          color={met ? Colors.primary : Colors.ui.text.secondary}
        />
      </View>
      <Text style={[styles.text, met && styles.textMet]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconContainerMet: {
    // Additional styling when requirement is met
  },
  text: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
  },
  textMet: {
    color: Colors.ui.white,
  },
});
