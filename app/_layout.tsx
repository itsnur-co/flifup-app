import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'splash',
};

/**
 * Root Layout Component
 * Configures navigation stack and theme
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Splash Screen - Initial Route */}
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />

        {/* Auth Flow */}
        <Stack.Screen
          name="auth/start"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />

        {/* Main App Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal Screens */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
