/**
 * Tab Layout with Custom Bottom Navigation
 */

import BottomTabBar, { TabName } from "@/components/navigation/BottomTabBar";
import { Slot, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from pathname
  const getActiveTab = (): TabName => {
    if (pathname.includes("/tasks")) return "tasks";
    if (pathname.includes("/habit")) return "habits";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

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
    // Open create modal or navigate to create screen
    // Based on current tab, open relevant create sheet
    const activeTab = getActiveTab();
    if (activeTab === "tasks") {
      // Open create task sheet
      console.log("Create Task");
    } else if (activeTab === "habits") {
      // Open create habit sheet
      console.log("Create Habit");
    } else {
      // Default action
      console.log("Add new item");
    }
  };

  return (
    <View style={styles.container}>
      <Slot />
      <BottomTabBar
        activeTab={getActiveTab()}
        onTabPress={handleTabPress}
        onAddPress={handleAddPress}
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
