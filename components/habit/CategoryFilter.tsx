/**
 * Category Filter Component
 * Horizontal scrollable category filter pills for habits
 */

import { Colors } from "@/constants/colors";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CategoryFilterItem {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: CategoryFilterItem[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory?: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.pillText, isSelected && styles.pillTextSelected]}
              >
                {category.name}
              </Text>
              <Text
                style={[
                  styles.pillCount,
                  isSelected && styles.pillCountSelected,
                ]}
              >
                {category.count}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Add Button */}
        {onAddCategory && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddCategory}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  pillTextSelected: {
    color: "#FFFFFF",
  },
  pillCount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  pillCountSelected: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
});

export default CategoryFilter;
