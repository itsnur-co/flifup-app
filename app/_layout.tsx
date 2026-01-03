import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Keep splash screen visible until we're ready
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root Layout Component
 * Configures navigation stack and theme
 *
 * FIXED:
 * - Proper splash screen flow
 * - Auth state synchronization
 * - Prevents navigation race conditions
 */

// Inner component that handles navigation based on auth state
function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Services initialization removed - no third-party auth providers

  // Handle navigation readiness
  useEffect(() => {
    // Wait a tick to ensure navigation is mounted
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle auth state changes and route protection
  useEffect(() => {
    if (isLoading || !isNavigationReady) {
      return;
    }

    const inAuthGroup = segments[0] === "auth";
    const inSplash = segments[0] === "splash";
    const inTabs = segments[0] === "(tabs)";

    // Always let splash screen handle initial navigation
    if (inSplash) {
      return;
    }

    // If authenticated and trying to access auth screens, redirect to tabs
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }

    // If not authenticated and trying to access protected routes, redirect to start
    if (!isAuthenticated && inTabs) {
      router.replace("/auth/start");
      return;
    }
  }, [isLoading, isAuthenticated, segments, isNavigationReady, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 200,
        }}
      >
        {/* Root Index - Redirects to Splash */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />

        {/* Splash Screen - Entry Point with Animation */}
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />

        {/* Auth Flow */}
        <Stack.Screen
          name="auth/start"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="auth/email-verification"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="auth/forgot-password"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Main App Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />

        {/* Tasks Screen - No bottom bar */}
        <Stack.Screen
          name="tasks"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Habit Screen - No bottom bar */}
        <Stack.Screen
          name="habit"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Habit Progress Screen - No bottom bar */}
        <Stack.Screen
          name="habit-progress"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Journal Screens */}
        <Stack.Screen
          name="journal"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="journal-insights"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Goals Screens */}
        <Stack.Screen
          name="goals"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="goal-details"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Focus Screen */}
        <Stack.Screen
          name="focus"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Profile Screens */}
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Task Detail Screens */}
        <Stack.Screen
          name="task-details"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="task-progress"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Modal Screens */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

// Configure splash as the initial route
export const unstable_settings = {
  initialRouteName: "splash",
};

/**
 * Root Layout with Auth Provider
 * Ensures splash screen is always the entry point
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
