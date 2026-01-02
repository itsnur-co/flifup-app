/**
 * Task Details Screen Route
 * Displays task details with interactive sub-tasks
 * Uses API integration for real data
 */

import {
  AddSubtaskSheet,
  SubtaskOptionsSheet,
  TaskDetailsScreen,
} from "@/components/task";
import { useTasks } from "@/hooks";
import { Colors } from "@/constants/colors";
import { TaskSubtask } from "@/types/task";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function TaskDetailsRoute() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  const {
    taskDetail: task,
    isLoading,
    isUpdating,
    isDeleting,
    error,
    fetchTaskDetail,
    deleteTask,
    toggleSubtask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  } = useTasks({ autoFetch: false });

  // Sheet visibility states
  const [showAddSubtaskSheet, setShowAddSubtaskSheet] = useState(false);
  const [showSubtaskOptionsSheet, setShowSubtaskOptionsSheet] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<TaskSubtask | null>(null);

  // Fetch enhanced task detail on mount
  useEffect(() => {
    if (taskId) {
      fetchTaskDetail(taskId);
    }
  }, [taskId, fetchTaskDetail]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEdit = useCallback(() => {
    console.log("Edit task:", task?.id);
    // TODO: Implement edit functionality
  }, [task]);

  const handleDelete = useCallback(async () => {
    if (!task) return;

    const success = await deleteTask(task.id);
    if (success) {
      router.back();
    }
  }, [task, deleteTask, router]);

  // Subtask handlers
  const handleAddSubTask = useCallback(() => {
    setShowAddSubtaskSheet(true);
  }, []);

  const handleAddSubtaskSubmit = useCallback(
    async (title: string): Promise<boolean> => {
      if (!task) return false;
      const result = await addSubtask(task.id, title);
      return result !== null;
    },
    [task, addSubtask]
  );

  const handleToggleSubTask = useCallback(
    async (subtaskId: string) => {
      if (!task) return;
      await toggleSubtask(task.id, subtaskId);
    },
    [task, toggleSubtask]
  );

  const handleSubTaskOptions = useCallback((subtask: TaskSubtask) => {
    setSelectedSubtask(subtask);
    setShowSubtaskOptionsSheet(true);
  }, []);

  const handleSubtaskToggleComplete = useCallback(
    async (subtaskId: string): Promise<boolean> => {
      if (!task) return false;
      return await toggleSubtask(task.id, subtaskId);
    },
    [task, toggleSubtask]
  );

  const handleSubtaskUpdateTitle = useCallback(
    async (subtaskId: string, newTitle: string): Promise<boolean> => {
      if (!task) return false;
      const result = await updateSubtask(task.id, subtaskId, { title: newTitle });
      return result !== null;
    },
    [task, updateSubtask]
  );

  const handleSubtaskDelete = useCallback(
    async (subtaskId: string): Promise<boolean> => {
      if (!task) return false;
      return await deleteSubtask(task.id, subtaskId);
    },
    [task, deleteSubtask]
  );

  const handleCloseSubtaskOptions = useCallback(() => {
    setShowSubtaskOptionsSheet(false);
    setSelectedSubtask(null);
  }, []);

  // Loading state
  if (isLoading && !task) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading task...</Text>
      </View>
    );
  }

  // Error state
  if (error && !task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load task</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  // No task found
  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  return (
    <>
      <TaskDetailsScreen
        task={task}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddSubTask={handleAddSubTask}
        onToggleSubTask={handleToggleSubTask}
        onSubTaskOptions={handleSubTaskOptions}
        isLoading={isUpdating}
      />

      {/* Add Subtask Sheet */}
      <AddSubtaskSheet
        visible={showAddSubtaskSheet}
        onClose={() => setShowAddSubtaskSheet(false)}
        onAddSubtask={handleAddSubtaskSubmit}
        isLoading={isUpdating}
      />

      {/* Subtask Options Sheet */}
      <SubtaskOptionsSheet
        visible={showSubtaskOptionsSheet}
        subtask={selectedSubtask}
        onClose={handleCloseSubtaskOptions}
        onToggleComplete={handleSubtaskToggleComplete}
        onUpdateTitle={handleSubtaskUpdateTitle}
        onDelete={handleSubtaskDelete}
        isLoading={isUpdating}
      />

      {/* Operation Loading Overlay */}
      {isDeleting && (
        <View style={styles.operationOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.operationText}>Deleting task...</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  operationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    zIndex: 10000,
  },
  operationText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
