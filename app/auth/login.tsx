import { PrimaryButton, SocialButton } from "@/components/buttons";
import { TextInput } from "@/components/inputs";
import { Logo } from "@/components/logo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
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
      // TODO: API temporarily disconnected for frontend development
      // const response = await authService.login({
      //   email: emailOrPhone.trim(),
      //   password,
      // });

      // if (response.error) {
      //   setErrors({ emailOrPhone: response.error });
      //   Alert.alert('Login Failed', response.error);
      //   return;
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success - navigate to tabs
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
   * Handles social sign in
   */
  const handleSocialSignIn = (provider: "google" | "facebook") => {
    // TODO: Implement social authentication
    console.log(`Sign in with ${provider}`);
  };

  /**
   * Navigates to sign up screen
   */
  const handleSignUp = () => {
    router.push("/auth/signup");
  };

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
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <PrimaryButton
              title="Sign In"
              onPress={handleSignIn}
              loading={isLoading}
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
              />
              <SocialButton
                provider="google"
                onPress={() => handleSocialSignIn("google")}
              />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
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
    fontWeight: 500,
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
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: Colors.ui.white,
    borderRadius: 3,
    alignSelf: "center",
    opacity: 0.8,
  },
});
