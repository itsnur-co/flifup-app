/**
 * Task Insights Route
 * Full-screen task analytics and productivity reports with insights
 */

import { TaskInsightScreen } from "@/components/task";
import { useRouter } from "expo-router";
import React from "react";

export default function TaskProgressRoute() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleNewTask = () => {
    router.push("/tasks?mode=create");
  };

  return (
    <TaskInsightScreen
      visible={true}
      onClose={handleClose}
      onNewTask={handleNewTask}
    />
  );
}
