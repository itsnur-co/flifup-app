import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface PasswordStrengthIndicatorProps {
  strength: number; // 0 to 100
}

/**
 * Password Strength Indicator Component
 * Visual progress bar showing password strength
 */
export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const getStrengthColor = (value: number) => {
    'worklet';
    if (value < 40) return '#FF4444'; // Weak - Red
    if (value < 70) return '#FFA500'; // Medium - Orange
    return '#4CAF50'; // Strong - Green
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: withTiming(`${strength}%`, { duration: 300 }),
    backgroundColor: getStrengthColor(strength),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.progress, progressStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
});
