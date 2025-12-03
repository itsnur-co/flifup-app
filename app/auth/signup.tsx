import { PrimaryButton, SocialButton } from '@/components/buttons';
import {
  Checkbox,
  PasswordRequirement,
  PasswordStrengthIndicator,
  TextInput,
} from '@/components/inputs';
import { Logo } from '@/components/logo';
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

/**
 * Sign Up Screen
 * Handles user registration with full name, email/phone, and password
 * Includes password strength validation and terms agreement
 */
export default function SignUpScreen() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    emailOrPhone?: string;
    password?: string;
    terms?: string;
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
      fullName?: string;
      emailOrPhone?: string;
      password?: string;
      terms?: string;
    } = {};

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email/Phone validation
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone is required';
    } else if (emailOrPhone.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid email';
      }
    } else {
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(emailOrPhone.replace(/\s/g, ''))) {
        newErrors.emailOrPhone = 'Please enter a valid phone number';
      }
    }

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

    // Terms validation
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles sign up action
   */
  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Sign up with:', { fullName, emailOrPhone, password });

      // Navigate to main app or verification screen
      // router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({ emailOrPhone: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles social sign up
   */
  const handleSocialSignUp = (provider: 'google' | 'facebook') => {
    // TODO: Implement social authentication
    console.log(`Sign up with ${provider}`);
  };

  /**
   * Navigates to sign in screen
   */
  const handleSignIn = () => {
    router.push('/auth/login');
  };

  /**
   * Opens terms of service
   */
  const handleTermsPress = () => {
    // TODO: Open terms of service screen or modal
    console.log('Open Terms of Service');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradient.primaryToSecondary.start} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              colors={[Colors.gradient.primaryFull.start, Colors.gradient.primaryFull.end]}
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

          {/* Sign Up Form Container */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(400)}
            style={styles.formContainer}
          >
            <Text style={styles.title}>Create a New Account</Text>

            {/* Full Name Input */}
            <TextInput
              label="Full Name"
              placeholder="Enter your Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              error={errors.fullName}
              autoCapitalize="words"
              autoCorrect={false}
            />

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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              error={errors.password}
              isPassword
              autoCapitalize="none"
            />

            {/* Password Strength Indicator */}
            {isPasswordFocused && password.length > 0 && (
              <PasswordStrengthIndicator strength={passwordStrength} />
            )}

            {/* Password Requirements */}
            {isPasswordFocused && (
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
            )}

            {/* Terms and Conditions Checkbox */}
            <View style={styles.termsContainer}>
              <Checkbox
                checked={agreeToTerms}
                onPress={() => {
                  setAgreeToTerms(!agreeToTerms);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                labelComponent={
                  <Text style={styles.termsText}>
                    Yes, I understand and agree to the{' '}
                    <Text style={styles.termsLink} onPress={handleTermsPress}>
                      Terms of Service
                    </Text>
                  </Text>
                }
              />
            </View>
            {errors.terms && <Text style={styles.termsError}>{errors.terms}</Text>}

            {/* Sign Up Button */}
            <PrimaryButton
              title="Sign Up"
              onPress={handleSignUp}
              loading={isLoading}
              style={styles.signUpButton}
              textStyle={styles.signUpButtonText}
            />

            {/* Social Sign Up Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or Sign up with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Sign Up Buttons */}
            <View style={styles.socialButtonsContainer}>
              <SocialButton provider="facebook" onPress={() => handleSocialSignUp('facebook')} />
              <SocialButton provider="google" onPress={() => handleSocialSignUp('google')} />
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Have an account? </Text>
              <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign In</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  brandName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.ui.white,
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    color: Colors.ui.white,
    textAlign: 'center',
    marginBottom: 46,
  },
  requirementsContainer: {
    marginBottom: 24,
  },
  termsContainer: {
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.background.primary,
    fontWeight: 500,
  },
  termsError: {
    fontSize: 12,
    color: '#FF4444',
    marginBottom: 16,
    marginLeft: 4,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    marginBottom: 24,
    marginTop: 16,
  },
  signUpButtonText: {
    color: Colors.ui.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signInText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
  },
  signInLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
