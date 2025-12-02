import { LoadingSpinner } from '@/components/animations';
import { Logo } from '@/components/logo';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Animated Road Line Component
 * Creates individual animated lines that move like roads
 */
interface RoadLineProps {
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isBlue?: boolean;
}

const RoadLine: React.FC<RoadLineProps> = ({
  delay,
  startX,
  startY,
  endX,
  endY,
  isBlue = false,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const currentX = startX + (endX - startX) * progress.value;
    const currentY = startY + (endY - startY) * progress.value;

    return {
      position: 'absolute',
      left: currentX,
      top: currentY,
      width: (endX - startX) * progress.value,
      height: 3,
      backgroundColor: isBlue ? Colors.secondary : Colors.primary,
      borderRadius: 2,
      opacity: progress.value,
    };
  });

  return <Animated.View style={animatedStyle} />;
};

/**
 * Animated Splash Screen
 * Main splash screen with road lines animation, logo, and circle expansion
 */
export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const circleScale = useSharedValue(1);
  const circleOpacity = useSharedValue(1);
  const spinnerOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations sequence
    startAnimationSequence();

    // Navigate after animation completes
    const navigationTimer = setTimeout(() => {
      router.replace('/auth/start');
    }, 3000);

    return () => clearTimeout(navigationTimer);
  }, []);

  const startAnimationSequence = () => {
    // Logo fade in and scale
    logoOpacity.value = withDelay(
      800,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      })
    );

    logoScale.value = withDelay(
      800,
      withSequence(
        withTiming(1.1, {
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
        }),
        withTiming(1, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
        })
      )
    );

    // Spinner appears
    spinnerOpacity.value = withDelay(
      1000,
      withTiming(1, { duration: 400 })
    );

    // Circle expansion
    circleScale.value = withDelay(
      2200,
      withTiming(20, {
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );

    circleOpacity.value = withDelay(
      2200,
      withTiming(1, {
        duration: 800,
      })
    );
  };

  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: spinnerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

      {/* Animated Road Lines */}
      <RoadLine
        delay={0}
        startX={SCREEN_WIDTH * 0.6}
        startY={SCREEN_HEIGHT * 0.3}
        endX={SCREEN_WIDTH * 0.85}
        endY={SCREEN_HEIGHT * 0.2}
      />
      <RoadLine
        delay={200}
        startX={SCREEN_WIDTH * 0.6}
        startY={SCREEN_HEIGHT * 0.35}
        endX={SCREEN_WIDTH * 0.9}
        endY={SCREEN_HEIGHT * 0.25}
      />
      <RoadLine
        delay={100}
        startX={SCREEN_WIDTH * 0.2}
        startY={SCREEN_HEIGHT * 0.75}
        endX={SCREEN_WIDTH * 0.05}
        endY={SCREEN_HEIGHT * 0.9}
        isBlue
      />
      <RoadLine
        delay={300}
        startX={SCREEN_WIDTH * 0.25}
        startY={SCREEN_HEIGHT * 0.78}
        endX={SCREEN_WIDTH * 0.1}
        endY={SCREEN_HEIGHT * 0.92}
        isBlue
      />

      {/* Logo Container with Circle Background */}
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.circle, circleStyle]} />

        <Animated.View style={[styles.logoWrapper, logoContainerStyle]}>
          <View style={styles.logoBorder}>
            <Logo size={80} variant="white" />
          </View>
        </Animated.View>
      </View>

      {/* Loading Spinner */}
      <Animated.View style={[styles.spinnerContainer, spinnerStyle]}>
        <LoadingSpinner size={8} color={Colors.primary} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    borderWidth: 6,
    borderColor: Colors.primary,
  },
  logoWrapper: {
    zIndex: 11,
  },
  logoBorder: {
    padding: 20,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15,
  },
});
