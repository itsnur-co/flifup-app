/**
 * API Configuration
 * Contains base URL and common headers for API requests
 */

import { Platform } from 'react-native';

/**
 * Get the correct base URL based on platform
 * - Android Emulator: Use 10.0.2.2 (maps to host machine's localhost)
 * - iOS Simulator: Use localhost
 * - Physical Device: Use your computer's local IP address (e.g., 192.168.1.x)
 */
const getBaseURL = (): string => {
  // Change this to your computer's local IP if testing on physical device
  const LOCAL_IP = '192.168.1.100'; // Update this with your machine's IP
  const PORT = '3000';

  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator - use 10.0.2.2 to connect to host machine
      return `http://10.0.2.2:${PORT}/api/v1`;
    } else if (Platform.OS === 'ios') {
      // iOS simulator - localhost works
      return `http://localhost:${PORT}/api/v1`;
    } else {
      // Physical device or other platforms
      return `http://${LOCAL_IP}:${PORT}/api/v1`;
    }
  } else {
    // Production mode - replace with your production API URL
    return 'https://api.flifup.com/api/v1';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    INITIATE_SIGNUP: '/auth/initiate-signup',
    VERIFY_SIGNUP_OTP: '/auth/verify-signup-otp',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
};
