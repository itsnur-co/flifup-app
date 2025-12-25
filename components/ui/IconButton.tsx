/**
 * Reusable Icon Button Component
 * For action items in headers, lists, etc.
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface IconButtonProps extends TouchableOpacityProps {
  name: keyof typeof Feather.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  containerSize?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 20,
  color = '#FFFFFF',
  backgroundColor = 'transparent',
  containerSize = 40,
  borderRadius,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          backgroundColor,
          borderRadius: borderRadius ?? containerSize / 2,
        },
        style,
      ]}
      {...props}
    >
      <Feather name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
