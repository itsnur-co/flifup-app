/**
 * Add People Bottom Sheet Component
 * Search and select people to assign to tasks
 * Uses real API for searching users and getting contacts
 */

import { CheckIcon, SearchIcon } from "@/components/icons/TaskIcons";
import { Avatar } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import { taskService, UserSearchResult } from "@/services/api/task.service";
import { Person } from "@/types/task";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddPeopleSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (people: Person[]) => void;
  selectedPeople?: Person[];
}

// Convert API UserSearchResult to Person
const userToPerson = (user: UserSearchResult): Person => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  avatar: user.profileImage,
});

export const AddPeopleSheet: React.FC<AddPeopleSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedPeople = [],
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedPeople.map((p) => p.id))
  );

  // API states
  const [contacts, setContacts] = useState<Person[]>([]);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Keep track of all selected people (for confirmation)
  const [allSelectedPeople, setAllSelectedPeople] = useState<Map<string, Person>>(
    new Map(selectedPeople.map((p) => [p.id, p]))
  );

  // Fetch contacts when sheet opens
  useEffect(() => {
    if (visible) {
      fetchContacts();
      // Reset states when opening
      setSearchQuery("");
      setSearchResults([]);
      setSelected(new Set(selectedPeople.map((p) => p.id)));
      setAllSelectedPeople(new Map(selectedPeople.map((p) => [p.id, p])));
    }
  }, [visible, selectedPeople]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const response = await taskService.getContacts();
      if (response.data) {
        setContacts(response.data.map(userToPerson));
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const searchUsers = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await taskService.searchUsers(query, 10);
      if (response.data) {
        setSearchResults(response.data.map(userToPerson));
      }
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Determine which list to display
  const displayList = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      return searchResults;
    }
    return contacts;
  }, [searchQuery, searchResults, contacts]);

  const togglePerson = useCallback((person: Person) => {
    setSelected((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(person.id)) {
        newSelected.delete(person.id);
        setAllSelectedPeople((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.delete(person.id);
          return newMap;
        });
      } else {
        newSelected.add(person.id);
        setAllSelectedPeople((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(person.id, person);
          return newMap;
        });
      }
      return newSelected;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    const selectedPeopleList = Array.from(allSelectedPeople.values());
    onConfirm(selectedPeopleList);
    onClose();
  }, [allSelectedPeople, onConfirm, onClose]);

  const renderPerson = useCallback(
    ({ item }: { item: Person }) => {
      const isSelected = selected.has(item.id);

      return (
        <TouchableOpacity
          style={styles.personItem}
          onPress={() => togglePerson(item)}
          activeOpacity={0.7}
        >
          <Avatar
            uri={item.avatar}
            name={item.name}
            size={44}
            borderColor={isSelected ? Colors.primary : "#3A3A3C"}
            borderWidth={2}
          />

          <View style={styles.personInfo}>
            <Text style={styles.personName}>{item.name}</Text>
            <Text style={styles.personEmail}>{item.email}</Text>
          </View>

          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <CheckIcon size={16} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
      );
    },
    [selected, togglePerson]
  );

  const renderEmptyState = useCallback(() => {
    if (isLoadingContacts || isSearching) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {isSearching ? "Searching..." : "Loading contacts..."}
          </Text>
        </View>
      );
    }

    if (searchQuery.trim().length > 0 && searchQuery.trim().length < 2) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Type at least 2 characters to search</Text>
        </View>
      );
    }

    if (searchQuery.trim().length >= 2 && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No users found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No recent contacts</Text>
        <Text style={styles.emptySubtext}>Search for users by name or email</Text>
      </View>
    );
  }, [isLoadingContacts, isSearching, searchQuery, searchResults]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={[0.95, 1]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add People</Text>
          <TouchableOpacity onPress={handleConfirm} activeOpacity={0.7}>
            <Text style={styles.addButton}>
              Add{selected.size > 0 ? ` (${selected.size})` : ""}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <SearchIcon size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or email..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {isSearching && (
              <ActivityIndicator size="small" color={Colors.primary} />
            )}
          </View>
        </View>

        {/* Section Label */}
        <View style={styles.sectionLabelContainer}>
          <Text style={styles.sectionLabel}>
            {searchQuery.trim().length >= 2
              ? `Search Results (${searchResults.length})`
              : "Recent Contacts"}
          </Text>
        </View>

        {/* People List */}
        <FlatList
          data={displayList}
          renderItem={renderPerson}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    padding: 0,
  },
  sectionLabelContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  personInfo: {
    flex: 1,
    marginLeft: 14,
  },
  personName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  personEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#3A3A3C",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#6B7280",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E93",
  },
});

export default AddPeopleSheet;
