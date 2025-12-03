import { Colors } from '@/constants/colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChangeText?: (otp: string) => void;
  containerStyle?: ViewStyle;
}

/**
 * OTP Input Component
 * Handles multi-digit OTP input with auto-focus
 */
export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onComplete,
  onChangeText,
  containerStyle,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  useEffect(() => {
    // Notify parent of OTP changes
    const otpString = otp.join('');
    onChangeText?.(otpString);

    // Check if OTP is complete
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString);
      Keyboard.dismiss();
    }
  }, [otp, length, onComplete, onChangeText]);

  /**
   * Handles text change in OTP input
   */
  const handleChangeText = (text: string, index: number) => {
    // Allow only numbers
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length === 0) {
      // Handle backspace - clear current and move to previous
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
      return;
    }

    // Handle paste or multiple digits
    if (numericText.length > 1) {
      const digits = numericText.slice(0, length).split('');
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus next empty input or last input
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
      return;
    }

    // Handle single digit input
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Move to next input if available
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  /**
   * Handles backspace key press
   */
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  /**
   * Handles input focus
   */
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {otp.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.inputWrapper,
            focusedIndex === index && styles.inputWrapperFocused,
          ]}
        >
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              digit && styles.inputFilled,
            ]}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoComplete="one-time-code"
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 32,
  },
  inputWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.ui.strock,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.ui.text.secondary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  inputFilled: {
    color: Colors.primary,
  },
});
