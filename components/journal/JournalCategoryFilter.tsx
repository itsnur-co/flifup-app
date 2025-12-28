/**
 * Journal Category Filter Component
 * Horizontal scrollable category filter pills
 */

import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PlusIcon } from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/colors";
import { JournalCategory } from "@/types/journal";

interface CategoryFilterProps {
  categories: JournalCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory?: () => void;
  totalCount?: number;
}

interface CategoryWithCount extends JournalCategory {
  count?: number;
}

export const JournalCategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  totalCount = 0,
}) => {
  // Add "All" option at the beginning
  const allCategories: (CategoryWithCount | { id: null; name: string; count: number })[] = [
    { id: null, name: "All Habits", count: totalCount },
    ...categories.map((cat) => ({
      ...cat,
      count: cat._count?.journals || 0,
    })),
  ];

  const renderCategoryItem = ({
    item,
  }: {
    item: CategoryWithCount | { id: null; name: string; count: number };
  }) => {
    const isSelected = selectedCategoryId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryPill,
          isSelected && styles.categoryPillSelected,
        ]}
        onPress={() => onSelectCategory(item.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.countText,
            isSelected && styles.countTextSelected,
          ]}
        >
          {item.count}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={onAddCategory}
      activeOpacity={0.7}
    >
      <PlusIcon size={16} color="#FFFFFF" />
      <Text style={styles.addButtonText}>Add</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={allCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id?.toString() || "all"}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={onAddCategory ? renderAddButton : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    gap: 8,
  },
  categoryPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  countText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  countTextSelected: {
    color: "#FFFFFF",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default JournalCategoryFilter;
