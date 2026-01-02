let GoogleSignin: any = null;
let statusCodes: any = null;

// Try to import native module, but don't fail if not available (for Expo Go)
try {
  const module = require("@react-native-google-signin/google-signin");
  GoogleSignin = module.GoogleSignin;
  statusCodes = module.statusCodes;
} catch (error) {
  console.warn(
    "GoogleSignin native module not available - Google Sign-In will not work in Expo Go"
  );
  console.warn(
    "Use EAS Build for custom development build: https://docs.expo.dev/build/setup/"
  );
}

// Get Google Client ID from environment variables
// For Expo: set EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env.local
// For web: set REACT_APP_GOOGLE_CLIENT_ID in .env
const GOOGLE_CLIENT_ID =
  (typeof process !== "undefined" &&
    (process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.REACT_APP_GOOGLE_CLIENT_ID)) ||
  "your_google_client_id.apps.googleusercontent.com";

const NATIVE_MODULE_AVAILABLE = Boolean(GoogleSignin);

/**
 * Configure Google Sign-In with your credentials
 * Call this once when the app starts (in _layout.tsx)
 * Wrapped in try-catch to handle environments without native module
 */
export const configureGoogleSignIn = () => {
  if (!NATIVE_MODULE_AVAILABLE) {
    console.warn(
      "GoogleSignin native module not available. Testing mode enabled. Use EAS Build for production."
    );
    return;
  }

  try {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ["profile", "email"],
    });
    console.log("Google Sign-In configured successfully");
  } catch (error) {
    console.warn("Error configuring Google Sign-In:", error);
  }
};

/**
 * Sign in with Google and get ID token
 * Returns the ID token to send to backend
 */
export const signInWithGoogle = async (): Promise<string> => {
  if (!NATIVE_MODULE_AVAILABLE) {
    throw new Error(
      "Google Sign-In is not available in Expo Go. Please use EAS Build to create a custom development build with native modules."
    );
  }

  try {
    // Check if device has Google Play Services
    await GoogleSignin.hasPlayServices();

    // Sign in and get user info
    const response = await GoogleSignin.signIn();

    // Get the ID token from the response
    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error("No ID token returned from Google Sign-In");
    }

    console.log("Google Sign-In successful, ID token obtained");
    return idToken;
  } catch (error: any) {
    if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
      console.log("Sign in was cancelled");
      throw new Error("Sign in cancelled");
    } else if (error.code === statusCodes?.IN_PROGRESS) {
      console.log("Sign in is in progress");
      throw new Error("Sign in in progress");
    } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("Google Play Services not available");
      throw new Error("Google Play Services not available");
    } else {
      console.error("Google Sign-In error:", error);
      throw error;
    }
  }
};

/**
 * Sign out from Google
 */
export const signOutGoogle = async (): Promise<void> => {
  if (!NATIVE_MODULE_AVAILABLE) {
    console.warn("Google Sign-Out not available in Expo Go");
    return;
  }

  try {
    await GoogleSignin.signOut();
    console.log("Signed out from Google");
  } catch (error) {
    console.error("Error signing out from Google:", error);
  }
};

/**
 * Get the currently signed-in user info
 */
export const getCurrentGoogleUser = async () => {
  if (!NATIVE_MODULE_AVAILABLE) {
    return null;
  }

  try {
    const response = await GoogleSignin.getCurrentUser();
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.error("Error getting current Google user:", error);
    return null;
  }
};
