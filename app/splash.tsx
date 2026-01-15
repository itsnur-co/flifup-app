import { RoadLinesSVG } from "@/components/animations";
import { Logo } from "@/components/logo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


SplashScreen.preventAutoHideAsync().catch(() => {
  /* Already hidden */
});

export default function SplashScreenComponent() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [canNavigate, setCanNavigate] = useState(false);
  const navigationRef = useRef(false);

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const circleScale = useSharedValue(1);
  const circleOpacity = useSharedValue(1);
  const roadLinesOpacity = useSharedValue(1);

  // Handle navigation after auth check and 2-second animation
  useEffect(() => {
    // Don't navigate if still loading auth state
    if (isLoading) {
      console.log("[Splash] Still loading auth state...");
      return;
    }

    // Don't navigate if we've already navigated
    if (navigationRef.current) {
      console.log("[Splash] Already navigated, skipping...");
      return;
    }

    // Wait for minimum 2 seconds (animation complete)
    if (!canNavigate) {
      console.log("[Splash] Waiting for 2-second animation to complete");
      return;
    }

    // Mark that we're navigating to prevent multiple navigations
    navigationRef.current = true;

    const destination = isAuthenticated ? "/(tabs)" : "/auth/start";
    console.log("[Splash] Navigating to:", destination, "(authenticated:", isAuthenticated, ")");

    // Hide the native splash screen
    SplashScreen.hideAsync().catch(() => {});

    // Navigate to appropriate screen
    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth/start");
    }
  }, [isLoading, canNavigate, isAuthenticated, router]);

  // Start animations on mount and set timer for 2 seconds
  useEffect(() => {
    console.log("[Splash] Starting animation sequence and 2-second timer");
    startAnimationSequence();

    // Set minimum 2-second display time
    const timer = setTimeout(() => {
      console.log("[Splash] 2-second timer complete, enabling navigation");
      setCanNavigate(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log("[Splash] Animation complete callback triggered");
    // Animation is complete but we still respect the 2-second minimum
  };

  const startAnimationSequence = () => {
    console.log("[Splash] Initializing animations");
    // Road lines are visible from start, fade out near end
    roadLinesOpacity.value = withDelay(
      1800,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );

    // Logo fade in and scale
    logoOpacity.value = withDelay(
      500,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      })
    );

    logoScale.value = withDelay(
      500,
      withSequence(
        withTiming(1.1, {
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
        }),
        withTiming(1, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
        })
      )
    );

    // Circle expansion (starts after logo appears)
    circleScale.value = withDelay(
      1500,
      withTiming(
        20,
        {
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(handleAnimationComplete)();
          }
        }
      )
    );

    circleOpacity.value = withDelay(
      1500,
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

  const roadLinesStyle = useAnimatedStyle(() => ({
    opacity: roadLinesOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background.primary}
      />

      {/* Animated Road Lines SVG */}
      <Animated.View style={[styles.roadLinesContainer, roadLinesStyle]}>
        <RoadLinesSVG width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />
      </Animated.View>

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
    justifyContent: "center",
    alignItems: "center",
  },
  roadLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  circle: {
    position: "absolute",
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
});
