import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface SocialButtonProps {
  provider: 'google' | 'facebook';
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * Social Login Button Component
 * Renders icon buttons for social authentication providers
 */
export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  style,
}) => {
  const getIcon = () => {
    switch (provider) {
      case 'google':
        return 'logo-google';
      case 'facebook':
        return 'logo-facebook';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={getIcon()} size={24} color={Colors.ui.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
