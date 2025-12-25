import { BottomTabBar } from "@/components/navigation/BottomTabBar";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<
    "home" | "tasks" | "habits" | "profile"
  >("home");

  const handleTabPress = (tab: "home" | "tasks" | "habits" | "profile") => {
    setActiveTab(tab);
    // Navigate to the corresponding route
    if (tab === "home") {
      router.push("/");
    } else if (tab === "tasks") {
      router.push("/tasks");
    } else if (tab === "habits") {
      router.push("/habit");
    } else if (tab === "profile") {
      // Add profile route when ready
      console.log("Profile navigation - route not yet defined");
    }
  };

  const handleAddPress = () => {
    // Handle add button press - could open a sheet to select task/habit
    console.log("Add button pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.centeredContent}>
          <Text style={styles.contentText}>Home Screen</Text>
        </View>
      </View>
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onAddPress={handleAddPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
