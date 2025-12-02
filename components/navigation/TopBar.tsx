import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface TopBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  titleStyle?: TextStyle;
  containerStyle?: ViewStyle;
  backButtonStyle?: ViewStyle;
}

/**
 * TopBar Component
 * Reusable navigation bar with dynamic left, center, and right elements
 */
export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  leftElement,
  rightElement,
  titleStyle,
  containerStyle,
  backButtonStyle,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const renderLeftElement = () => {
    if (leftElement) {
      return leftElement;
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          onPress={handleBackPress}
          style={[styles.backButton, backButtonStyle]}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.ui.white} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.placeholder} />;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftContainer}>{renderLeftElement()}</View>

      <View style={styles.centerContainer}>
        {title && (
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightElement || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.ui.white,
    textAlign: 'center',
  },
});
