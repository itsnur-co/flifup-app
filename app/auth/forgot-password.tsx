import { PrimaryButton } from '@/components/buttons';
import { TextInput } from '@/components/inputs';
import { Logo } from '@/components/logo';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Gradient Header */}
          <Animated.View entering={FadeInUp.duration(800).delay(200)}>
            <LinearGradient
              colors={[Colors.gradient.primaryFull.start, Colors.gradient.primaryFull.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              {/* Back Button */}
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={28} color={Colors.ui.white} />
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.headerTitle}>Forgot Password?</Text>
            </LinearGradient>
          </Animated.View>

          {/* Form Container */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(400)}
            style={styles.formContainer}
          >
            {/* Description */}
            <Text style={styles.description}>
              Enter you Email address or Phone number and we will send you code
            </Text>

            {/* Email/Phone Input */}
            <TextInput
              label="Email / Phone"
              placeholder="Enter your User Email or Phone"
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

            {/* Send OTP Button */}
            <PrimaryButton
              title="Send OTP"
              onPress={handleSendOTP}
              loading={isLoading}
              style={styles.sendButton}
              textStyle={styles.sendButtonText}
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
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 24,
    position: 'relative',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.ui.white,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    marginTop: -60,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.ui.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    marginTop: 300,
  },
  sendButtonText: {
    color: Colors.ui.white,
  },
});
