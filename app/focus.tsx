/**
 * Focus Mode Route
 * Full-screen focus timer with task integration
 */

import { FocusModeScreen } from "@/components/task";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function FocusScreen() {
  const router = useRouter();
  const { taskId, taskTitle, duration } = useLocalSearchParams<{
    taskId: string;
    taskTitle: string;
    duration?: string;
  }>();

  const handleClose = () => {
    router.back();
  };

  return (
    <FocusModeScreen
      visible={true}
      onClose={handleClose}
      taskId={taskId || ""}
      taskTitle={taskTitle || "Focus Session"}
      initialDuration={duration ? parseInt(duration) : 10}
    />
  );
}
