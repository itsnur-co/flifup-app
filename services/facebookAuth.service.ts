/**
 * Facebook Authentication Service
 * 
 * ============================================
 * SETUP INSTRUCTIONS
 * ============================================
 * 
 * 1. CREATE FACEBOOK APP
 *    - Go to https://developers.facebook.com/
 *    - Create a new app (Consumer type)
 *    - Add "Facebook Login" product
 * 
 * 2. GET CREDENTIALS FROM FACEBOOK DEVELOPER CONSOLE:
 *    - App ID: Found in Settings > Basic
 *    - Client Token: Settings > Advanced > Client Token
 * 
 * 3. CONFIGURE FACEBOOK APP:
 *    - Settings > Basic:
 *      - App Domains: Add your domain (for web)
 *      - Privacy Policy URL: Required for production
 *      - Terms of Service URL: Required for production
 *    
 *    - Facebook Login > Settings:
 *      - Valid OAuth Redirect URIs: 
 *        - For Android: fb{APP_ID}://authorize
 *        - For iOS: fb{APP_ID}://authorize
 *        - For Web: https://your-domain.com/auth/facebook/callback
 * 
 * 4. FOR ANDROID:
 *    - Add Key Hash to Facebook Developer Console
 *    - Generate debug key hash:
 *      keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
 *    - Package Name: com.flifup.app
 *    - Class Name: com.flifup.app.MainActivity
 * 
 * 5. FOR iOS:
 *    - Bundle ID: com.flifup.app
 *    - Enable "Single Sign On"
 *    - Enable "Deep Linking"
 * 
 * 6. ADD TO app.json:
 *    ```json
 *    {
 *      "expo": {
 *        "plugins": [
 *          [
 *            "react-native-fbsdk-next",
 *            {
 *              "appID": "YOUR_FACEBOOK_APP_ID",
 *              "clientToken": "YOUR_CLIENT_TOKEN",
 *              "displayName": "Flifup",
 *              "scheme": "fbYOUR_FACEBOOK_APP_ID",
 *              "advertiserIDCollectionEnabled": false,
 *              "autoLogAppEventsEnabled": false,
 *              "isAutoInitEnabled": true,
 *              "iosUserTrackingPermission": "This identifier will be used to deliver personalized ads to you."
 *            }
 *          ]
 *        ]
 *      }
 *    }
 *    ```
 * 
 * 7. INSTALL PACKAGE:
 *    npx expo install react-native-fbsdk-next
 * 
 * 8. REBUILD APP:
 *    npx eas build --platform android --profile development
 *    npx eas build --platform ios --profile development
 * 
 * ============================================
 * CREDENTIALS YOU NEED TO PROVIDE:
 * ============================================
 * - FACEBOOK_APP_ID: Your Facebook App ID
 * - FACEBOOK_CLIENT_TOKEN: Your Client Token from Facebook
 * - FACEBOOK_APP_SECRET: (Backend only) App Secret for token verification
 * 
 * ============================================
 */

// Types
interface FacebookUser {
  id: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
}

interface FacebookLoginResult {
  accessToken: string;
  user: FacebookUser;
}

// Import Facebook SDK (will fail gracefully if not installed)
let LoginManager: any = null;
let AccessToken: any = null;
let Profile: any = null;
let Settings: any = null;

try {
  const fbsdk = require("react-native-fbsdk-next");
  LoginManager = fbsdk.LoginManager;
  AccessToken = fbsdk.AccessToken;
  Profile = fbsdk.Profile;
  Settings = fbsdk.Settings;
} catch (error) {
  console.warn(
    "Facebook SDK not available. Install react-native-fbsdk-next and rebuild."
  );
}

const FB_SDK_AVAILABLE = Boolean(LoginManager && AccessToken);

// Configuration
const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || "";

/**
 * Initialize Facebook SDK
 * Call this once when app starts (in _layout.tsx)
 */
export const initializeFacebookSDK = () => {
  if (!FB_SDK_AVAILABLE) {
    console.warn("Facebook SDK not available");
    return;
  }

  try {
    // Initialize settings if needed
    if (Settings && FACEBOOK_APP_ID) {
      Settings.setAppID(FACEBOOK_APP_ID);
    }
    console.log("Facebook SDK initialized");
  } catch (error) {
    console.error("Error initializing Facebook SDK:", error);
  }
};

/**
 * Sign in with Facebook
 * Returns access token and user info to send to backend
 */
export const signInWithFacebook = async (): Promise<FacebookLoginResult> => {
  if (!FB_SDK_AVAILABLE) {
    throw new Error(
      "Facebook Sign-In is not available. Please install react-native-fbsdk-next and rebuild the app with EAS Build."
    );
  }

  try {
    // Request login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw new Error("Sign in cancelled");
    }

    // Get access token
    const tokenData = await AccessToken.getCurrentAccessToken();

    if (!tokenData) {
      throw new Error("No access token returned from Facebook");
    }

    const accessToken = tokenData.accessToken;

    // Get user profile
    const user = await fetchFacebookUserProfile(accessToken);

    console.log("Facebook Sign-In successful, user:", user.email || user.name);

    return {
      accessToken,
      user,
    };
  } catch (error: any) {
    if (error.message === "Sign in cancelled") {
      throw error;
    }
    console.error("Facebook Sign-In error:", error);
    throw new Error(error.message || "Facebook Sign-In failed");
  }
};

/**
 * Fetch user profile from Facebook Graph API
 */
const fetchFacebookUserProfile = async (accessToken: string): Promise<FacebookUser> => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture.type(large)&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Facebook profile");
    }

    const data = await response.json();
    return data as FacebookUser;
  } catch (error) {
    console.error("Error fetching Facebook profile:", error);
    throw error;
  }
};

/**
 * Sign out from Facebook
 */
export const signOutFacebook = async (): Promise<void> => {
  if (!FB_SDK_AVAILABLE) {
    return;
  }

  try {
    LoginManager.logOut();
    console.log("Signed out from Facebook");
  } catch (error) {
    console.error("Error signing out from Facebook:", error);
  }
};

/**
 * Check if user has a valid Facebook access token
 */
export const isFacebookLoggedIn = async (): Promise<boolean> => {
  if (!FB_SDK_AVAILABLE) {
    return false;
  }

  try {
    const tokenData = await AccessToken.getCurrentAccessToken();
    return !!tokenData;
  } catch (error) {
    return false;
  }
};

/**
 * Get current Facebook access token
 */
export const getFacebookAccessToken = async (): Promise<string | null> => {
  if (!FB_SDK_AVAILABLE) {
    return null;
  }

  try {
    const tokenData = await AccessToken.getCurrentAccessToken();
    return tokenData?.accessToken || null;
  } catch (error) {
    console.error("Error getting Facebook access token:", error);
    return null;
  }
};

/**
 * Get current Facebook user profile
 */
export const getCurrentFacebookUser = async (): Promise<FacebookUser | null> => {
  if (!FB_SDK_AVAILABLE) {
    return null;
  }

  try {
    const tokenData = await AccessToken.getCurrentAccessToken();
    if (!tokenData) {
      return null;
    }

    return await fetchFacebookUserProfile(tokenData.accessToken);
  } catch (error) {
    console.error("Error getting current Facebook user:", error);
    return null;
  }
};

/**
 * Check if Facebook SDK is available
 */
export const isFacebookSDKAvailable = (): boolean => {
  return FB_SDK_AVAILABLE;
};
