import { PrimaryButton } from "@/components/buttons";
import { OTPInput } from "@/components/inputs";
import { ScreenHeader } from "@/components/navigation";
import { Colors } from "@/constants/colors";
import { authService } from "@/services/api/auth.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import Animated, { FadeInDown } from "react-native-reanimated";

/**
 * Verification Screen
 * Handles OTP verification for password reset
 */
export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const contact = (params.contact as string) || "your email";
  const type = (params.type as string) || "password-reset"; // 'password-reset' or 'signup'

  // State
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  /**
   * Formats timer display (MM:SS)
   */
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /**
   * Handles OTP completion
   */
  const handleOTPComplete = (otpValue: string) => {
    console.log("OTP entered:", otpValue);
    setOtp(otpValue);
  };

  /**
   * Handles verify OTP action
   */
  const handleVerify = async () => {
    if (otp.length !== 4) {
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await authService.verifyOtp({
        email: contact,
        otp,
      });

      if (response.error) {
        setError(response.error);
        Alert.alert("Verification Failed", response.error);
        return;
      }

      if (response.data) {
        // Store reset token for password reset
        setResetToken(response.data.resetToken);

        Alert.alert(
          "Success",
          "OTP verified successfully. Please create a new password.",
          [
            {
              text: "OK",
              onPress: () => {
                router.push({
                  pathname: "/auth/create-new-password",
                  params: { resetToken: response.data.resetToken },
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setError("Verification failed. Please try again.");
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles resend OTP action
   */
  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const response = await authService.forgotPassword({
        email: contact,
      });

      if (response.error) {
        Alert.alert("Failed", response.error);
        return;
      }

      Alert.alert("Success", "OTP has been resent to your email.");

      // Reset timer
      setTimer(600);
      setCanResend(false);
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScreenHeader
        title="Verification"
        backgroundColor={Colors.primary}
        style={{ marginTop: 8 }}
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
          {/* Form Container */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(400)}
            style={styles.formContainer}
          >
            {/* Description */}
            <Text style={styles.description}>
              We've sent a verification code to your email
            </Text>
            <Text style={styles.email}>{contact}</Text>

            {/* OTP Input */}
            <OTPInput
              length={4}
              onComplete={handleOTPComplete}
              onChangeText={setOtp}
              containerStyle={styles.otpContainer}
            />

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Timer */}
            <Text style={styles.timer}>{formatTimer(timer)}</Text>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.resendLink,
                    !canResend && styles.resendLinkDisabled,
                  ]}
                >
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>

            {/* Spacer to push button down */}
            <View style={styles.spacer} />

            {/* Next Button */}
            <PrimaryButton
              title="Next"
              onPress={handleVerify}
              loading={isLoading}
              disabled={otp.length !== 4}
              style={styles.nextButton}
              textStyle={styles.nextButtonText}
            />
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
    paddingBottom: 60,
  },
  topBar: {
    paddingTop: 48,
    paddingBottom: 24,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 14,
    paddingTop: 32,
    paddingBottom: 32,
    minHeight: 500,
  },
  description: {
    marginTop: 24,
    fontWeight: "500",
    fontSize: 16,
    color: Colors.ui.white,
    textAlign: "center",
    lineHeight: 24,
  },
  email: {
    fontSize: 18,
    color: Colors.ui.white,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 24,
  },
  otpContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#FF4444",
    textAlign: "center",
    marginBottom: 12,
  },
  timer: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.ui.white,
    textAlign: "center",
    marginBottom: 14,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
  nextButtonText: {
    color: Colors.ui.white,
  },
});
