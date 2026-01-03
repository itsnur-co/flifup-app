/**
 * Google Authentication Service
 *
 * IMPORTANT: To fix DEVELOPER_ERROR and "No ID token" errors:
 *
 * 1. Go to Google Cloud Console: https://console.cloud.google.com
 * 2. Navigate to APIs & Services > Credentials
 * 3. You need TWO OAuth 2.0 Client IDs:
 *    - Web Client (for backend verification) - Use this ID in webClientId
 *    - Android Client (for app) - Must have correct SHA-1 fingerprint
 *
 * 4. For Android Client:
 *    - Get SHA-1: cd android && ./gradlew signingReport
 *    - Or for debug: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
 *    - Package name: com.flifup.app (must match app.json)
 *
 * 5. For iOS Client:
 *    - Bundle ID: com.flifup.app
 *    - URL Scheme: Add to app.json under ios.infoPlist.CFBundleURLSchemes
 */

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
}

// ============================================
// CONFIGURATION - REPLACE THESE WITH YOUR IDS
// ============================================

// WEB CLIENT ID - This is the OAuth 2.0 Web Client ID from Google Cloud Console
// This is used for backend token verification
// Format: XXXXX.apps.googleusercontent.com
const WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  "219478745190-lv066nbokj8i9nm4r2vc7ot83ok5f30h.apps.googleusercontent.com";

// Android Client ID (optional - only needed if using serverAuthCode)
const ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";

// iOS Client ID (optional - only needed for iOS specific features)
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";

const NATIVE_MODULE_AVAILABLE = Boolean(GoogleSignin);

/**
 * Configure Google Sign-In with your credentials
 * Call this once when the app starts (in _layout.tsx)
 *
 * CRITICAL: webClientId must be the WEB client ID, not Android/iOS client ID
 * This is a common mistake that causes DEVELOPER_ERROR
 */
export const configureGoogleSignIn = () => {
  if (!NATIVE_MODULE_AVAILABLE) {
    console.warn(
      "GoogleSignin native module not available. Use EAS Build for production."
    );
    return;
  }

  try {
    GoogleSignin.configure({
      // IMPORTANT: This must be your WEB client ID (not Android client ID)
      // The Android client ID is configured in app.json plugin, not here
      webClientId: WEB_CLIENT_ID,

      // Request offline access to get refresh token
      offlineAccess: true,

      // Force getting a fresh token each time
      forceCodeForRefreshToken: true,

      // Request these scopes
      scopes: ["profile", "email"],

      // Android specific: Optional account name hint
      // accountName: '', // Uncomment if you want to hint a specific account

      // iOS specific client ID (only if different from web)
      // iosClientId: IOS_CLIENT_ID,
    });

    console.log(
      "Google Sign-In configured successfully with webClientId:",
      WEB_CLIENT_ID.substring(0, 20) + "..."
    );
  } catch (error) {
    console.error("Error configuring Google Sign-In:", error);
  }
};

/**
 * Sign in with Google and get ID token
 * Returns the ID token to send to backend for verification
 */
export const signInWithGoogle = async (): Promise<string> => {
  if (!NATIVE_MODULE_AVAILABLE) {
    throw new Error(
      "Google Sign-In is not available in Expo Go. Please use EAS Build to create a custom development build."
    );
  }

  try {
    // Check if device has Google Play Services (Android only)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Check if user is already signed in
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      // Sign out first to ensure fresh token
      await GoogleSignin.signOut();
    }

    // Perform sign in
    const response = await GoogleSignin.signIn();

    console.log("Google Sign-In response type:", response?.type);
    console.log("Google Sign-In has data:", !!response?.data);

    // Handle different response structures
    // The response structure varies between library versions
    let idToken: string | null = null;
    let user: any = null;

    if (response?.data) {
      // New response format (v12+)
      idToken = response.data.idToken;
      user = response.data.user;
    } else if (response?.idToken) {
      // Legacy response format
      idToken = response.idToken;
      user = response.user;
    } else if (response?.user?.idToken) {
      // Another possible format
      idToken = response.user.idToken;
      user = response.user;
    }

    // If still no idToken, try to get it from getCurrentUser
    if (!idToken) {
      console.log("No idToken in signIn response, trying getTokens...");
      try {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
        console.log("Got idToken from getTokens:", !!idToken);
      } catch (tokenError) {
        console.log("getTokens failed:", tokenError);
      }
    }

    if (!idToken) {
      // Log more details for debugging
      console.error(
        "Full Google Sign-In response:",
        JSON.stringify(response, null, 2)
      );
      throw new Error(
        "No ID token returned from Google Sign-In. This usually means:\n" +
          "1. The webClientId is incorrect (must be WEB client ID, not Android)\n" +
          "2. SHA-1 fingerprint is not added to Google Cloud Console\n" +
          "3. Package name mismatch in Google Cloud Console"
      );
    }

    console.log("Google Sign-In successful, user:", user?.email || "unknown");
    return idToken;
  } catch (error: any) {
    // Handle specific error codes
    if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
      console.log("Sign in was cancelled by user");
      throw new Error("Sign in cancelled");
    } else if (error.code === statusCodes?.IN_PROGRESS) {
      console.log("Sign in is already in progress");
      throw new Error("Sign in already in progress");
    } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("Google Play Services not available");
      throw new Error(
        "Google Play Services not available. Please install or update Google Play Services."
      );
    } else if (
      error.code === "DEVELOPER_ERROR" ||
      error.message?.includes("DEVELOPER_ERROR")
    ) {
      console.error(
        "DEVELOPER_ERROR - Check your Google Cloud Console configuration:"
      );
      console.error(
        "1. webClientId must be WEB client ID (not Android client ID)"
      );
      console.error("2. Android client must have correct SHA-1 fingerprint");
      console.error("3. Package name must be: com.flifup.app");
      throw new Error(
        "DEVELOPER_ERROR: Follow troubleshooting instructions at " +
          "https://react-native-google-signin.github.io/docs/troubleshooting"
      );
    } else {
      console.error("Google Sign-In error:", error.message || error);
      console.error("Error code:", error.code);
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
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
      console.log("Signed out from Google successfully");
    }
  } catch (error) {
    console.error("Error signing out from Google:", error);
    // Don't throw - signout failure is not critical
  }
};

/**
 * Revoke Google access (completely disconnect)
 */
export const revokeGoogleAccess = async (): Promise<void> => {
  if (!NATIVE_MODULE_AVAILABLE) {
    return;
  }

  try {
    await GoogleSignin.revokeAccess();
    console.log("Google access revoked");
  } catch (error) {
    console.error("Error revoking Google access:", error);
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
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!isSignedIn) {
      return null;
    }

    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser?.data || currentUser || null;
  } catch (error) {
    console.error("Error getting current Google user:", error);
    return null;
  }
};

/**
 * Check if user is signed in with Google
 */
export const isGoogleSignedIn = async (): Promise<boolean> => {
  if (!NATIVE_MODULE_AVAILABLE) {
    return false;
  }

  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error("Error checking Google sign-in status:", error);
    return false;
  }
};

/**
 * Silent sign in - try to sign in without user interaction
 * Useful for restoring session on app start
 */
export const silentSignIn = async (): Promise<string | null> => {
  if (!NATIVE_MODULE_AVAILABLE) {
    return null;
  }

  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo?.data?.idToken || userInfo?.idToken || null;
  } catch (error: any) {
    if (error.code === statusCodes?.SIGN_IN_REQUIRED) {
      // User has not signed in yet or has signed out
      return null;
    }
    console.error("Silent sign-in error:", error);
    return null;
  }
};
