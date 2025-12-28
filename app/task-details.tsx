/**
 * Task Details Screen Route
 * Displays task details with sub-tasks
 */

import { TaskDetailsScreen } from "@/components/task";
import { MOCK_TASKS } from "@/constants/mockData";
import { SubTask, Task } from "@/types/task";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";

export default function TaskDetailsRoute() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  // Find the task by ID (in real app, this would be from state/API)
  const initialTask = MOCK_TASKS.find((t) => t.id === taskId) || MOCK_TASKS[0];
  const [task, setTask] = useState<Task>(initialTask);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    // Navigate to edit screen or open edit sheet
    console.log("Edit task:", task.id);
  };

  const handleDelete = () => {
    // Delete task and navigate back
    console.log("Delete task:", task.id);
    router.back();
  };

  const handleAddSubTask = () => {
    // Open add sub-task sheet
    console.log("Add sub-task to:", task.id);
  };

  const handleToggleSubTask = useCallback((subTaskId: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      subTasks: prevTask.subTasks.map((st) =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      ),
      updatedAt: new Date(),
    }));
  }, []);

  const handleSubTaskOptions = useCallback((subTask: SubTask) => {
    console.log("Sub-task options:", subTask.id);
  }, []);

  return (
    <TaskDetailsScreen
      task={task}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddSubTask={handleAddSubTask}
      onToggleSubTask={handleToggleSubTask}
      onSubTaskOptions={handleSubTaskOptions}
    />
  );
}
