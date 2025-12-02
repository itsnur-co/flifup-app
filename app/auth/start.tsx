import { PrimaryButton } from '@/components/buttons';
import { Logo } from '@/components/logo';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Auth Start Screen
 * Entry screen with sign in and create account options
 */
export default function AuthStartScreen() {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Gradient Background */}
      <LinearGradient
        colors={[Colors.gradient.primaryFull.start, Colors.gradient.primaryFull.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/* Logo and Brand Section */}
        <Animated.View
          entering={FadeInUp.duration(800).delay(200)}
          style={styles.brandContainer}
        >
          <View style={styles.logoContainer}>
            <Logo size={60} variant="white" />
            <Text style={styles.brandName}>Flifup</Text>
          </View>
        </Animated.View>

        {/* Bottom Action Section */}
        <Animated.View
          entering={FadeInDown.duration(800).delay(400)}
          style={styles.actionContainer}
        >
          {/* Terms and Privacy Text */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By tapping &quot;Sign in&quot;, you agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text>.{'\n'}
              Learn how we process your data in our{'\n'}
              <Text style={styles.termsLink}>Privacy Policy</Text> and{' '}
              <Text style={styles.termsLink}>Cookies Policy</Text>.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Create account"
              onPress={handleCreateAccount}
              variant="filled"
            />

            <PrimaryButton
              title="Sign in"
              onPress={handleSignIn}
              variant="outlined"
            />
          </View>


        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brandContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.ui.white,
    letterSpacing: 1,
  },
  actionContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: Colors.ui.white,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.9,
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    gap: 4,
  },
  indicator: {
    width: 134,
    height: 5,
    backgroundColor: Colors.ui.white,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 24,
    opacity: 0.8,
  },
});
