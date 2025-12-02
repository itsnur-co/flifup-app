import { PrimaryButton } from '@/components/buttons';
import {
  PasswordRequirement,
  PasswordStrengthIndicator,
  TextInput,
} from '@/components/inputs';
import { Colors } from '@/constants/colors';
import {
  calculatePasswordStrength,
  getPasswordRequirements,
} from '@/utils/passwordValidation';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
 * Create New Password Screen
 * Allows users to set a new password after verification
 */
export default function CreateNewPasswordScreen() {
  const router = useRouter();

  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const passwordRequirements = useMemo(
    () => getPasswordRequirements(password),
    [password]
  );

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  /**
   * Validates form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
    } = {};

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRequirements.hasMinLength) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!passwordRequirements.hasNumber) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!passwordRequirements.hasSymbol) {
      newErrors.password = 'Password must contain at least one symbol';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles reset password action
   */
  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement actual password reset logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Reset password:', { password });

      // Navigate to login screen with success message
      router.replace('/auth/login');
      // TODO: Show success toast/alert
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ password: 'Failed to reset password. Please try again.' });
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
              <Text style={styles.headerTitle}>Create New Password</Text>
            </LinearGradient>
          </Animated.View>

          {/* Form Container */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(400)}
            style={styles.formContainer}
          >
            {/* Description */}
            <Text style={styles.description}>
              Your password must be different from previous used password
            </Text>

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

            {/* Confirm Password Input */}
            <TextInput
              label="Confirm Password"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
              isPassword
              autoCapitalize="none"
            />

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <PasswordStrengthIndicator strength={passwordStrength} />
            )}

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <PasswordRequirement
                text="8 characters minimum"
                met={passwordRequirements.hasMinLength}
              />
              <PasswordRequirement
                text="a number"
                met={passwordRequirements.hasNumber}
              />
              <PasswordRequirement
                text="a symbol"
                met={passwordRequirements.hasSymbol}
              />
            </View>

            {/* Reset Password Button */}
            <PrimaryButton
              title="Reset Password"
              onPress={handleResetPassword}
              loading={isLoading}
              style={styles.resetButton}
              textStyle={styles.resetButtonText}
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
    fontSize: 28,
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
    fontSize: 14,
    color: Colors.ui.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  requirementsContainer: {
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    marginTop: 16,
  },
  resetButtonText: {
    color: Colors.ui.white,
  },
});
