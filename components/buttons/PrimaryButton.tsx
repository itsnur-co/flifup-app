import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Primary Button Component
 * Reusable button with filled and outlined variants
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isFilled = variant === 'filled';

  // Determine loading indicator color based on text color
  const getLoadingColor = () => {
    if (textStyle && typeof textStyle === 'object' && 'color' in textStyle) {
      return textStyle.color as string;
    }
    return isFilled ? Colors.background.dark : Colors.ui.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFilled ? styles.filledButton : styles.outlinedButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            isFilled ? styles.filledText : styles.outlinedText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  filledButton: {
    backgroundColor: Colors.ui.white,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.ui.white,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  filledText: {
    color: Colors.background.dark,
  },
  outlinedText: {
    color: Colors.ui.white,
  },
});
