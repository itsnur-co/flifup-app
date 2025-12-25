/**
 * Add People Bottom Sheet Component
 * Search and select people to assign to tasks
 * Matches Figma design exactly
 */

import { CheckIcon, SearchIcon } from "@/components/icons/TaskIcons";
import { Avatar } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import { MOCK_PEOPLE } from "@/constants/mockData";
import { Person } from "@/types/task";
import React, { useMemo, useState } from "react";
import {
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
  availablePeople?: Person[];
}

export const AddPeopleSheet: React.FC<AddPeopleSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedPeople = [],
  availablePeople = MOCK_PEOPLE,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedPeople.map((p) => p.id))
  );

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return availablePeople;

    const query = searchQuery.toLowerCase();
    return availablePeople.filter(
      (person) =>
        person.name.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query)
    );
  }, [searchQuery, availablePeople]);

  const togglePerson = (person: Person) => {
    const newSelected = new Set(selected);
    if (newSelected.has(person.id)) {
      newSelected.delete(person.id);
    } else {
      newSelected.add(person.id);
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const selectedPeopleList = availablePeople.filter((p) =>
      selected.has(p.id)
    );
    onConfirm(selectedPeopleList);
    onClose();
  };

  const renderPerson = ({ item }: { item: Person }) => {
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
  };

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
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <SearchIcon size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search People..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* People List */}
        <FlatList
          data={filteredPeople}
          renderItem={renderPerson}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No people found</Text>
            </View>
          }
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
  },
});

export default AddPeopleSheet;
