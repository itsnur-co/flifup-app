import { PrimaryButton, SocialButton } from "@/components/buttons";
import { TextInput } from "@/components/inputs";
import { Logo } from "@/components/logo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/api/auth.service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

/**
 * Login Screen
 * Handles user authentication with email/phone and password
 * Includes social login options (Google, Facebook)
 */
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // Form state
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);

  /**
   * Validates form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: { emailOrPhone?: string; password?: string } = {};

    // Email/Phone validation
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required";
    } else if (emailOrPhone.includes("@")) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone)) {
        newErrors.emailOrPhone = "Please enter a valid email";
      }
    } else {
      // Basic phone validation (digits only, 10-15 characters)
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(emailOrPhone.replace(/\s/g, ""))) {
        newErrors.emailOrPhone = "Please enter a valid phone number";
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles sign in action
   */
  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: emailOrPhone.trim(),
        password,
      });

      if (response.error) {
        setErrors({ emailOrPhone: response.error });
        Alert.alert("Login Failed", response.error);
        return;
      }

      // Success - navigate to tabs
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Sign in error:", error);
      setErrors({ emailOrPhone: "Invalid credentials. Please try again." });
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles forgot password action
   */
  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  /**
   * Handles Google Sign In
   */
  const handleGoogleSignIn = async () => {
    setSocialLoading("google");

    try {
      // Lazy-load Google Sign-In to avoid native module errors
      const { signInWithGoogle } = await import("@/services/googleAuth.service");

      // Get ID token from Google Sign-In
      const idToken = await signInWithGoogle();

      // Send ID token to backend
      const response = await authService.googleLogin({ idToken });

      if (response.error) {
        Alert.alert("Google Sign-In Failed", response.error);
        return;
      }

      // Success - navigate to tabs
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Google Sign-In error:", error);

      // Check for specific error types
      if (error.message?.includes("cancelled")) {
        // User cancelled - no need to show alert
        return;
      }

      if (error.message?.includes("not available in Expo Go")) {
        Alert.alert(
          "Google Sign-In Not Available",
          "Google Sign-In requires a native build. Please:\n\n" +
            "1. Use EAS Build: npx eas build --platform android\n" +
            "2. Install the APK on your device\n\n" +
            "For now, you can test with email/password login.",
          [{ text: "OK" }]
        );
      } else if (error.message?.includes("DEVELOPER_ERROR")) {
        Alert.alert(
          "Configuration Error",
          "Google Sign-In is not configured correctly. Please check:\n\n" +
            "1. Web Client ID is correct in googleAuth.service.ts\n" +
            "2. SHA-1 fingerprint is added to Google Cloud Console\n" +
            "3. Package name matches (com.flifup.app)",
          [{ text: "OK" }]
        );
      } else if (error.message?.includes("No ID token")) {
        Alert.alert(
          "Sign-In Error",
          "Could not get authentication token from Google. This is usually caused by incorrect OAuth configuration.\n\n" +
            "Please verify your Google Cloud Console settings.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Google Sign-In Error",
          error.message || "An error occurred during Google Sign-In. Please try again."
        );
      }
    } finally {
      setSocialLoading(null);
    }
  };

  /**
   * Handles Facebook Sign In
   */
  const handleFacebookSignIn = async () => {
    setSocialLoading("facebook");

    try {
      // Lazy-load Facebook Sign-In
      const { signInWithFacebook, isFacebookSDKAvailable } = await import(
        "@/services/facebookAuth.service"
      );

      // Check if SDK is available
      if (!isFacebookSDKAvailable()) {
        Alert.alert(
          "Facebook Sign-In Not Available",
          "Facebook Sign-In requires a native build with the Facebook SDK.\n\n" +
            "Please rebuild your app with EAS Build after configuring Facebook SDK in app.json.",
          [{ text: "OK" }]
        );
        return;
      }

      // Get access token and user from Facebook
      const { accessToken, user } = await signInWithFacebook();

      // Send to backend for authentication
      const response = await authService.facebookLogin({
        accessToken,
        userId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture?.data?.url,
      });

      if (response.error) {
        Alert.alert("Facebook Sign-In Failed", response.error);
        return;
      }

      // Success - navigate to tabs
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Facebook Sign-In error:", error);

      if (error.message?.includes("cancelled")) {
        // User cancelled - no need to show alert
        return;
      }

      if (error.message?.includes("not available")) {
        Alert.alert(
          "Facebook Sign-In Not Available",
          "Please install the Facebook SDK and rebuild your app.\n\n" +
            "See the setup instructions in facebookAuth.service.ts",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Facebook Sign-In Error",
          error.message || "An error occurred during Facebook Sign-In"
        );
      }
    } finally {
      setSocialLoading(null);
    }
  };

  /**
   * Handles social sign in
   */
  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    if (provider === "google") {
      await handleGoogleSignIn();
    } else if (provider === "facebook") {
      await handleFacebookSignIn();
    }
  };

  /**
   * Navigates to sign up screen
   */
  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  const isAnyLoading = isLoading || socialLoading !== null;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.gradient.primaryToSecondary.start}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Gradient Section with Logo */}
          <Animated.View entering={FadeInUp.duration(800).delay(200)}>
            <LinearGradient
              colors={[
                Colors.gradient.primaryFull.start,
                Colors.gradient.primaryFull.end,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.logoContainer}>
                <Logo size={50} variant="white" />
                <Text style={styles.brandName}>Flifup</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Login Form Container */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(400)}
            style={styles.formContainer}
          >
            <Text style={styles.title}>Sign In Your Account</Text>

            {/* Email/Phone Input */}
            <TextInput
              label="Email"
              placeholder="Enter your User Email"
              value={emailOrPhone}
              onChangeText={(text) => {
                setEmailOrPhone(text);
                setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
              }}
              error={errors.emailOrPhone}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isAnyLoading}
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              placeholder="********"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              isPassword
              autoCapitalize="none"
              editable={!isAnyLoading}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
              disabled={isAnyLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <PrimaryButton
              title="Sign In"
              onPress={handleSignIn}
              loading={isLoading}
              disabled={isAnyLoading}
              style={styles.signInButton}
              textStyle={styles.signInButtonText}
            />

            {/* Social Sign In Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or Sign In with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Sign In Buttons */}
            <View style={styles.socialButtonsContainer}>
              <SocialButton
                provider="facebook"
                onPress={() => handleSocialSignIn("facebook")}
                loading={socialLoading === "facebook"}
                disabled={isAnyLoading}
              />
              <SocialButton
                provider="google"
                onPress={() => handleSocialSignIn("google")}
                loading={socialLoading === "google"}
                disabled={isAnyLoading}
              />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleSignUp}
                activeOpacity={0.7}
                disabled={isAnyLoading}
              >
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 64,
    paddingHorizontal: 14,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  brandName: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.ui.white,
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 14,
    paddingTop: 22,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.ui.white,
    textAlign: "center",
    marginBottom: 46,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    marginBottom: 24,
  },
  signInButtonText: {
    color: Colors.ui.white,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
  },
  signUpLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});
