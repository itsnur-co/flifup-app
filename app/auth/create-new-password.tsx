import { PrimaryButton } from '@/components/buttons';
import {
  PasswordRequirement,
  PasswordStrengthIndicator,
  TextInput,
} from '@/components/inputs';
import { ScreenHeader } from '@/components/navigation';
import { Colors } from '@/constants/colors';
import {
  calculatePasswordStrength,
  getPasswordRequirements,
} from '@/utils/passwordValidation';
import { authService } from '@/services/api/auth.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * Create New Password Screen
 * Allows users to set a new password after verification
 */
export default function CreateNewPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const resetToken = params.resetToken as string || '';

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
    } else if (!passwordRequirements.hasUppercase) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!passwordRequirements.hasLowercase) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!passwordRequirements.hasNumber) {
      newErrors.password = 'Password must contain at least one number';
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

    if (!resetToken) {
      Alert.alert('Error', 'Reset token is missing. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        resetToken,
        newPassword: password,
        confirmPassword,
      });

      if (response.error) {
        setErrors({ password: response.error });
        Alert.alert('Reset Failed', response.error);
        return;
      }

      if (response.data) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully. Please login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.push('/auth/password-reset-success');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ password: 'Failed to reset password. Please try again.' });
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScreenHeader title='Create New Password' backgroundColor={Colors.primary} style={{ marginTop: 8 }} />

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
              Your password must be different from{'\n'}previous used password
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
                text="an uppercase letter"
                met={passwordRequirements.hasUppercase}
              />
              <PasswordRequirement
                text="a lowercase letter"
                met={passwordRequirements.hasLowercase}
              />
              <PasswordRequirement
                text="a number"
                met={passwordRequirements.hasNumber}
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
  },
  description: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.ui.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
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
