/**
 * Task Progress Route
 * Full-screen task analytics and productivity reports
 */

import { TaskProgressScreen } from "@/components/task";
import { useRouter } from "expo-router";
import React from "react";

export default function TaskProgressRoute() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <TaskProgressScreen
      visible={true}
      onClose={handleClose}
    />
  );
}
