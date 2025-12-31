/**
 * Focus Mode Screen Component
 * Pomodoro-style focus timer with circular progress
 * Matches Figma design exactly
 */

import {
  ClockIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@/components/icons/TaskIcons";
import { FocusSession, taskService } from "@/services/api/task.service";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { FocusAddTimeSheet } from "./FocusAddTimeSheet";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface FocusModeScreenProps {
  visible: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  initialDuration?: number; // in minutes
}

export const FocusModeScreen: React.FC<FocusModeScreenProps> = ({
  visible,
  onClose,
  taskId,
  taskTitle,
  initialDuration = 10,
}) => {
  const insets = useSafeAreaInsets();

  // State
  const [session, setSession] = useState<FocusSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialDuration * 60
  );
  const [totalSeconds, setTotalSeconds] = useState(initialDuration * 60);
  const [finishTime, setFinishTime] = useState<string>("");
  const [showAddTimeSheet, setShowAddTimeSheet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate progress (0 to 1)
  const progress =
    totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Format elapsed time
  const formatElapsedTime = (seconds: number): string => {
    const elapsed = totalSeconds - seconds;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `- ${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate finish time
  const calculateFinishTime = useCallback((seconds: number) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  // Start session via API
  const startSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await taskService.startFocusSession({
        taskId,
        duration: initialDuration * 60, // Convert to seconds
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setSession(response.data);
        setRemainingSeconds(response.data.remainingTime);
        setTotalSeconds(response.data.totalDuration);
        setFinishTime(calculateFinishTime(response.data.remainingTime));
        setIsPaused(false);
        startTimer();
      }
    } catch (err) {
      setError("Failed to start focus session");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for active session
  const checkActiveSession = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getActiveSession();

      if (response.data && response.data.taskId === taskId) {
        setSession(response.data);
        setRemainingSeconds(
          response.data.currentRemainingTime || response.data.remainingTime
        );
        setTotalSeconds(response.data.totalDuration);
        setIsPaused(response.data.status === "PAUSED");

        if (response.data.finishesAt) {
          const finishDate = new Date(response.data.finishesAt);
          setFinishTime(
            finishDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          );
        }

        if (response.data.status === "RUNNING") {
          startTimer();
        }
      } else {
        // No active session, start new one
        await startSession();
      }
    } catch (err) {
      await startSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Start timer countdown
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Timer completed
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pulseAnim.stopAnimation();
  };

  // Handle pause
  const handlePause = async () => {
    if (!session) return;

    try {
      stopTimer();
      setIsPaused(true);

      const response = await taskService.pauseSession(session.id);
      if (response.data) {
        setSession(response.data);
      }
    } catch (err) {
      // Continue local pause even if API fails
    }
  };

  // Handle resume
  const handleResume = async () => {
    if (!session) return;

    try {
      const response = await taskService.resumeSession(session.id);

      if (response.data) {
        setSession(response.data);
        setRemainingSeconds(
          response.data.currentRemainingTime || response.data.remainingTime
        );
        setFinishTime(
          calculateFinishTime(
            response.data.currentRemainingTime || response.data.remainingTime
          )
        );
      }

      setIsPaused(false);
      startTimer();
    } catch (err) {
      // Resume locally
      setIsPaused(false);
      startTimer();
    }
  };

  // Handle quit
  const handleQuit = async () => {
    if (!session) {
      onClose();
      return;
    }

    try {
      stopTimer();
      await taskService.quitSession(session.id);
    } catch (err) {
      // Continue even if API fails
    } finally {
      onClose();
    }
  };

  // Handle complete
  const handleComplete = async () => {
    stopTimer();
    Vibration.vibrate([0, 500, 200, 500]);

    if (session) {
      try {
        await taskService.completeSession(session.id);
      } catch (err) {
        // Continue even if API fails
      }
    }

    // Show completion UI briefly then close
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Handle add time
  const handleAddTime = async (minutes: number, seconds: number) => {
    if (!session) return;

    const additionalSeconds = minutes * 60 + seconds;

    try {
      const response = await taskService.addTimeToSession(
        session.id,
        additionalSeconds
      );

      if (response.data) {
        setSession(response.data);
        setRemainingSeconds(
          response.data.currentRemainingTime || response.data.remainingTime
        );
        setTotalSeconds(response.data.totalDuration);
        setFinishTime(
          calculateFinishTime(
            response.data.currentRemainingTime || response.data.remainingTime
          )
        );
      } else {
        // Update locally
        setRemainingSeconds((prev) => prev + additionalSeconds);
        setTotalSeconds((prev) => prev + additionalSeconds);
        setFinishTime(
          calculateFinishTime(remainingSeconds + additionalSeconds)
        );
      }
    } catch (err) {
      // Update locally
      setRemainingSeconds((prev) => prev + additionalSeconds);
      setTotalSeconds((prev) => prev + additionalSeconds);
    }

    setShowAddTimeSheet(false);
  };

  // Initialize
  useEffect(() => {
    if (visible) {
      checkActiveSession();
    }

    return () => {
      stopTimer();
    };
  }, [visible, taskId]);

  // Update finish time when remaining changes
  useEffect(() => {
    if (!isPaused && remainingSeconds > 0) {
      setFinishTime(calculateFinishTime(remainingSeconds));
    }
  }, [remainingSeconds, isPaused]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.handleBar} />
        <Text style={styles.headerTitle}>Running</Text>
        <View style={styles.headerDivider} />
      </View>

      {/* Duration Badge */}
      <TouchableOpacity
        style={styles.durationBadge}
        onPress={() => setShowAddTimeSheet(true)}
        activeOpacity={0.7}
      >
        <ClockIcon size={16} color="#FFFFFF" />
        <Text style={styles.durationText}>
          {Math.ceil(totalSeconds / 60)}-Minute
        </Text>
      </TouchableOpacity>

      {/* Circular Timer */}
      <View style={styles.timerContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#9039FF" />
        ) : (
          <Animated.View
            style={{ transform: [{ scale: isPaused ? 1 : pulseAnim }] }}
          >
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <Defs>
                <LinearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor="#9039FF" />
                  <Stop offset="100%" stopColor="#00D4FF" />
                </LinearGradient>
              </Defs>

              {/* Background Circle */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#2C2C2E"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />

              {/* Progress Circle */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="url(#progressGradient)"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
              />
            </Svg>

            {/* Time Display */}
            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>
                {formatTime(remainingSeconds)}
              </Text>
              <Text style={styles.elapsedText}>
                {formatElapsedTime(remainingSeconds)}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Pause/Resume Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={isPaused ? handleResume : handlePause}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          {isPaused ? (
            <PlayIcon size={28} color="#FFFFFF" />
          ) : (
            <PauseIcon size={28} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Quit Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleQuit}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <StopIcon size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Button Labels */}
      <View style={styles.labelsContainer}>
        <Text style={styles.controlLabel}>{isPaused ? "Resume" : "Pause"}</Text>
        <Text style={styles.controlLabel}>Quit</Text>
      </View>

      {/* Finish Time */}
      <View style={styles.finishTimeContainer}>
        <Text style={styles.finishTimeText}>
          Timer finishes at {finishTime}
        </Text>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Add Time Sheet */}
      <FocusAddTimeSheet
        visible={showAddTimeSheet}
        onClose={() => setShowAddTimeSheet(false)}
        onAdd={handleAddTime}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: "#3A3A3C",
    borderRadius: 2.5,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  headerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 24,
    gap: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeDisplay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 56,
    fontWeight: "300",
    color: "#FFFFFF",
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
  elapsedText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6B7280",
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
    marginBottom: 8,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 80,
    marginBottom: 32,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8E8E93",
    width: 60,
    textAlign: "center",
  },
  finishTimeContainer: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 40,
  },
  finishTimeText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8E8E93",
  },
  errorContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default FocusModeScreen;
