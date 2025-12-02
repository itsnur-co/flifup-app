import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  variant?: 'horizontal' | 'circular';
}

/**
 * Loading Spinner Component
 * Animated dots that pulse in sequence
 * Supports horizontal and circular variants
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 8,
  color = Colors.primary,
  variant = 'horizontal',
}) => {
  if (variant === 'circular') {
    return <CircularLoadingSpinner size={size} color={color} />;
  }

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <AnimatedDot key={index} delay={index * 100} size={size} color={color} />
      ))}
    </View>
  );
};

/**
 * Circular Loading Spinner Component
 * Creates a circular pattern of animated dots
 */
const CircularLoadingSpinner: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => {
  const dotCount = 8;
  const radius = size * 3;

  return (
    <View style={[styles.circularContainer, { width: radius * 2.5, height: radius * 2.5 }]}>
      {Array.from({ length: dotCount }).map((_, index) => {
        const angle = (index * 2 * Math.PI) / dotCount;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <CircularDot
            key={index}
            delay={index * 100}
            size={size}
            color={color}
            x={x}
            y={y}
          />
        );
      })}
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
  }, [delay]);

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

interface CircularDotProps {
  delay: number;
  size: number;
  color: string;
  x: number;
  y: number;
}

/**
 * Circular Dot Component
 * Individual dot positioned in a circular pattern
 */
const CircularDot: React.FC<CircularDotProps> = ({ delay, size, color, x, y }) => {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
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
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.3, {
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
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.circularDot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: x,
          top: y,
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
  circularContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularDot: {
    position: 'absolute',
  },
});
