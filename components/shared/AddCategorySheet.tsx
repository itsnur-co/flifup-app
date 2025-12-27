/**
 * Add Category Bottom Sheet Component (Shared/Reusable)
 * Category selection with custom input option
 * Works with both Task and Habit categories
 */

import {
  RadioSelectedIcon,
  RadioUnselectedIcon,
} from "@/components/icons/HabitIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Generic category type that works with both Task and Habit categories
export interface CategoryItem {
  id: string;
  name: string;
  color?: string;
}

interface AddCategorySheetProps<T extends CategoryItem> {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: T) => void;
  selectedCategory?: T | null;
  categories?: T[];
}

export function AddCategorySheet<T extends CategoryItem>({
  visible,
  onClose,
  onSelectCategory,
  selectedCategory,
  categories = [],
}: AddCategorySheetProps<T>) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<T | null>(selectedCategory || null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      // Create new category
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: Colors.primary,
      } as T;
      onSelectCategory(newCategory);
    } else if (selected) {
      onSelectCategory(selected);
    }
    setNewCategoryName("");
    onClose();
  };

  const handleSelectCategory = (category: T) => {
    setSelected(category);
    setNewCategoryName("");
  };

  const handleClose = () => {
    setNewCategoryName("");
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      snapPoints={[0.75]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Category</Text>
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* New Category Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Category Name"
              placeholderTextColor="#6B7280"
              value={newCategoryName}
              onChangeText={(text) => {
                setNewCategoryName(text);
                if (text) setSelected(null);
              }}
            />
          </View>

          {/* Choose Category Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Category</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{categories.length}</Text>
            </View>
          </View>

          {/* Category List */}
          <View style={styles.categoryList}>
            {categories.map((category) => {
              const isSelected =
                selected?.id === category.id && !newCategoryName;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handleSelectCategory(category)}
                  activeOpacity={0.7}
                >
                  {isSelected ? (
                    <RadioSelectedIcon size={24} color={Colors.primary} />
                  ) : (
                    <RadioUnselectedIcon size={24} color="#3A3A3C" />
                  )}
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

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
  content: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  countBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 14,
  },
  categoryLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default AddCategorySheet;
