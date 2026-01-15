/**
 * Tab Layout with Custom Bottom Navigation & Create Modal
 * Integrates disclosure modal for quick feature access
 */

import BottomTabBar, { TabName } from "@/components/navigation/BottomTabBar";
import { CreateModal } from "@/components/shared/CreateModal";
import {
  TaskIcon,
  GoalIcon,
  NoteIcon,
  ProjectIcon,
  MilestoneIcon,
  ReminderIcon,
} from "@/components/shared";
import type { CreateOption } from "@/components/shared";
import { Slot, usePathname, useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Determine active tab from pathname
  const getActiveTab = (): TabName => {
    if (pathname.includes("/tasks")) return "tasks";
    if (pathname.includes("/habit")) return "habits";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  // Create options with navigation handlers
  const createOptions: CreateOption[] = useMemo(
    () => [
      {
        id: "task",
        label: "Task",
        icon: <TaskIcon size={32} />,
        onPress: () => {
          router.push({
            pathname: "/tasks",
            params: { createNew: "true" },
          });
        },
      },
      {
        id: "goal",
        label: "Goal",
        icon: <GoalIcon size={32} />,
        onPress: () => {
          router.push({
            pathname: "/goals",
            params: { createNew: "true" },
          });
        },
      },
      {
        id: "note",
        label: "Note",
        icon: <NoteIcon size={32} />,
        onPress: () => {
          router.push({
            pathname: "/journal",
            params: { createNew: "true" },
          });
        },
      },
      {
        id: "project",
        label: "Project",
        icon: <ProjectIcon size={32} />,
        onPress: () => {
          router.push({
            pathname: "/goals",
            params: { createNew: "project" },
          });
        },
      },
      {
        id: "milestone",
        label: "Milestone",
        icon: <MilestoneIcon size={32} />,
        onPress: () => {
          router.push({
            pathname: "/goals",
            params: { createNew: "milestone" },
          });
        },
      },
      {
        id: "habit",
        label: "Reminder",
        icon: <ReminderIcon size={32} />,
        onPress: () => {
          router.push({
            pathname: "/habit",
            params: { createNew: "true" },
          });
        },
      },
    ],
    [router]
  );

  const handleTabPress = (tab: TabName) => {
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "tasks":
        router.push("/tasks");
        break;
      case "habits":
        router.push("/habit");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  const handleAddPress = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Slot />
      <BottomTabBar
        activeTab={getActiveTab()}
        onTabPress={handleTabPress}
        onAddPress={handleAddPress}
      />

      {/* Create Modal */}
      <CreateModal
        visible={isCreateModalVisible}
        onClose={handleCreateModalClose}
        options={createOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
});
