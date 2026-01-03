/**
 * Goal List Screen
 * Main screen for displaying goals with search and filtering
 * Shows ongoing and completed goals in separate sections
 */

import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Goal } from "@/types/goal";
import { GoalCard } from "./GoalCard";
import { CreateButton } from "@/components/buttons/CreateButton";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface GoalListScreenProps {
  goals: Goal[];
  ongoingGoals: Goal[];
  completedGoals: Goal[];
  isLoading?: boolean;
  onRefresh?: () => Promise<void> | void;
  onSearch?: (searchText: string) => void;
  onGoalPress?: (goalId: string) => void;
  onGoalMore?: (goal: Goal) => void;
  onCreatePress?: () => void;
  onBack?: () => void;
}

export function GoalListScreen({
  goals,
  ongoingGoals,
  completedGoals,
  isLoading = false,
  onRefresh,
  onSearch,
  onGoalPress,
  onGoalMore,
  onCreatePress,
  onBack,
}: GoalListScreenProps) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isFabCompact, setIsFabCompact] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh?.();
    setRefreshing(false);
  };

  const handleScroll = () => {
    if (!isFabCompact) {
      setIsFabCompact(true);
    }
  };

  const handleScrollEnd = () => {
    setIsFabCompact(false);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Feather name="target" size={48} color="#3A3A3C" />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Goal List"
        hideBackButton={!onBack}
        onBack={onBack}
        rightIcon="none"
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {isLoading && goals.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {/* Ongoing Goals Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ongoing</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{ongoingGoals.length}</Text>
                </View>
              </View>

              {ongoingGoals.length === 0 ? (
                <EmptyState
                  message="No ongoing goals. Create your first goal!"
                />
              ) : (
                ongoingGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onPress={() => onGoalPress?.(goal.id)}
                    onMorePress={() => onGoalMore?.(goal)}
                  />
                ))
              )}
            </View>

            {/* Completed Goals Section */}
            {completedGoals.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Completed</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{completedGoals.length}</Text>
                  </View>
                </View>

                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onPress={() => onGoalPress?.(goal.id)}
                    onMorePress={() => onGoalMore?.(goal)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Create Goal FAB */}
      <View style={styles.fabContainer}>
        <CreateButton
          label="New Goal"
          onPress={onCreatePress || (() => {})}
          compact={isFabCompact}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  countBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: "center",
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
  fabContainer: {
    position: "absolute",
    zIndex: 9999,
    elevation: 20,
    bottom: 32,
    right: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});
