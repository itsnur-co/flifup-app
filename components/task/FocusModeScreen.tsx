/**
 * Focus Mode Screen Component
 * Pomodoro-style focus timer with circular progress
 * Matches Figma design exactly
 */

import {
  PauseLineIcon,
  PlayIcon,
  StopLineIcon,
  TimerLineIcon,
} from "@/components/icons/TaskIcons";
import { useSound } from "@/hooks";
import { FocusSession, taskService } from "@/services/api/task.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
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
const STROKE_WIDTH = 18; // Thicker stroke
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
  const { playCompletionSound } = useSound();

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
  const [endTime, setEndTime] = useState<number | null>(null); // Timestamp when timer should end

  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // AsyncStorage keys
  const STORAGE_KEYS = {
    END_TIME: `focus_timer_end_${taskId}`,
    SESSION_ID: `focus_session_id_${taskId}`,
    TOTAL_SECONDS: `focus_total_seconds_${taskId}`,
    IS_PAUSED: `focus_is_paused_${taskId}`,
  };

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

  // Save timer state to AsyncStorage for background persistence
  const saveTimerState = async (
    endTimestamp: number,
    sessionId: string,
    total: number,
    paused: boolean
  ) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.END_TIME, endTimestamp.toString()],
        [STORAGE_KEYS.SESSION_ID, sessionId],
        [STORAGE_KEYS.TOTAL_SECONDS, total.toString()],
        [STORAGE_KEYS.IS_PAUSED, paused.toString()],
      ]);
    } catch (error) {
      console.error("Failed to save timer state:", error);
    }
  };

  // Load timer state from AsyncStorage
  const loadTimerState = async () => {
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_KEYS.END_TIME,
        STORAGE_KEYS.SESSION_ID,
        STORAGE_KEYS.TOTAL_SECONDS,
        STORAGE_KEYS.IS_PAUSED,
      ]);

      const state = {
        endTime: values[0][1] ? parseInt(values[0][1], 10) : null,
        sessionId: values[1][1],
        totalSeconds: values[2][1] ? parseInt(values[2][1], 10) : null,
        isPaused: values[3][1] === "true",
      };

      return state;
    } catch (error) {
      console.error("Failed to load timer state:", error);
      return null;
    }
  };

  // Clear timer state from AsyncStorage
  const clearTimerState = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.END_TIME,
        STORAGE_KEYS.SESSION_ID,
        STORAGE_KEYS.TOTAL_SECONDS,
        STORAGE_KEYS.IS_PAUSED,
      ]);
    } catch (error) {
      console.error("Failed to clear timer state:", error);
    }
  };

  // Calculate remaining time based on end timestamp
  const calculateRemainingTime = useCallback((endTimestamp: number): number => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTimestamp - now) / 1000));
    return remaining;
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

        // Calculate end time and save state for background persistence
        const timerEndTime = Date.now() + response.data.remainingTime * 1000;
        setEndTime(timerEndTime);
        await saveTimerState(
          timerEndTime,
          response.data.id,
          response.data.totalDuration,
          false
        );

        startTimer(timerEndTime);
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
      setError(null);

      // First, try to load saved timer state from AsyncStorage
      const savedState = await loadTimerState();

      const response = await taskService.getActiveSession();

      // Handle error response
      if (response.error) {
        // Check if we have saved state to restore
        if (savedState?.endTime && savedState.endTime > Date.now()) {
          const remaining = calculateRemainingTime(savedState.endTime);
          if (remaining > 0) {
            setRemainingSeconds(remaining);
            setTotalSeconds(savedState.totalSeconds || remaining);
            setEndTime(savedState.endTime);
            setIsPaused(savedState.isPaused);
            setFinishTime(calculateFinishTime(remaining));

            if (!savedState.isPaused) {
              startTimer(savedState.endTime);
            }
            setIsLoading(false);
            return;
          }
        }

        console.log("No active session found, starting new one");
        await startSession();
        return;
      }

      // Check if there's an existing session for this task
      if (response.data && response.data.taskId === taskId) {
        setSession(response.data);
        const remaining =
          response.data.currentRemainingTime || response.data.remainingTime;
        setRemainingSeconds(remaining);
        setTotalSeconds(response.data.totalDuration);
        setIsPaused(response.data.status === "PAUSED");

        // Calculate end time based on remaining time
        let timerEndTime: number;
        if (response.data.finishesAt) {
          timerEndTime = new Date(response.data.finishesAt).getTime();
          const finishDate = new Date(response.data.finishesAt);
          setFinishTime(
            finishDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          );
        } else {
          timerEndTime = Date.now() + remaining * 1000;
          setFinishTime(calculateFinishTime(remaining));
        }

        setEndTime(timerEndTime);

        // Save state for background persistence
        await saveTimerState(
          timerEndTime,
          response.data.id,
          response.data.totalDuration,
          response.data.status === "PAUSED"
        );

        if (response.data.status === "RUNNING") {
          startTimer(timerEndTime);
        }
      } else {
        // No active session for this task, start new one
        await startSession();
      }
    } catch (err) {
      console.error("Error checking active session:", err);
      await startSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Start timer countdown using timestamp-based calculation for background accuracy
  const startTimer = (targetEndTime?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // If no target end time provided, create one
    const timerEndTime = targetEndTime || Date.now() + remainingSeconds * 1000;
    setEndTime(timerEndTime);

    timerRef.current = setInterval(() => {
      const remaining = calculateRemainingTime(timerEndTime);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        // Timer completed
        handleComplete();
      }
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Handle pause
  const handlePause = async () => {
    if (!session) return;

    try {
      stopTimer();
      setIsPaused(true);

      // Save paused state
      if (endTime) {
        await saveTimerState(endTime, session.id, totalSeconds, true);
      }

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
        const remaining =
          response.data.currentRemainingTime || response.data.remainingTime;
        setRemainingSeconds(remaining);
        setFinishTime(calculateFinishTime(remaining));

        // Calculate new end time for resumed timer
        const timerEndTime = Date.now() + remaining * 1000;
        setEndTime(timerEndTime);

        // Save resumed state
        await saveTimerState(timerEndTime, session.id, totalSeconds, false);

        setIsPaused(false);
        startTimer(timerEndTime);
      } else {
        // Resume locally with new end time
        const timerEndTime = Date.now() + remainingSeconds * 1000;
        setEndTime(timerEndTime);
        await saveTimerState(timerEndTime, session.id, totalSeconds, false);
        setIsPaused(false);
        startTimer(timerEndTime);
      }
    } catch (err) {
      // Resume locally
      const timerEndTime = Date.now() + remainingSeconds * 1000;
      setEndTime(timerEndTime);
      if (session) {
        await saveTimerState(timerEndTime, session.id, totalSeconds, false);
      }
      setIsPaused(false);
      startTimer(timerEndTime);
    }
  };

  // Handle quit
  const handleQuit = async () => {
    if (!session) {
      await clearTimerState();
      onClose();
      return;
    }

    try {
      stopTimer();
      await taskService.quitSession(session.id);
      await clearTimerState();
    } catch (err) {
      // Continue even if API fails
      await clearTimerState();
    } finally {
      onClose();
    }
  };

  // Handle complete
  const handleComplete = async () => {
    stopTimer();

    // Play completion sound and vibrate
    playCompletionSound();
    Vibration.vibrate([0, 500, 200, 500]);

    if (session) {
      try {
        await taskService.completeSession(session.id);
        await clearTimerState();
      } catch (err) {
        // Continue even if API fails
        await clearTimerState();
      }
    } else {
      await clearTimerState();
    }

    // Show completion UI briefly then close
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Handle add time
  const handleAddTime = async (hours: number, minutes: number) => {
    if (!session) return;

    const additionalSeconds = hours * 3600 + minutes * 60;

    try {
      const response = await taskService.addTimeToSession(
        session.id,
        additionalSeconds
      );

      if (response.data) {
        setSession(response.data);
        const newRemaining =
          response.data.currentRemainingTime || response.data.remainingTime;
        setRemainingSeconds(newRemaining);
        setTotalSeconds(response.data.totalDuration);
        setFinishTime(calculateFinishTime(newRemaining));

        // Update end time and save state
        const newEndTime = Date.now() + newRemaining * 1000;
        setEndTime(newEndTime);
        await saveTimerState(
          newEndTime,
          session.id,
          response.data.totalDuration,
          isPaused
        );

        // Restart timer with new end time if not paused
        if (!isPaused) {
          stopTimer();
          startTimer(newEndTime);
        }
      } else {
        // Update locally
        const newRemaining = remainingSeconds + additionalSeconds;
        const newTotal = totalSeconds + additionalSeconds;
        setRemainingSeconds(newRemaining);
        setTotalSeconds(newTotal);
        setFinishTime(calculateFinishTime(newRemaining));

        // Update end time
        const newEndTime = endTime
          ? endTime + additionalSeconds * 1000
          : Date.now() + newRemaining * 1000;
        setEndTime(newEndTime);
        await saveTimerState(newEndTime, session.id, newTotal, isPaused);

        // Restart timer with new end time if not paused
        if (!isPaused) {
          stopTimer();
          startTimer(newEndTime);
        }
      }
    } catch (err) {
      // Update locally
      const newRemaining = remainingSeconds + additionalSeconds;
      const newTotal = totalSeconds + additionalSeconds;
      setRemainingSeconds(newRemaining);
      setTotalSeconds(newTotal);

      // Update end time
      const newEndTime = endTime
        ? endTime + additionalSeconds * 1000
        : Date.now() + newRemaining * 1000;
      setEndTime(newEndTime);
      if (session) {
        await saveTimerState(newEndTime, session.id, newTotal, isPaused);
      }

      // Restart timer with new end time if not paused
      if (!isPaused) {
        stopTimer();
        startTimer(newEndTime);
      }
    }

    setShowAddTimeSheet(false);
  };

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground
        console.log("App returned to foreground, syncing timer...");

        if (endTime && !isPaused) {
          // Recalculate remaining time based on stored end time
          const newRemaining = calculateRemainingTime(endTime);

          if (newRemaining > 0) {
            setRemainingSeconds(newRemaining);
            setFinishTime(calculateFinishTime(newRemaining));

            // Restart timer with accurate end time
            stopTimer();
            startTimer(endTime);
          } else {
            // Timer completed while in background
            handleComplete();
          }
        }
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // App is going to background
        console.log("App going to background, timer will continue...");

        // Save current state before going to background
        if (session && endTime) {
          await saveTimerState(endTime, session.id, totalSeconds, isPaused);
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [endTime, isPaused, session, totalSeconds]);

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
        <TimerLineIcon size={16} color="#FFFFFF" />
        <Text style={styles.durationText}>
          {Math.ceil(totalSeconds / 60)}-Minute
        </Text>
      </TouchableOpacity>

      {/* Circular Timer */}
      <View style={styles.timerContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#9039FF" />
        ) : (
          <View>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <Defs>
                <LinearGradient
                  id="progressGradient"
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor="#9039FF" />
                  <Stop offset="51.12%" stopColor="#6594FF" />
                  <Stop offset="100%" stopColor="#2DFDFF" />
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
          </View>
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
            <PauseLineIcon size={28} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Quit Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleQuit}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <StopLineIcon size={28} color="#FFFFFF" />
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
    color: "#fffFFF",
    fontVariant: ["tabular-nums"],
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 60,
    alignItems: "center",
    marginBottom: 16,
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
    justifyContent: "space-around",
    alignItems: "center",
    gap: 103,
    marginBottom: 32,
    minHeight: 40,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
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
