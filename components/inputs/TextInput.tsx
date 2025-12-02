import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * Custom TextInput Component
 * Reusable input field with label, error handling, and password visibility toggle
 */
export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  isPassword = false,
  containerStyle,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <RNTextInput
          style={styles.input}
          placeholderTextColor={Colors.ui.text.secondary}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={Colors.ui.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.ui.white,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(144, 57, 255, 0.1)',
  },
  inputContainerError: {
    borderColor: '#FF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.ui.white,
    paddingVertical: 0,
  },
  iconButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
    marginLeft: 4,
  },
});
