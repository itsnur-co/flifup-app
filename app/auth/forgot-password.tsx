import { PrimaryButton } from '@/components/buttons';
import { TextInput } from '@/components/inputs';
import { ScreenHeader } from '@/components/navigation';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * Forgot Password Screen
 * Allows users to request password reset OTP via email/phone
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();

  // Form state
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validates email or phone input
   */
  const validateInput = (): boolean => {
    if (!emailOrPhone.trim()) {
      setError('Email or phone is required');
      return false;
    }

    if (emailOrPhone.includes('@')) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone)) {
        setError('Please enter a valid email');
        return false;
      }
    } else {
      // Phone validation
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(emailOrPhone.replace(/\s/g, ''))) {
        setError('Please enter a valid phone number');
        return false;
      }
    }

    return true;
  };

  /**
   * Handles send OTP action
   */
  const handleSendOTP = async () => {
    if (!validateInput()) return;

    setIsLoading(true);

    try {
      // TODO: Implement actual OTP send logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Send OTP to:', emailOrPhone);

      // Navigate to verification screen with email/phone
      router.push({
        pathname: '/auth/verification',
        params: { contact: emailOrPhone },
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScreenHeader title='Forgot Password?' backgroundColor={Colors.primary} style={{ marginTop: 8 }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.scrollContent}
        >


          {/* Form Container */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(400)}
            style={styles.formContainer}
          >
            {/* Description */}
            <Text style={styles.description}>
              Enter you Email address or Phone number and{'\n'}we will send you code
            </Text>

            {/* Email/Phone Input */}
            <View style={styles.inputSection}>
              <TextInput
                label="Email"
                placeholder="Enter your User Email"
                value={emailOrPhone}
                onChangeText={(text) => {
                  setEmailOrPhone(text);
                  setError(undefined);
                }}
                error={error}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Spacer to push button to bottom */}
            <View style={styles.spacer} />

            {/* Send OTP Button */}
            <PrimaryButton
              title="Send OTP"
              onPress={handleSendOTP}
              loading={isLoading}
              style={styles.sendButton}
              textStyle={styles.sendButtonText}
            />
          </Animated.View>
        </View>
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
    paddingHorizontal: 14,
    paddingTop: 32,
    paddingBottom: 32,
  },

  description: {
    fontSize: 14,
    color: "gray",
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,

  },
  inputSection: {
    marginBottom: 16,
  },
  spacer: {
    flex: 1,
    minHeight: 200,
  },
  sendButton: {
    backgroundColor: Colors.primary,
  },
  sendButtonText: {
    color: Colors.ui.white,
  },
});
