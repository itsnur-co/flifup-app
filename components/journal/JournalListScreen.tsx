/**
 * Journal List Screen
 * Main screen for viewing and managing journals
 * Integrated with API services
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CreateButton } from "@/components/buttons";
import { SearchIcon } from "@/components/icons/TaskIcons";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { AddCategorySheet } from "@/components/shared";
import { CreateJournalSheet } from "./CreateJournalSheet";
import { JournalCard } from "./JournalCard";
import { JournalCategoryFilter } from "./JournalCategoryFilter";
import {
  JournalHeaderOptionsModal,
  JournalOptionsModal,
} from "./JournalOptionsModal";

import { Colors } from "@/constants/colors";
import useJournals from "@/hooks/useJournals";
import { Journal, JournalCategory, JournalFormState } from "@/types/journal";

interface JournalListScreenProps {
  onBack?: () => void;
  onNavigateToInsights?: () => void;
}

export const JournalListScreen: React.FC<JournalListScreenProps> = ({
  onBack,
  onNavigateToInsights,
}) => {
  const insets = useSafeAreaInsets();

  // API Hook
  const {
    journals,
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    fetchJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    createCategory,
    refresh,
  } = useJournals({ autoFetch: true });

  // Local state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FAB compact state while scrolling
  const [isFabCompact, setIsFabCompact] = useState(false);
  const scrollDebounceRef = React.useRef<number | null>(null);

  // Sheet visibility states
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  // Edit mode state
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);

  // Filter journals locally for instant feedback
  const filteredJournals = useMemo(() => {
    let result = journals;

    // Filter by category
    if (selectedCategoryId) {
      result = result.filter((j) => j.categoryId === selectedCategoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [journals, selectedCategoryId, searchQuery]);

  // Handlers
  const handleCreateJournal = useCallback(
    async (formState: JournalFormState) => {
      if (editingJournal) {
        // Update existing journal
        const result = await updateJournal(editingJournal.id, formState);
        if (result) {
          setEditingJournal(null);
          setShowCreateSheet(false);
        }
      } else {
        // Create new journal
        const result = await createJournal(formState);
        if (result) {
          setShowCreateSheet(false);
        }
      }
    },
    [editingJournal, updateJournal, createJournal]
  );

  const handleEditJournal = useCallback(() => {
    if (!selectedJournal) return;
    setEditingJournal(selectedJournal);
    setShowOptionsSheet(false);
    setShowCreateSheet(true);
  }, [selectedJournal]);

  const handleDeleteJournal = useCallback(async () => {
    if (!selectedJournal) return;
    const success = await deleteJournal(selectedJournal.id);
    if (success) {
      setSelectedJournal(null);
      setShowOptionsSheet(false);
    }
  }, [selectedJournal, deleteJournal]);

  const handleJournalMore = useCallback((journal: Journal) => {
    setSelectedJournal(journal);
    setShowOptionsSheet(true);
  }, []);

  const openCreateSheet = useCallback(() => {
    setEditingJournal(null);
    setShowCreateSheet(true);
  }, []);

  const handleAddNewFromHeader = useCallback(() => {
    setShowHeaderOptions(false);
    openCreateSheet();
  }, [openCreateSheet]);

  const handleInsightsFromHeader = useCallback(() => {
    setShowHeaderOptions(false);
    onNavigateToInsights?.();
  }, [onNavigateToInsights]);

  const handleCategorySelect = useCallback(
    async (category: JournalCategory) => {
      // Check if category already exists
      const exists = categories.find((c) => c.name === category.name);
      if (!exists) {
        await createCategory(category.name, category.icon, category.color);
      }
      setShowCategorySheet(false);
    },
    [categories, createCategory]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const handleCategoryFilterSelect = useCallback(
    (categoryId: string | null) => {
      setSelectedCategoryId(categoryId);
    },
    []
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Loading state for initial load
  if (isLoading && journals.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Journal List"
          onBack={onBack}
          hideBackButton={!onBack}
          rightIcon="more-horizontal"
          onRightPress={() => setShowHeaderOptions(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading journals...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Journal List"
        onBack={onBack}
        hideBackButton={!onBack}
        rightIcon="more-horizontal"
        onRightPress={() => setShowHeaderOptions(true)}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      {/* Category Filter */}
      <JournalCategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategoryFilterSelect}
        onAddCategory={() => setShowCategorySheet(true)}
        totalCount={journals.length}
      />

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Journal List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        onScroll={() => {
          if (scrollDebounceRef.current) {
            clearTimeout(scrollDebounceRef.current);
          }
          if (!isFabCompact) setIsFabCompact(true);
          // @ts-ignore
          scrollDebounceRef.current = window.setTimeout(() => {
            setIsFabCompact(false);
            scrollDebounceRef.current = null;
          }, 300);
        }}
      >
        {filteredJournals.length > 0 ? (
          filteredJournals.map((journal) => (
            <JournalCard
              key={journal.id}
              journal={journal}
              onMore={() => handleJournalMore(journal)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No journals found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? "Try a different search term"
                : "Start writing your first journal entry"}
            </Text>
          </View>
        )}

        {isLoading && journals.length > 0 && (
          <View style={styles.paginationLoader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.fabContainer}>
        <CreateButton
          label="New Journal"
          onPress={openCreateSheet}
          compact={isFabCompact}
        />
      </View>

      {/* Bottom Sheets */}
      <JournalHeaderOptionsModal
        visible={showHeaderOptions}
        onClose={() => setShowHeaderOptions(false)}
        onAddNew={handleAddNewFromHeader}
        onInsights={handleInsightsFromHeader}
      />

      <JournalOptionsModal
        visible={showOptionsSheet}
        onClose={() => {
          setShowOptionsSheet(false);
          setSelectedJournal(null);
        }}
        onEdit={handleEditJournal}
        onDelete={handleDeleteJournal}
      />

      <CreateJournalSheet
        visible={showCreateSheet}
        onClose={() => {
          setShowCreateSheet(false);
          setEditingJournal(null);
        }}
        onSubmit={handleCreateJournal}
        categories={categories}
        journal={editingJournal}
        onOpenCategorySheet={() => setShowCategorySheet(true)}
      />

      <AddCategorySheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelectCategory={handleCategorySelect}
        categories={categories}
      />

      {/* Operation Loading Overlay */}
      {(isCreating || isUpdating || isDeleting) && (
        <View style={styles.operationOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.operationText}>
            {isCreating
              ? "Creating journal..."
              : isUpdating
              ? "Updating journal..."
              : "Deleting journal..."}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  paginationLoader: {
    paddingVertical: 20,
    alignItems: "center",
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

export default JournalListScreen;
