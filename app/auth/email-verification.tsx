import { PrimaryButton } from '@/components/buttons';
import { OTPInput } from '@/components/inputs';
import { ScreenHeader } from '@/components/navigation';
import { Colors } from '@/constants/colors';
import { authService } from '@/services/api/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * Email Verification Screen
 * Handles OTP verification for signup (email verification)
 */
export default function EmailVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string || '';
  const { login } = useAuth();

  // State
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | undefined>();

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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handles OTP completion
   */
  const handleOTPComplete = (otpValue: string) => {
    console.log('OTP entered:', otpValue);
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
      const response = await authService.verifySignupOtp({
        email,
        otp,
      });

      if (response.error) {
        setError(response.error);
        Alert.alert('Verification Failed', response.error);
        return;
      }

      if (response.data) {
        // User is now logged in, update auth context
        login(response.data.user);

        Alert.alert(
          'Success',
          'Your account has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to main app
                router.replace('/(tabs)');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Verification failed. Please try again.');
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
      // Extract email from signup to resend OTP
      // Note: This would require calling initiate-signup again
      // For now, we'll just show a message
      Alert.alert(
        'Resend OTP',
        'To resend OTP, please go back and try signing up again.',
        [
          {
            text: 'Go Back',
            onPress: () => router.back(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );

      // Reset timer
      setTimer(600);
      setCanResend(false);
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <Text style={styles.email}>{email}</Text>

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
              title="Verify & Create Account"
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
    fontWeight: '500',
    fontSize: 16,
    color: Colors.ui.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontSize: 18,
    color: Colors.ui.white,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  timer: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.ui.white,
    textAlign: 'center',
    marginBottom: 14,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
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
