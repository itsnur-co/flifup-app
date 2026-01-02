import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "splash",
};

/**
 * Root Layout Component
 * Configures navigation stack and theme
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Lazy-load and initialize Google Sign-In to avoid native module errors in Expo Go
  useEffect(() => {
    const initializeGoogleSignIn = async () => {
      try {
        const { configureGoogleSignIn } = await import(
          "@/services/googleAuth.service"
        );
        configureGoogleSignIn();
      } catch (error) {
        console.warn(
          "Google Sign-In not available in this environment:",
          error
        );
      }
    };

    initializeGoogleSignIn();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Splash Screen - Initial Route */}
          <Stack.Screen
            name="splash"
            options={{
              headerShown: false,
              animation: "fade",
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

          {/* Main App Tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Tasks Screen - No bottom bar */}
          <Stack.Screen name="tasks" options={{ headerShown: false }} />

          {/* Habit Screen - No bottom bar */}
          <Stack.Screen name="habit" options={{ headerShown: false }} />

          {/* Habit Progress Screen - No bottom bar */}
          <Stack.Screen
            name="habit-progress"
            options={{ headerShown: false }}
          />

          {/* Modal Screens */}
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
