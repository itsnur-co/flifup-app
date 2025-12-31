/**
 * Focus Mode Hook
 * Handles focus session management with API integration
 * Provides start, pause, resume, complete, quit operations
 */

import { useCallback, useEffect, useState, useRef } from "react";
import {
  taskService,
  FocusSession,
  FocusHistoryItem,
} from "@/services/api/task.service";

interface UseFocusOptions {
  autoCheckActive?: boolean;
}

interface UseFocusReturn {
  // Data
  activeSession: FocusSession | null;
  focusHistory: FocusHistoryItem[];
  remainingTime: number;
  progress: number;

  // Loading states
  isLoading: boolean;
  isStarting: boolean;
  isPausing: boolean;
  isResuming: boolean;
  isCompleting: boolean;
  isAddingTime: boolean;

  // Error state
  error: string | null;

  // Session status
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;

  // Actions
  startSession: (taskId: string, durationMinutes: number) => Promise<FocusSession | null>;
  pauseSession: () => Promise<boolean>;
  resumeSession: () => Promise<boolean>;
  addTime: (minutes: number, seconds?: number) => Promise<boolean>;
  completeSession: () => Promise<boolean>;
  quitSession: () => Promise<boolean>;
  checkActiveSession: () => Promise<void>;
  fetchFocusHistory: (taskId?: string) => Promise<void>;

  // Utility
  clearError: () => void;
  formatTime: (seconds: number) => string;
}

