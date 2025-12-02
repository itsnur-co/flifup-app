import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

/**
 * Loading Spinner Component
 * Animated dots that pulse in sequence
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 8,
  color = Colors.primary,
}) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <AnimatedDot key={index} delay={index * 100} size={size} color={color} />
      ))}
    </View>
  );
};

interface AnimatedDotProps {
  delay: number;
  size: number;
  color: string;
}

const AnimatedDot: React.FC<AnimatedDotProps> = ({ delay, size, color }) => {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.3, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {},
});
