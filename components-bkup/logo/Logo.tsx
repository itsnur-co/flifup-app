import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
  variant?: 'white';
}

/**
 * Flifup Logo Component
 * Renders the Flifup logo from assets with customizable size
 */
export const Logo: React.FC<LogoProps> = ({
  size = 100,
  style,
  variant = 'white',
}) => {
  const getLogoSource = () => {
    switch (variant) {
      case 'white':
      default:
        return require('@/assets/logo/white-logo.png');
    }
  };

  return (
    <Image
      source={getLogoSource()}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // Base styles can be added here if needed
  },
});
