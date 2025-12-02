import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';

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
        return require('@/assets/icons/search.png');
      case 'facebook':
        return require('@/assets/icons/facebook.png');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={getIcon()} style={styles.icon} />
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
  icon: {
    width: 24,
    height: 24,
  },
});