export const useFocus = (options: UseFocusOptions = {}): UseFocusReturn => {
  const { autoCheckActive = true } = options;

  // Data state
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [focusHistory, setFocusHistory] = useState<FocusHistoryItem[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAddingTime, setIsAddingTime] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Computed states
  const isRunning = activeSession?.status === "RUNNING";
  const isPaused = activeSession?.status === "PAUSED";
  const isCompleted = activeSession?.status === "COMPLETED";

  // Progress (0-100)
  const progress = activeSession
    ? Math.round(
        ((activeSession.totalDuration - remainingTime) / activeSession.totalDuration) * 100
      )
    : 0;

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
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
  }, []);

  // Start local timer
  const startLocalTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          // Timer completed
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Stop local timer
  const stopLocalTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ============================================
  // API Operations
  // ============================================

  const checkActiveSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskService.getActiveSession();

      if (response.data) {
        setActiveSession(response.data);
        const currentRemaining =
          response.data.currentRemainingTime || response.data.remainingTime;
        setRemainingTime(currentRemaining);

        if (response.data.status === "RUNNING") {
          startLocalTimer();
        }
      } else {
        setActiveSession(null);
        setRemainingTime(0);
      }
    } catch (err) {
      console.error("checkActiveSession error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [startLocalTimer]);

  const startSession = useCallback(
    async (
      taskId: string,
      durationMinutes: number
    ): Promise<FocusSession | null> => {
      setIsStarting(true);
      setError(null);

      try {
        const durationSeconds = durationMinutes * 60;
        const response = await taskService.startFocusSession({
          taskId,
          duration: durationSeconds,
        });

        if (response.error) {
          setError(response.error);
          return null;
        }

        if (response.data) {
          setActiveSession(response.data);
          setRemainingTime(response.data.remainingTime);
          startLocalTimer();
          return response.data;
        }

        return null;
      } catch (err) {
        setError("Failed to start focus session");
        console.error("startSession error:", err);
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    [startLocalTimer]
  );

  const pauseSession = useCallback(async (): Promise<boolean> => {
    if (!activeSession) return false;

    setIsPausing(true);
    setError(null);

    try {
      stopLocalTimer();
      const response = await taskService.pauseSession(activeSession.id);

      if (response.error) {
        setError(response.error);
        startLocalTimer(); // Resume timer if pause failed
        return false;
      }

      if (response.data) {
        setActiveSession(response.data);
        return true;
      }

      return false;
    } catch (err) {
      setError("Failed to pause session");
      console.error("pauseSession error:", err);
      return false;
    } finally {
      setIsPausing(false);
    }
  }, [activeSession, stopLocalTimer, startLocalTimer]);

  const resumeSession = useCallback(async (): Promise<boolean> => {
    if (!activeSession) return false;

    setIsResuming(true);
    setError(null);

    try {
      const response = await taskService.resumeSession(activeSession.id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      if (response.data) {
        setActiveSession(response.data);
        const currentRemaining =
          response.data.currentRemainingTime || response.data.remainingTime;
        setRemainingTime(currentRemaining);
        startLocalTimer();
        return true;
      }

      return false;
    } catch (err) {
      setError("Failed to resume session");
      console.error("resumeSession error:", err);
      return false;
    } finally {
      setIsResuming(false);
    }
  }, [activeSession, startLocalTimer]);

  const addTime = useCallback(
    async (minutes: number, seconds: number = 0): Promise<boolean> => {
      if (!activeSession) return false;

      setIsAddingTime(true);
      setError(null);

      try {
        const additionalSeconds = minutes * 60 + seconds;
        const response = await taskService.addTimeToSession(
          activeSession.id,
          additionalSeconds
        );

        if (response.error) {
          setError(response.error);
          return false;
        }

        if (response.data) {
          setActiveSession(response.data);
          const currentRemaining =
            response.data.currentRemainingTime || response.data.remainingTime;
          setRemainingTime(currentRemaining);
          return true;
        }

        // Update locally if API response doesn't have data
        setRemainingTime((prev) => prev + additionalSeconds);
        return true;
      } catch (err) {
        setError("Failed to add time");
        console.error("addTime error:", err);
        return false;
      } finally {
        setIsAddingTime(false);
      }
    },
    [activeSession]
  );

  const completeSession = useCallback(async (): Promise<boolean> => {
    if (!activeSession) return false;

    setIsCompleting(true);
    setError(null);

    try {
      stopLocalTimer();
      const response = await taskService.completeSession(activeSession.id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      if (response.data) {
        setActiveSession(response.data);
        setRemainingTime(0);
        return true;
      }

      setActiveSession(null);
      setRemainingTime(0);
      return true;
    } catch (err) {
      setError("Failed to complete session");
      console.error("completeSession error:", err);
      return false;
    } finally {
      setIsCompleting(false);
    }
  }, [activeSession, stopLocalTimer]);

  const quitSession = useCallback(async (): Promise<boolean> => {
    if (!activeSession) return false;

    setIsLoading(true);
    setError(null);

    try {
      stopLocalTimer();
      const response = await taskService.quitSession(activeSession.id);

      if (response.error) {
        setError(response.error);
        return false;
      }

      setActiveSession(null);
      setRemainingTime(0);
      return true;
    } catch (err) {
      setError("Failed to quit session");
      console.error("quitSession error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeSession, stopLocalTimer]);

  const fetchFocusHistory = useCallback(async (taskId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await taskService.getFocusHistory(taskId);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setFocusHistory(response.data);
      }
    } catch (err) {
      setError("Failed to fetch focus history");
      console.error("fetchFocusHistory error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // Utility Functions
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // Auto-check on mount
  // ============================================

  useEffect(() => {
    if (autoCheckActive) {
      checkActiveSession();
    }

    // Cleanup timer on unmount
    return () => {
      stopLocalTimer();
    };
  }, [autoCheckActive, checkActiveSession, stopLocalTimer]);

  // Auto-complete when timer reaches 0
  useEffect(() => {
    if (remainingTime === 0 && isRunning && activeSession) {
      completeSession();
    }
  }, [remainingTime, isRunning, activeSession, completeSession]);

  return {
    // Data
    activeSession,
    focusHistory,
    remainingTime,
    progress,

    // Loading states
    isLoading,
    isStarting,
    isPausing,
    isResuming,
    isCompleting,
    isAddingTime,

    // Error state
    error,

    // Session status
    isRunning,
    isPaused,
    isCompleted,

    // Actions
    startSession,
    pauseSession,
    resumeSession,
    addTime,
    completeSession,
    quitSession,
    checkActiveSession,
    fetchFocusHistory,

    // Utility
    clearError,
    formatTime,
  };
};

export default useFocus;
