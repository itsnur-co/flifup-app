import BottomNavBar, { TabType } from "@/components/navigation/BottomNavBar";
import { TaskListScreen } from "@/screens";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("tasks");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.contentText}>Home Screen</Text>
          </View>
        );
      case "tasks":
        return <TaskListScreen />;
      case "add":
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.contentText}>Add Screen</Text>
          </View>
        );
      case "layers":
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.contentText}>Layers Screen</Text>
          </View>
        );
      case "profile":
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.contentText}>Profile Screen</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      {activeTab === "home" && (
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
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
