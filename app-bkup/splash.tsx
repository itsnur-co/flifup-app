import { RoadLinesSVG } from '@/components/animations';
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
    }, 4500);

    return () => clearTimeout(navigationTimer);
  }, []);

  const startAnimationSequence = () => {
    // Logo fade in and scale
    logoOpacity.value = withDelay(
      1200,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );

    logoScale.value = withDelay(
      1200,
      withSequence(
        withTiming(1.1, {
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
        }),
        withTiming(1, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        })
      )
    );

    // Spinner appears
    spinnerOpacity.value = withDelay(
      1500,
      withTiming(1, { duration: 600 })
    );

    // Circle expansion
    circleScale.value = withDelay(
      3200,
      withTiming(20, {
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );

    circleOpacity.value = withDelay(
      3200,
      withTiming(1, {
        duration: 1000,
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



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />

      {/* Animated Road Lines SVG */}
      <RoadLinesSVG width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />

      {/* Logo Container with Circle Background */}
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.circle, circleStyle]} />

        <Animated.View style={[styles.logoWrapper, logoContainerStyle]}>
          <View style={styles.logoBorder}>
            <Logo size={80} variant="white" />
          </View>
        </Animated.View>
      </View>


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
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
