/**
 * Reusable Bottom Sheet Component
 * Supports modal presentation with handle indicator
 * Dark theme design matching Figma
 */

import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnapIndex?: number;
  enableDrag?: boolean;
  showHandle?: boolean;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  handleColor?: string;
  backdropOpacity?: number;
  keyboardAvoidingEnabled?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  initialSnapIndex = 0,
  enableDrag = true,
  showHandle = true,
  containerStyle,
  contentContainerStyle,
  backgroundColor = "#1C1C1E",
  handleColor = "#5A5A5E",
  backdropOpacity = 0.5,
  keyboardAvoidingEnabled = true,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const currentSnapIndex = useRef(initialSnapIndex);

  const getSnapPointValue = useCallback(
    (index: number): number => {
      const snapPoint = snapPoints[index] || snapPoints[0];
      return SCREEN_HEIGHT * (1 - snapPoint);
    },
    [snapPoints]
  );

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: getSnapPointValue(initialSnapIndex),
          useNativeDriver: true,
          damping: 20,
          stiffness: 150,
        }),
        Animated.timing(backdropAnim, {
          toValue: backdropOpacity,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    visible,
    translateY,
    backdropAnim,
    backdropOpacity,
    getSnapPointValue,
    initialSnapIndex,
  ]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableDrag,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        enableDrag && Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const currentValue = getSnapPointValue(currentSnapIndex.current);
        const newValue = currentValue + gestureState.dy;
        if (newValue >= 0) {
          translateY.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const velocity = gestureState.vy;
        const currentValue = getSnapPointValue(currentSnapIndex.current);
        const finalPosition = currentValue + gestureState.dy;

        // Dismiss if dragged down fast or past threshold
        if (velocity > 0.5 || finalPosition > SCREEN_HEIGHT * 0.7) {
          onClose();
          return;
        }

        // Snap to nearest snap point
        let closestSnapIndex = 0;
        let closestDistance = Infinity;

        snapPoints.forEach((_, index) => {
          const snapValue = getSnapPointValue(index);
          const distance = Math.abs(finalPosition - snapValue);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSnapIndex = index;
          }
        });

        currentSnapIndex.current = closestSnapIndex;

        Animated.spring(translateY, {
          toValue: getSnapPointValue(closestSnapIndex),
          useNativeDriver: true,
          damping: 20,
          stiffness: 150,
        }).start();
      },
    })
  ).current;

  const sheetContent = (
    <Animated.View
      style={[
        styles.sheet,
        {
          backgroundColor,
          transform: [{ translateY }],
          paddingBottom: insets.bottom,
        },
        containerStyle,
      ]}
      {...(enableDrag ? panResponder.panHandlers : {})}
    >
      {showHandle && (
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: handleColor }]} />
        </View>
      )}
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </Animated.View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {keyboardAvoidingEnabled ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoidingView}
          >
            {sheetContent}
          </KeyboardAvoidingView>
        ) : (
          sheetContent
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 500,
    maxHeight: SCREEN_HEIGHT * 0.95,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  content: {
    flex: 1,
  },
});

export default BottomSheet;
